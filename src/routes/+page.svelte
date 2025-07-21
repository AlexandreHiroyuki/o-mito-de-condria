<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	import CircleFadingArrowUpIcon from '@lucide/svelte/icons/circle-fading-arrow-up';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import SaveIcon from '@lucide/svelte/icons/save';

	let value = $state('game');
</script>

<div class="flex h-full w-full flex-1 items-center justify-center">
	<button class="relative flex items-center justify-center transition-transform active:scale-95">
		<img src="/cell_shell.png" alt="Cell Shell" class="max-h-[90vh] w-[90%]" />
		<img src="/nucleus.png" alt="Nucleus" class="absolute w-[50%] object-contain" />
	</button>
</div>

<div
	class="fixed bottom-0 w-full border-5 border-white bg-white shadow-[0_-2px_4px_4px] shadow-black/60"
>
	<div class="bg-tertiary-500 rounded-xl p-1 font-semibold text-white">
		<Navigation.Bar {value} onValueChange={(newValue: string) => (value = newValue)}>
			<Navigation.Tile id="game" label="Células"><CircleFadingArrowUpIcon /></Navigation.Tile>
			<Navigation.Tile id="discoveries" label="Descobertas"><NotebookPenIcon /></Navigation.Tile>
			<Navigation.Tile id="save" label="Salvar"><SaveIcon /></Navigation.Tile>
		</Navigation.Bar>
	</div>
</div>
