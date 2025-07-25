<script lang="ts">
	import { gameStore } from '../../lib/game.js';
	import { upgrades } from '../../lib/game.upgrades.js';
	import Upgrade from './upgrade.svelte';

	let gameState: any;

	gameStore.subscribe((state) => {
		gameState = state;
	});

	$: availableUpgrades = Object.values(upgrades).filter((upgrade) => {
		if (gameState.purchasedUpgrades[upgrade.id]) return true;
		if (!upgrade.requirements) return true;
		return upgrade.requirements(gameState).length === 0;
	});

	$: lockedUpgrades = Object.values(upgrades).filter((upgrade) => {
		if (gameState.purchasedUpgrades[upgrade.id]) return false;
		if (!upgrade.requirements) return false;
		return upgrade.requirements(gameState).length > 0;
	});
</script>

<h2 class="mb-4 text-xl font-bold">Aprimoramentos Disponíveis</h2>

{#if availableUpgrades.length > 0}
	<div class="mb-6">
		{#each availableUpgrades as upgrade}
			<Upgrade {upgrade} />
		{/each}
	</div>
{/if}

{#if lockedUpgrades.length > 0}
	<h3 class="mb-3 text-lg font-semibold text-gray-700">Aprimoramentos Bloqueados</h3>
	<div class="mb-6">
		{#each lockedUpgrades as upgrade}
			<Upgrade {upgrade} />
		{/each}
	</div>
{/if}

{#if availableUpgrades.length === 0 && lockedUpgrades.length === 0}
	<p class="text-gray-500 italic">Nenhum aprimoramento disponível no momento.</p>
{/if}
