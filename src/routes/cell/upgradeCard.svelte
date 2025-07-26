<script lang="ts">
	import { gameState, purchaseUpgradeWithCost } from '$lib/game.svelte';
	import type { Upgrade } from '$lib/game.upgrades.svelte';

	const { upgrade } = $props<{ upgrade: Upgrade }>();

	// Reactive statements to check if upgrade is purchased, affordable, and requirements are met
	const purchased = $derived(gameState.purchasedUpgrades[upgrade.id] || false);
	const canAfford = $derived(gameState.resources.atp >= upgrade.cost);
	const unmetRequirements = $derived(upgrade.requirements ? upgrade.requirements(gameState) : []);

	function handlePurchase() {
		if (!purchased && canAfford && unmetRequirements.length === 0) {
			const success = purchaseUpgradeWithCost(upgrade.id, upgrade.cost);
			if (success) {
				// Apply the upgrade effect
				upgrade.effect(gameState);
			}
		}
	}

	const isAvailable = $derived(!purchased && canAfford && unmetRequirements.length === 0);
	const buttonText = $derived(
		purchased
			? 'Comprado'
			: unmetRequirements.length > 0
				? 'Bloqueado'
				: canAfford
					? 'Comprar'
					: 'Insuficiente'
	);
	const buttonClass = $derived(
		purchased
			? 'cursor-not-allowed bg-green-500 text-white'
			: unmetRequirements.length > 0
				? 'cursor-not-allowed bg-red-400 text-white'
				: canAfford
					? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
					: 'cursor-not-allowed bg-gray-400 text-gray-600'
	);
	const containerClass = $derived(
		purchased
			? 'border-green-300 bg-green-100'
			: unmetRequirements.length > 0
				? 'border-red-300 bg-red-100'
				: canAfford
					? 'border-gray-300 bg-white'
					: 'border-gray-300 bg-gray-100'
	);
	const titleClass = $derived(
		purchased ? 'text-green-800' : unmetRequirements.length > 0 ? 'text-red-800' : 'text-gray-800'
	);
</script>

<div class="mb-4 rounded-lg border p-4 {containerClass}">
	<div class="flex items-center justify-between gap-2">
		<div class="flex flex-1 flex-col gap-2">
			<h3 class="text-lg font-semibold {titleClass}">
				{upgrade.name}
			</h3>
			<p class="text-sm text-gray-600">{upgrade.description}</p>
			{#if upgrade.effectDescription}
				<p class="text-sm font-medium text-blue-600">
					{upgrade.effectDescription}
				</p>
			{/if}
			<p class="text-sm font-medium text-gray-700">
				Custo: {upgrade.cost} ATP
			</p>
			{#if unmetRequirements.length > 0}
				<p class="text-sm font-medium text-red-600">
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
