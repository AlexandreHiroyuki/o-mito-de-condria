<script lang="ts">
	import { gameStore, purchaseUpgradeWithCost } from '../../lib/game.js';
	import type { Upgrade } from '../../lib/game.upgrades.js';

	export let upgrade: Upgrade;

	let purchased = false;
	let canAfford = false;
	let unmetRequirements: string[] = [];

	// Subscribe to game store to check if upgrade is purchased, affordable, and requirements are met
	gameStore.subscribe((state) => {
		purchased = state.purchasedUpgrades[upgrade.id] || false;
		canAfford = state.resources.atp >= upgrade.cost;
		unmetRequirements = upgrade.requirements ? upgrade.requirements(state) : [];
	});

	function handlePurchase() {
		if (!purchased && canAfford && unmetRequirements.length === 0) {
			const success = purchaseUpgradeWithCost(upgrade.id, upgrade.cost);
			if (success) {
				// Apply the upgrade effect
				gameStore.update((state) => {
					upgrade.effect(state);
					return state;
				});
			}
		}
	}

	$: isAvailable = !purchased && canAfford && unmetRequirements.length === 0;
	$: buttonText = purchased
		? 'Comprado'
		: unmetRequirements.length > 0
			? 'Bloqueado'
			: canAfford
				? 'Comprar'
				: 'Insuficiente';
	$: buttonClass = purchased
		? 'cursor-not-allowed bg-green-500 text-white'
		: unmetRequirements.length > 0
			? 'cursor-not-allowed bg-red-400 text-white'
			: canAfford
				? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
				: 'cursor-not-allowed bg-gray-400 text-gray-600';
	$: containerClass = purchased
		? 'border-green-300 bg-green-100'
		: unmetRequirements.length > 0
			? 'border-red-300 bg-red-100'
			: canAfford
				? 'border-gray-300 bg-white'
				: 'border-gray-300 bg-gray-100';
	$: titleClass = purchased
		? 'text-green-800'
		: unmetRequirements.length > 0
			? 'text-red-800'
			: 'text-gray-800';
</script>

<div class="mb-4 rounded-lg border p-4 {containerClass}">
	<div class="flex items-center justify-between gap-2">
		<div class="flex-1">
			<h3 class="text-lg font-semibold {titleClass}">
				{upgrade.name}
			</h3>
			<p class="mt-1 text-sm text-gray-600">{upgrade.description}</p>
			<p class="mt-2 text-sm font-medium text-gray-700">
				Custo: {upgrade.cost} ATP
			</p>
			{#if unmetRequirements.length > 0}
				<p class="mt-1 text-sm font-medium text-red-600">
					Requer: {unmetRequirements.join(', ')}
				</p>
			{/if}
		</div>
		<button
			on:click={handlePurchase}
			disabled={!isAvailable}
			class="rounded-lg px-4 py-2 font-medium transition-colors {buttonClass}"
		>
			{buttonText}
		</button>
	</div>
</div>
