<script lang="ts">
	import { gameState } from '$lib/game.svelte';
	import { upgrades } from '$lib/game.upgrades.svelte';
	import UpgradeCard from './upgradeCard.svelte';

	const availableUpgrades = $derived(
		Object.values(upgrades).filter((upgrade) => {
			if (gameState.purchasedUpgrades[upgrade.id]) return true;
			if (!upgrade.requirements) return true;
			return upgrade.requirements(gameState).length === 0;
		})
	);

	const lockedUpgrades = $derived(
		Object.values(upgrades).filter((upgrade) => {
			if (gameState.purchasedUpgrades[upgrade.id]) return false;
			if (!upgrade.requirements) return false;
			return upgrade.requirements(gameState).length > 0;
		})
	);
</script>

<h2 class="mb-4 text-xl font-bold">Aprimoramentos Disponíveis</h2>

{#if availableUpgrades.length > 0}
	<div class="mb-6">
		{#each availableUpgrades as upgrade}
			<UpgradeCard {upgrade} />
		{/each}
	</div>
{/if}

{#if lockedUpgrades.length > 0}
	<h3 class="mb-3 text-lg font-semibold text-gray-700">Aprimoramentos Bloqueados</h3>
	<div class="mb-6">
		{#each lockedUpgrades as upgrade}
			<UpgradeCard {upgrade} />
		{/each}
	</div>
{/if}

{#if availableUpgrades.length === 0 && lockedUpgrades.length === 0}
	<p class="text-gray-500 italic">Nenhum aprimoramento disponível no momento.</p>
{/if}
