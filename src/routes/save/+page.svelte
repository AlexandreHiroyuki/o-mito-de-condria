<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	import { exportSave, hasSaveData, importSave, resetGame, saveGame } from '$lib/game.svelte';
	import { toaster } from '$lib/toaster.svelte';

	let hasExistingSave = false;
	let exportData = '';
	let showResetModal = false;
	let showExportModal = false;
	let showImportModal = false;
	let qrCodeDataUrl = '';
	let importData = '';

	onMount(() => {
		hasExistingSave = hasSaveData();
	});

	function handleSave() {
		try {
			saveGame();
			hasExistingSave = true;

			toaster.success({
				title: 'Jogo salvo com sucesso!',
				description: 'Seu progresso foi salvo no navegador.'
			});
		} catch (error) {
			console.error('Save failed:', error);
			toaster.error({
				title: 'Erro ao salvar',
				description: 'Não foi possível salvar o jogo.'
			});
		}
	}

	async function handleExport() {
		try {
			exportData = exportSave();
			hasExistingSave = true;

			const gameUrl = window.location.origin;
			const qrData = `${gameUrl}?save=${encodeURIComponent(exportData)}`;
			qrCodeDataUrl = await QRCode.toDataURL(qrData);

			showExportModal = true;
		} catch (error) {
			console.error('Export failed:', error);
			toaster.error({
				title: 'Erro ao exportar',
				description: 'Não foi possível exportar o save.'
			});
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(exportData);
			toaster.success({
				title: 'Copiado!',
				description: 'Save copiado para a área de transferência.'
			});
		} catch (error) {
			console.error('Copy failed:', error);
			toaster.error({
				title: 'Erro ao copiar',
				description: 'Não foi possível copiar o save.'
			});
		}
	}

	function downloadAsText() {
		try {
			const blob = new Blob([exportData], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `o-mito-de-condria-save-${new Date().toISOString().split('T')[0]}.txt`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toaster.success({
				title: 'Download concluído!',
				description: 'Arquivo salvo com sucesso.'
			});
		} catch (error) {
			console.error('Download failed:', error);
			toaster.error({
				title: 'Erro ao baixar',
				description: 'Não foi possível baixar o arquivo.'
			});
		}
	}

	function closeExportModal() {
		showExportModal = false;
	}

	function closeImportModal() {
		showImportModal = false;
		importData = '';
	}

	async function handleImportFromString() {
		try {
			if (!importData.trim()) {
				toaster.error({
					title: 'Erro ao importar',
					description: 'Por favor, cole o save string.'
				});
				return;
			}

			const success = importSave(importData.trim());
			if (success) {
				toaster.success({
					title: 'Save importado com sucesso!',
					description: 'Seu progresso foi carregado.'
				});
				hasExistingSave = true;
				closeImportModal();
			} else {
				toaster.error({
					title: 'Erro ao importar',
					description: 'Save inválido ou corrompido.'
				});
			}
		} catch (error) {
			console.error('Import failed:', error);
			toaster.error({
				title: 'Erro ao importar',
				description: 'Save inválido ou corrompido.'
			});
		}
	}

	async function handleImportFromFile(event: Event) {
		try {
			const target = event.target as HTMLInputElement;
			const file = target.files?.[0];

			if (!file) {
				toaster.error({
					title: 'Erro ao importar',
					description: 'Por favor, selecione um arquivo.'
				});
				return;
			}

			const text = await file.text();
			importData = text.trim();

			if (!importData) {
				toaster.error({
					title: 'Erro ao importar',
					description: 'Arquivo vazio ou inválido.'
				});
				return;
			}

			const success = importSave(importData);
			if (success) {
				toaster.success({
					title: 'Save importado com sucesso!',
					description: 'Seu progresso foi carregado do arquivo.'
				});
				hasExistingSave = true;
				closeImportModal();
			} else {
				toaster.error({
					title: 'Erro ao importar',
					description: 'Arquivo contém save inválido ou corrompido.'
				});
			}
		} catch (error) {
			console.error('File import failed:', error);
			toaster.error({
				title: 'Erro ao importar',
				description: 'Não foi possível ler o arquivo.'
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
	<div class="mb-10 rounded-xl bg-white/80 p-6">
		<h2 class="mb-4 text-2xl font-semibold text-gray-700">Exportar Progresso</h2>
		<p class="mb-6 leading-relaxed text-gray-600">
			Salve seu progresso atual em um arquivo que pode ser importado posteriormente.
		</p>

		<div class="mb-4 flex flex-row flex-wrap gap-4">
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
				on:click={handleSave}
			>
				Salvar Jogo
			</button>
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
				on:click={handleExport}
			>
				Exportar Save
			</button>
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
				on:click={() => (showImportModal = true)}
			>
				Importar Save
			</button>
			<button
				class="flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
				on:click={handleResetClick}
			>
				Resetar Jogo
			</button>
		</div>
	</div>

	<div class="mb-10 rounded-xl bg-white/80 p-6">
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

	<div class="rounded-full bg-white/80 p-2 text-center">
		<span class="text-xs text-gray-500">Alexandre Hiroyuki Yamauchi @ UFABC</span>
		<a
			href="https://github.com/AlexandreHiroyuki"
			target="_blank"
			rel="noopener noreferrer"
			class="text-xs text-gray-500 hover:underline hover:decoration-gray-200"
			>github.com/AlexandreHiroyuki</a
		>
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

<!-- Import Modal -->
{#if showImportModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={(event) => {
			if (event.target === event.currentTarget) {
				closeImportModal();
			}
		}}
		on:keydown={handleKeydown}
		tabindex="-1"
		aria-modal="true"
		role="dialog"
	>
		<div class="mx-4 max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" role="document">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-800">Importar Save</h3>
				<button
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					on:click={closeImportModal}
				>
					✕
				</button>
			</div>

			<!-- Section 1: Save String Input -->
			<div class="mb-6">
				<h4 class="mb-3 text-lg font-medium text-gray-700">Cole o Save String</h4>
				<div class="mb-3">
					<textarea
						bind:value={importData}
						placeholder="Cole aqui o save string..."
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 focus:border-blue-500 focus:outline-none"
						rows="4"
					></textarea>
				</div>
				<button
					class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
					on:click={handleImportFromString}
				>
					Importar Save String
				</button>
			</div>

			<!-- Skeleton Divider -->
			<hr class="hr border-t-2 border-gray-200" />

			<!-- Section 2: File Upload -->
			<div class="mt-6">
				<h4 class="mb-3 text-lg font-medium text-gray-700">Ou Faça Upload do Arquivo</h4>
				<div class="mb-3">
					<label
						for="file-upload"
						class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-gray-400 hover:bg-gray-100"
					>
						<div class="text-center">
							<div class="mb-2 text-4xl">📁</div>
							<p class="text-sm text-gray-600">Clique para selecionar ou arraste o arquivo aqui</p>
							<p class="text-xs text-gray-500">Arquivo .txt com o save string</p>
						</div>
					</label>
					<input
						id="file-upload"
						type="file"
						accept=".txt"
						class="hidden"
						on:change={handleImportFromFile}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Export Modal -->
{#if showExportModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={(event) => {
			if (event.target === event.currentTarget) {
				closeExportModal();
			}
		}}
		on:keydown={handleKeydown}
		tabindex="-1"
		aria-modal="true"
		role="dialog"
	>
		<div class="mx-4 max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" role="document">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-800">Exportar Save</h3>
				<button
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					on:click={closeExportModal}
				>
					✕
				</button>
			</div>

			<!-- Section 1: Save String -->
			<div class="mb-6">
				<h4 class="mb-3 text-lg font-medium text-gray-700">Dados do Save</h4>
				<div class="mb-3">
					<input
						type="text"
						value={exportData}
						readonly
						class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:outline-none"
						placeholder="Dados do save..."
					/>
				</div>
				<div class="flex gap-3">
					<button
						class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
						on:click={copyToClipboard}
					>
						Copiar para Área de Transferência
					</button>
					<button
						class="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
						on:click={downloadAsText}
					>
						Baixar como Arquivo
					</button>
				</div>
			</div>

			<!-- Skeleton Divider -->
			<hr class="hr border-t-2 border-gray-200" />

			<!-- Section 2: QR Code -->
			<div class="mt-6">
				<h4 class="mb-3 text-lg font-medium text-gray-700">QR Code para Compartilhamento</h4>
				<div class="flex justify-center">
					{#if qrCodeDataUrl}
						<img
							src={qrCodeDataUrl}
							alt="QR Code para compartilhamento do save"
							class="rounded-lg border-2 border-gray-200"
							width="200"
							height="200"
						/>
					{:else}
						<div
							class="flex h-[200px] w-[200px] items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50"
						>
							<span class="text-gray-400">Gerando QR Code...</span>
						</div>
					{/if}
				</div>
				<p class="mt-3 text-center text-sm text-gray-600">
					Escaneie este QR Code para carregar o save em outro dispositivo
				</p>
			</div>
		</div>
	</div>
{/if}
