<script lang="ts">
	import { onMount } from 'svelte';
	import { exportSave, hasSaveData, resetGame } from '../../lib/game.js';
	import { toaster } from '../../lib/toaster.js';

	let hasExistingSave = false;
	let exportData = '';
	let showResetModal = false;

	onMount(() => {
		hasExistingSave = hasSaveData();
	});

	function handleExport() {
		try {
			exportData = exportSave();
			hasExistingSave = true;

			// Create downloadable file
			const blob = new Blob([exportData], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `o-mito-de-condria-save-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toaster.success({
				title: 'Save exportado com sucesso!',
				description: 'O arquivo foi baixado automaticamente.'
			});
		} catch (error) {
			console.error('Export failed:', error);
			toaster.error({
				title: 'Erro ao exportar',
				description: 'Não foi possível exportar o save.'
			});
		}
	}

	function handleResetClick() {
		showResetModal = true;
	}

	function handleResetConfirm() {
		resetGame();
		hasExistingSave = false;
		showResetModal = false;

		toaster.success({
			title: 'Jogo resetado com sucesso!',
			description: 'Todos os dados foram apagados.'
		});
	}

	function handleResetCancel() {
		showResetModal = false;
	}

	// Close modal when clicking outside
	function handleModalBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			showResetModal = false;
		}
	}

	// Close modal with keyboard
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showResetModal = false;
		}
	}
</script>

<svelte:head>
	<title>Salvar Jogo - O Mito de Condria</title>
</svelte:head>

<div class="h-[80vh] overflow-y-auto px-4 pt-20 pb-20">
	<div class="mb-10 rounded-xl border border-gray-200 bg-white/80 p-6">
		<h2 class="mb-4 text-2xl font-semibold text-gray-700">Exportar Progresso</h2>
		<p class="mb-6 leading-relaxed text-gray-600">
			Salve seu progresso atual em um arquivo que pode ser importado posteriormente.
		</p>

		<div class="mb-4 flex gap-4">
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
				on:click={handleExport}
			>
				Exportar Save
			</button>
		</div>

		<div class="flex gap-4">
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
				on:click={handleResetClick}
			>
				Resetar Jogo
			</button>
		</div>
	</div>

	<div class="mb-10 rounded-xl border border-gray-200 bg-white/80 p-6">
		<div class="text-center">
			{#if hasExistingSave}
				<span
					class="mb-2 inline-block rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-semibold text-white"
				>
					✓ Save Disponível
				</span>
				<p class="text-gray-600">Existe um save salvo no navegador.</p>
			{:else}
				<span
					class="mb-2 inline-block rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-semibold text-white"
				>
					✗ Sem Save
				</span>
				<p class="text-gray-600">Nenhum save encontrado no navegador.</p>
			{/if}
		</div>
	</div>
</div>

<!-- Reset Confirmation Modal -->
{#if showResetModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={handleModalBackdropClick}
		on:keydown={handleKeydown}
		tabindex="-1"
		aria-modal="true"
		role="dialog"
	>
		<div class="mx-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="mb-4 flex items-center">
				<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
					<span class="text-2xl">⚠️</span>
				</div>
				<h3 class="text-xl font-semibold text-gray-800">Confirmar Reset</h3>
			</div>

			<p class="mb-6 leading-relaxed text-gray-600">
				⚠️ <strong>Atenção:</strong> Esta ação irá apagar todo o progresso atual e não pode ser desfeita.
			</p>

			<div class="flex gap-3">
				<button
					class="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
					on:click={handleResetCancel}
				>
					Cancelar
				</button>
				<button
					class="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
					on:click={handleResetConfirm}
				>
					Confirmar Reset
				</button>
			</div>
		</div>
	</div>
{/if}
