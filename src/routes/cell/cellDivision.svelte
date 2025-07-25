<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { gameStore, startGameTimer, stopGameTimer } from '../../lib/game.js';

	// Start the game timer when the component mounts
	onMount(() => {
		startGameTimer();
	});

	// Clean up timer when component is destroyed
	onDestroy(() => {
		stopGameTimer();
	});
</script>

<h2 class="mb-4 text-xl font-bold">Divisão Celular</h2>

<!-- Resources Display -->
<div class="mb-6 rounded-lg bg-white p-4 shadow-lg">
	<h3 class="mb-3 text-lg font-semibold">Recursos</h3>
	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each Object.entries($gameStore.resources) as [resource, amount]}
			<div class="text-center">
				<div class="font-bold capitalize">{resource}</div>
				<div class="text-sm">{amount.toFixed(1)}</div>
			</div>
		{/each}
	</div>
</div>

<!-- Cell Division Interface -->
<div class="rounded-lg bg-white p-6 shadow-lg">
	<div class="text-center">
		<div
			class="mx-auto mb-4 h-32 w-32 bg-[url('/cell_shell.png')] bg-contain bg-center bg-no-repeat"
		></div>
		<h3 class="mb-2 text-lg font-semibold">Célula Pronta para Divisão</h3>
		<p class="mb-4 text-sm text-gray-600">
			Acumule recursos suficientes para iniciar a divisão celular
		</p>

		<!-- Division Requirements -->
		<div class="mb-4 rounded-lg bg-gray-50 p-4">
			<h4 class="mb-2 font-semibold">Requisitos para Divisão:</h4>
			<ul class="text-sm text-gray-700">
				<li>• 100 ATP</li>
				<li>• 50 Proteínas</li>
				<li>• 30 Oxigênio</li>
				<li>• 25 Glicose</li>
			</ul>
		</div>

		<!-- Division Button -->
		<button
			class="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			disabled={$gameStore.resources.atp < 100 ||
				$gameStore.resources.proteinas < 50 ||
				$gameStore.resources.oxigenio < 30 ||
				$gameStore.resources.glicose < 25}
		>
			Iniciar Divisão Celular
		</button>
	</div>
</div>
