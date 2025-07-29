<script lang="ts">
	import CircleFadingArrowUpIcon from '@lucide/svelte/icons/circle-fading-arrow-up';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Navigation, Toaster } from '@skeletonlabs/skeleton-svelte';
	import type { Config } from '@sveltejs/adapter-vercel';

	import {
		gameState,
		importSave,
		loadGame,
		saveGame,
		startGameTimer,
		stopGameTimer
	} from '$lib/game.svelte';
	import { toaster } from '$lib/toaster.svelte';
	import { bigNumberFormatter } from '$lib/utilities.js';

	import '../app.css';

	export const config: Config = {
		runtime: 'edge'
	};

	let value = $state('game');
	let { children } = $props();

	$effect(() => {
		// Check for save parameter in URL
		const urlParams = new URLSearchParams(window.location.search);
		const saveParam = urlParams.get('save');

		if (saveParam) {
			try {
				const success = importSave(saveParam);
				if (success) {
					toaster.success({
						title: 'Save carregado com sucesso!',
						description: 'Seu progresso foi importado da URL.'
					});
					// Remove the save parameter from URL to avoid reloading on refresh
					const newUrl = new URL(window.location.href);
					newUrl.searchParams.delete('save');
					window.history.replaceState({}, '', newUrl.toString());
				} else {
					toaster.error({
						title: 'Erro ao carregar save',
						description: 'Save inválido ou corrompido na URL.'
					});
					// Still try to load from localStorage as fallback
					loadGame();
				}
			} catch (error) {
				console.error('Failed to import save from URL:', error);
				toaster.error({
					title: 'Erro ao carregar save',
					description: 'Não foi possível processar o save da URL.'
				});
				// Fallback to localStorage
				loadGame();
			}
		} else {
			// No save parameter, load from localStorage
			loadGame();
		}
	});

	$effect(() => {
		startGameTimer();

		return () => {
			stopGameTimer();
		};
	});

	$effect(() => {
		const autoSaveInterval = setInterval(() => {
			saveGame();
		}, 30000);

		return () => {
			clearInterval(autoSaveInterval);
		};
	});
</script>

<main
	class="flex h-full w-full items-center justify-center bg-[url('/microscope_background.gif')] bg-center bg-repeat bg-origin-border"
>
	<div
		class="fixed top-0 z-10 w-full rounded-b-xl border-5 border-white bg-white p-2 font-semibold text-black shadow-[0_2px_2px_2px] shadow-black/60"
	>
		<div class="grid grid-cols-4 gap-2 text-center text-sm">
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Proteínas</span>
				<span>{bigNumberFormatter.format(gameState.resources.proteinas)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format(gameState.gainSpeeds.proteinas)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Oxigênio</span>
				<span>{bigNumberFormatter.format(gameState.resources.oxigenio)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format(gameState.gainSpeeds.oxigenio)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">Glicose</span>
				<span>{bigNumberFormatter.format(gameState.resources.glicose)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format(gameState.gainSpeeds.glicose)}/s</span
				>
			</div>
			<div class="flex flex-col">
				<span class="text-xs text-gray-600">ATP (energia)</span>
				<span>{bigNumberFormatter.format(gameState.resources.atp)}</span>
				<span class="text-xs text-gray-400"
					>+{bigNumberFormatter.format(gameState.gainSpeeds.atp)}/s</span
				>
			</div>
		</div>
	</div>

	{@render children()}

	<Toaster
		{toaster}
		base="p-4 flex gap-2 items-center justify-center rounded-lg"
		stateError="bg-gradient-to-r from-error-500 to-error-700 text-white"
		stateSuccess="bg-gradient-to-r from-success-500 to-success-600 text-black"
		stateInfo="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
		stateWarning="bg-gradient-to-r from-warning-300 to-warning-500 text-black"
	/>

	<div
		class="fixed bottom-0 z-10 w-full rounded-t-xl border-white bg-white font-semibold text-black shadow-[0_-2px_2px_2px] shadow-black/60"
	>
		<Navigation.Bar
			{value}
			onValueChange={(newValue: string) => (value = newValue)}
			background="bg-white"
			classes="rounded-t-xl"
			tilesClasses="rounded-t-xl"
		>
			<Navigation.Tile
				href="/"
				id="game"
				label="Células"
				classes="rounded-tl-xl flex-col justify-center"
				active="bg-black text-white"><CircleFadingArrowUpIcon /></Navigation.Tile
			>
			<Navigation.Tile
				href="/discoveries"
				id="discoveries"
				label="Descobertas"
				classes="flex-col justify-center"
				active="bg-black text-white"><NotebookPenIcon /></Navigation.Tile
			>
			<Navigation.Tile
				href="/save"
				id="save"
				label="Salvar"
				classes="rounded-tr-xl flex-col justify-center"
				active="bg-black text-white"><SaveIcon /></Navigation.Tile
			>
		</Navigation.Bar>
	</div>
</main>
