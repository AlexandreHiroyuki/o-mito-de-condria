<script lang="ts">
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import { fly } from 'svelte/transition';
	import CellDivision from './cellDivision.svelte';
	import UpgradeSection from './upgradeSection.svelte';

	let currentView = $state('upgrades');
</script>

<svelte:head>
	<title>Aprimoramentos - O Mito de Condria</title>
</svelte:head>

<div class="flex h-[86vh] w-full flex-col gap-4 overflow-y-auto px-4 pt-26 pb-26 text-black">
	<Segment
		name="view"
		value={currentView}
		onValueChange={(e: { value: string }) => (currentView = e.value!)}
		indicatorClasses="bg-yellow-200"
		base="flex items-stretch"
		classes="rounded-lg bg-white shadow-lg border-none"
		orientation="horizontal"
		defaultValue="upgrades"
	>
		<Segment.Item
			value="upgrades"
			stateFocused="text-white"
			classes="flex-1 transition-all duration-100 text-center active:scale-95"
		>
			Aprimoramentos
		</Segment.Item>
		<Segment.Item
			value="division"
			stateFocused="text-white"
			classes="flex-1 transition-all duration-100 text-center active:scale-95"
		>
			Divisão Celular
		</Segment.Item>
	</Segment>

	<div class="rounded-lg bg-white p-4">
		{#if currentView === 'upgrades'}
			<div in:fly={{ y: 20, duration: 300, delay: 100 }} out:fly={{ y: -20, duration: 200 }}>
				<UpgradeSection />
			</div>
		{:else if currentView === 'division'}
			<div in:fly={{ y: 20, duration: 300, delay: 100 }} out:fly={{ y: -20, duration: 200 }}>
				<CellDivision />
			</div>
		{/if}
	</div>
</div>
