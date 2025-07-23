<script lang="ts">
	import CircleFadingArrowUpIcon from '@lucide/svelte/icons/circle-fading-arrow-up';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	import '../app.css';
	import { bigNumberFormatter } from '../lib/formatter.js';
	import { gameStore, startGameTimer, stopGameTimer } from '../lib/game.js';

	let value = $state('game');
	let { children } = $props();

	$effect(() => {
		startGameTimer();

		return () => {
			stopGameTimer();
		};
	});
</script>

<main class="flex h-full w-full items-center justify-center">
	<div
		class="fixed top-0 w-full rounded-b-xl border-5 border-white bg-white p-2 font-semibold text-black shadow-[0_2px_2px_2px] shadow-black/60"
	>
		<div class="grid grid-cols-4 gap-2 text-center text-sm">
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Proteínas</span>
				<span>{bigNumberFormatter.format($gameStore.resources.proteinas)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format($gameStore.gainSpeeds.proteinas)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Oxigênio</span>
				<span>{bigNumberFormatter.format($gameStore.resources.oxigenio)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format($gameStore.gainSpeeds.oxigenio)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Glicose</span>
				<span>{bigNumberFormatter.format($gameStore.resources.glicose)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format($gameStore.gainSpeeds.glicose)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">ATP (energia)</span>
				<span>{bigNumberFormatter.format($gameStore.resources.atp)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format($gameStore.gainSpeeds.atp)}/s</span
				>
			</div>
		</div>
	</div>

	{@render children()}

	<div
		class="fixed bottom-0 w-full rounded-t-xl border-white bg-white font-semibold text-black shadow-[0_-2px_2px_2px] shadow-black/60"
	>
		<Navigation.Bar {value} onValueChange={(newValue: string) => (value = newValue)}>
			<Navigation.Tile href="/" id="game" label="Células"
				><CircleFadingArrowUpIcon /></Navigation.Tile
			>
			<Navigation.Tile href="/discoveries" id="discoveries" label="Descobertas"
				><NotebookPenIcon /></Navigation.Tile
			>
			<Navigation.Tile href="/save" id="save" label="Salvar"><SaveIcon /></Navigation.Tile>
		</Navigation.Bar>
	</div>
</main>
