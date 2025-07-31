<script lang="ts">
	import {
		canProgressMitosis,
		gameState,
		getScaledMitosisCost,
		mitosisDuration,
		mitosisStages,
		performMeiosis,
		transitionMitosisStage
	} from '$lib/game.svelte';
	import { bigNumberFormatter, formatCost, formatTimeRemaining } from '$lib/utilities.js';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { onDestroy, onMount } from 'svelte';

	let timer: NodeJS.Timeout;

	onMount(() => {
		// Update UI every 100ms for smoother progress bar updates
		timer = setInterval(() => {
			// Trigger reactivity by accessing gameState
			gameState.mitosisProgress;
		}, 100);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	function handleMitosis() {
		if (transitionMitosisStage()) {
			// Success feedback could be added here
		}
	}

	function handleProgressMitosis() {
		if (transitionMitosisStage()) {
			// Success feedback could be added here
		}
	}

	function handleMeiosis() {
		if (performMeiosis()) {
			// Success feedback could be added here
		}
	}

	// Reactive statements for mitosis progress
	const currentStage = $derived(mitosisStages[gameState.mitosisProgress.currentStage]);
	const currentStageIndex = $derived(gameState.mitosisProgress.currentStage);
	const canProgress = $derived(canProgressMitosis());
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

<!-- Mitosis Progress Section -->
{#if gameState.mitosisProgress.progress > 0}
	<div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
		<div class="text-center">
			<h3 class="mb-4 text-lg font-semibold text-green-700">Mitose em Progresso</h3>

			<!-- Current Stage Progress -->
			{#if currentStage}
				<div class="mb-4">
					<!-- Overall Progress -->
					<div class="mb-3">
						<h4 class="mb-2 font-semibold text-gray-800">Progresso Geral da Mitose</h4>
						<div class="flex items-center gap-3">
							<div class="text-sm font-medium text-blue-600">
								{Math.round(gameState.mitosisProgress.progress * 100)}%
							</div>
							<div class="flex-1">
								<Progress
									value={Math.min(gameState.mitosisProgress.progress * 100, 100)}
									max={100}
									meterBg="bg-blue-500"
								/>
							</div>
							{#if gameState.mitosisProgress.progress > 0}
								<div class="text-xs text-gray-600">
									{formatTimeRemaining(
										(mitosisDuration - gameState.mitosisProgress.progress * mitosisDuration) * 1000
									)}
								</div>
							{/if}
						</div>
					</div>

					<!-- Current Stage Info -->
					<div class="mb-3">
						<h4 class="mb-2 font-semibold text-gray-800">{currentStage.name}</h4>
						<p class="mb-3 text-sm text-gray-600">{currentStage.description}</p>
						{#if currentStageIndex > 0}
							<div class="mb-3 text-sm">
								<span class="font-medium">Custo Base: {formatCost(currentStage.resourceCost)}</span>
								{#if gameState.resources.cells > 0}
									<div class="text-xs text-orange-600">
										Custo Real: {formatCost(
											Object.fromEntries(
												Object.entries(currentStage.resourceCost).map(([resource, amount]) => [
													resource,
													getScaledMitosisCost(amount as number)
												])
											)
										)} (+{gameState.resources.cells * 10}% por {gameState.resources.cells} célula{gameState
											.resources.cells > 1
											? 's'
											: ''})
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Progress Button -->
					<button
						class="rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
						disabled={!canProgress}
						onclick={handleProgressMitosis}
					>
						{canProgress ? 'Progresso para Próximo Estágio' : 'Aguardando Conclusão'}
					</button>
				</div>
			{/if}
		</div>
	</div>
{:else}
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

			<!-- Mitosis Requirements Warning -->
			{#if !gameState.purchasedUpgrades.centriole}
				<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
					<div class="text-sm text-red-800">
						⚠️ <strong>Requisito não atendido:</strong> Você precisa comprar o
						<strong>Centríolo</strong> para desbloquear a mitose.
					</div>
				</div>
			{/if}

			<!-- Mitosis Stages Overview -->
			<div class="mb-4 rounded-lg bg-green-50 p-4">
				<h4 class="mb-2 font-semibold text-green-800">Estágios da Mitose:</h4>
				<div class="text-sm text-green-700">
					<div class="mb-1">0. Interfase - Estado padrão da célula (sem custo)</div>
					<div class="mb-1">1. Prófase - 25 ATP, 15 Oxigênio (3 min)</div>
					<div class="mb-1">2. Metáfase - 30 ATP, 20 Glicose (2 min)</div>
					<div class="mb-1">3. Anáfase - 35 ATP, 20 Proteínas, 10 Oxigênio (3 min)</div>
					<div class="mb-1">4. Telófase - 40 ATP, 25 Glicose, 15 Proteínas (2 min)</div>
					<div class="mb-1">
						5. Citocinese - 50 ATP, 30 Proteínas, 20 Oxigênio, 15 Glicose (3 min)
					</div>
				</div>
				<div class="mt-2 text-xs text-green-600">Recompensa: +1 Célula</div>
				{#if gameState.resources.cells > 0}
					<div class="mt-2 text-xs text-orange-600">
						⚠️ Custo aumenta +10% por célula já possuída (atual: +{gameState.resources.cells * 10}%)
					</div>
				{/if}
			</div>

			<!-- Mitosis Start Button -->
			<button
				class="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
				disabled={!gameState.purchasedUpgrades.centriole}
				onclick={handleMitosis}
			>
				{gameState.purchasedUpgrades.centriole ? 'Iniciar Mitose' : 'Falta Ingredientes'}
			</button>
		</div>
	</div>
{/if}

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
