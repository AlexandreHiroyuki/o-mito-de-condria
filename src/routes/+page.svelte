<script lang="ts">
	import {
		canProgressMitosis,
		gameState,
		mitosisDuration,
		mitosisStages,
		transitionMitosisStage
	} from '$lib/game.svelte';
	import { formatTimeRemaining } from '$lib/utilities.js';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { onDestroy, onMount } from 'svelte';

	let timer: NodeJS.Timeout;

	// Reactive statements for mitosis progress
	let canProgress = $state(false);

	onMount(() => {
		// Update UI every 100ms for smoother progress bar updates
		timer = setInterval(() => {
			// Trigger reactivity by accessing gameState
			canProgress = canProgressMitosis();
		}, 100);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	function handleProgressMitosis() {
		if (transitionMitosisStage()) {
			// Success feedback could be added here
		}
	}
</script>

<svelte:head>
	<title>O Mito de Condria</title>
</svelte:head>

<div class="flex h-full w-full flex-1 flex-col items-center justify-center">
	<!-- Cell Shell Sprite -->
	<a
		class="relative flex h-[60%] w-[100%] items-center justify-center bg-[url('/cell_shell.png')] bg-contain bg-center bg-no-repeat transition-transform active:scale-95"
		aria-label="Cell Shell"
		href="/cell"
	>
		{#if gameState.purchasedUpgrades.nucleus}
			<div
				class="animate-float absolute top-1/2 left-1/2 h-[25%] w-[25%] bg-[url('/nucleus.png')] bg-contain bg-center bg-no-repeat"
			></div>
		{/if}
		{#if gameState.purchasedUpgrades.mitochondria}
			<div
				class="animate-float absolute top-1/2 left-1/2 h-[9%] w-[9%] -translate-x-[84px] -translate-y-[60px] rotate-42 bg-[url('/mithocondria.png')] bg-contain bg-center bg-no-repeat"
			></div>
			<div
				class="animate-float absolute top-1/2 left-1/2 h-[10%] w-[10%] translate-x-[80px] translate-y-[8px] rotate-12 bg-[url('/mithocondria.png')] bg-contain bg-center bg-no-repeat"
			></div>
			<div
				class="animate-float absolute top-1/2 left-1/2 h-[8%] w-[8%] -translate-x-[12px] translate-y-[64px] -rotate-32 bg-[url('/mithocondria.png')] bg-contain bg-center bg-no-repeat"
			></div>
		{/if}
	</a>

	<!-- Mitosis Progress Bar -->
	{#if gameState.mitosisProgress.progress > 0}
		<div class="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
			<!-- Overall Progress -->
			<div class="mb-3">
				<h4 class="mb-2 text-sm font-medium text-gray-800">
					Mitose: {mitosisStages[gameState.mitosisProgress.currentStage].name}
				</h4>
				<div class="flex items-center gap-3">
					<div class="text-sm font-medium text-blue-600">
						{Math.round(gameState.mitosisProgress.progress * 100)}%
					</div>
					<div class="flex-1">
						<Progress
							value={Math.min(gameState.mitosisProgress.progress * 100, 100)}
							max={100}
							meterBg="bg-blue-500"
							height="h-2"
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

			<!-- Progress Button -->
			<div class="mb-2">
				<button
					class="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
					disabled={!canProgress}
					onclick={handleProgressMitosis}
				>
					{canProgress ? 'Próxima Fase' : 'Aguardando'}
				</button>
			</div>
		</div>
	{/if}
</div>
