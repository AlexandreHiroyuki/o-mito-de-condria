<script lang="ts">
	import { bigNumberFormatter } from '$lib/formatter.js';
	import { gameState, performMeiosis, performMitosis } from '$lib/game.svelte';

	function handleMitosis() {
		if (performMitosis()) {
			// Success feedback could be added here
		}
	}

	function handleMeiosis() {
		if (performMeiosis()) {
			// Success feedback could be added here
		}
	}
</script>

<h2 class="mb-4 text-xl font-bold">Divisão Celular</h2>

<!-- Resources Display -->
<div class="mb-6 rounded-lg bg-white p-4 shadow-lg">
	<div class="mt-3 flex justify-around gap-2">
		<span class="text-sm font-semibold text-green-700">
			Células: {bigNumberFormatter.format(gameState.resources.cells)}
		</span>
		<span class="text-sm font-semibold text-purple-600">
			Multiplicador de Meiose: +{gameState.meiosisMultiplier * 100}%
		</span>
	</div>
</div>

<!-- Mitosis Section -->
<div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
	<div class="text-center">
		<div
			class="mx-auto mb-4 h-32 w-32 bg-[url('/cell_shell.png')] bg-contain bg-center bg-no-repeat"
		></div>
		<h3 class="mb-2 text-lg font-semibold text-green-700">Mitose</h3>
		<p class="mb-4 text-sm text-gray-600">
			Divida sua célula para criar uma nova célula idêntica. Ganhe células como um novo recurso!
		</p>

		<!-- Mitosis Requirements -->
		<div class="mb-4 rounded-lg bg-green-50 p-4">
			<h4 class="mb-2 font-semibold text-green-800">Requisitos para Mitose:</h4>
			<ul class="text-sm text-green-700">
				<li>• 100 ATP</li>
				<li>• 50 Proteínas</li>
				<li>• 30 Oxigênio</li>
				<li>• 25 Glicose</li>
			</ul>
			<div class="mt-2 text-xs text-green-600">Recompensa: +1 Célula</div>
		</div>

		<!-- Mitosis Button -->
		<button
			class="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			disabled={gameState.resources.atp < 100 ||
				gameState.resources.proteinas < 50 ||
				gameState.resources.oxigenio < 30 ||
				gameState.resources.glicose < 25}
			onclick={handleMitosis}
		>
			Iniciar Mitose
		</button>
	</div>
</div>

<!-- Meiosis Section -->
<div class="rounded-lg bg-white p-6 shadow-lg">
	<div class="text-center">
		<div
			class="mx-auto mb-4 h-32 w-32 bg-[url('/nucleus.png')] bg-contain bg-center bg-no-repeat opacity-80"
		></div>
		<h3 class="mb-2 text-lg font-semibold text-purple-700">Meiose</h3>
		<p class="mb-4 text-sm text-gray-600">
			Você divide suas células para reprodução e inicia um novo organismo. Um novo jogo começa com
			um bônus especial que multiplica a produção de todos os recursos!
		</p>

		<!-- Meiosis Requirements -->
		<div class="mb-4 rounded-lg bg-purple-50 p-4">
			<h4 class="mb-2 font-semibold text-purple-800">Requisitos para Meiose:</h4>
			<ul class="text-sm text-purple-700">
				<li>• 10 Células</li>
			</ul>
			<div class="mt-2 text-xs text-purple-600">
				Recompensa: Novo Jogo {gameState.meiosisMultiplier}% + {Math.floor(
					gameState.resources.cells / 10
				)}% de produção (+1% p/ cada 10 células)
			</div>
		</div>

		<!-- Warning about reset -->
		<div class="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
			<div class="text-sm text-yellow-800">
				⚠️ <strong>Atenção:</strong> A meiose irá resetar o jogo para o estado inicial, mas manterá um
				multiplicador de produção permanente.
			</div>
		</div>

		<!-- Meiosis Button -->
		<button
			class="rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-600 active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			disabled={gameState.resources.cells < 10}
			onclick={handleMeiosis}
		>
			Iniciar Meiose
		</button>
	</div>
</div>
