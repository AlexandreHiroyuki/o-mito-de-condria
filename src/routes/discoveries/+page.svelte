<script lang="ts">
	import type { Discovery } from '$lib/game.discoveries.svelte';
	import { discoveries } from '$lib/game.discoveries.svelte';
	import { gameState } from '$lib/game.svelte';

	let selectedDiscovery: Discovery | null = null;
	let showModal = false;

	function openDiscovery(discovery: Discovery) {
		selectedDiscovery = discovery;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedDiscovery = null;
	}

	// Get all discovered items
	const discoveredItems = $derived(
		Object.entries(discoveries).filter(([id]) => gameState.discoveries[id])
	);

	// Get all undiscovered items
	const undiscoveredItems = $derived(
		Object.entries(discoveries).filter(([id]) => !gameState.discoveries[id])
	);
</script>

<svelte:head>
	<title>Descobertas - O Mito de Condria</title>
</svelte:head>

<div class="h-[80vh] overflow-y-auto px-4 pt-20 pb-20">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-8 rounded-lg bg-white p-4 text-2xl font-bold text-gray-800">
			Descobertas Científicas
		</h1>

		<!-- Discovered Items -->
		{#if discoveredItems.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 rounded-lg bg-white p-4 text-xl font-semibold text-green-700">
					Descobertas Realizadas ({discoveredItems.length})
				</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each discoveredItems as [id, discovery]}
						<button
							onclick={() => openDiscovery(discovery)}
							class="rounded-lg border border-green-300 bg-green-100 p-4 text-left transition-colors hover:bg-green-200"
						>
							<div class="flex items-center gap-3">
								{#if discovery.image}
									<img
										src={discovery.image}
										alt={discovery.name}
										class="h-12 w-12 rounded object-cover"
									/>
								{/if}
								<div>
									<h3 class="font-semibold text-green-800">{discovery.name}</h3>
									<p class="mt-1 text-sm text-green-600">{discovery.message}</p>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Undiscovered Items -->
		{#if undiscoveredItems.length > 0}
			<div>
				<h2 class="mb-4 rounded-lg bg-white p-4 text-xl font-semibold text-gray-600">
					Descobertas Pendentes ({undiscoveredItems.length})
				</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each undiscoveredItems as [id, discovery]}
						<div class="rounded-lg border border-gray-300 bg-gray-100 p-4 opacity-60">
							<div class="flex items-center gap-3">
								<div class="flex h-12 w-12 items-center justify-center rounded bg-gray-300">
									<span class="text-2xl text-gray-500">?</span>
								</div>
								<div>
									<h3 class="font-semibold text-gray-500">Descoberta Desconhecida</h3>
									<p class="mt-1 text-sm text-gray-400">Continue pesquisando para descobrir</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if discoveredItems.length === 0 && undiscoveredItems.length === 0}
			<div class="py-12 text-center">
				<p class="text-lg text-gray-500">Nenhuma descoberta disponível ainda.</p>
			</div>
		{/if}
	</div>
</div>

<!-- Modal -->
{#if showModal && selectedDiscovery}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
		<div class="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
			<div class="p-6">
				<div class="mb-4 flex items-start justify-between">
					<h2 class="text-2xl font-bold text-gray-800">{selectedDiscovery.name}</h2>
					<button onclick={closeModal} class="text-2xl font-bold text-gray-500 hover:text-gray-700">
						×
					</button>
				</div>

				{#if selectedDiscovery.image}
					<div class="mb-4">
						<img
							src={selectedDiscovery.image}
							alt={selectedDiscovery.name}
							class="h-48 w-full rounded-lg object-cover"
						/>
					</div>
				{/if}

				<div class="mb-4">
					<p class="mb-3 text-lg text-gray-700">{selectedDiscovery.message}</p>
					{#if selectedDiscovery.description}
						<p class="text-gray-600">{selectedDiscovery.description}</p>
					{/if}
				</div>

				<div class="flex justify-end">
					<button
						onclick={closeModal}
						class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
					>
						Fechar
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
