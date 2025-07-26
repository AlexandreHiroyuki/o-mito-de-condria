import type { GameState } from './game.d.ts';

const initialGameState: GameState = {
	resources: {
		proteinas: 0,
		oxigenio: 0,
		glicose: 0,
		atp: 0,
		cells: 0
	},
	gainSpeeds: {
		proteinas: 0.2,
		oxigenio: 0.2,
		glicose: 0.2,
		atp: 0.2,
		cells: 0
	},
	flags: {},
	purchasedUpgrades: {
		mitochondria: false,
		nucleus: false,
		ribosomes: false,
		golgiApparatus: false,
		proteinBoost: false,
		oxygenBoost: false,
		glucoseBoost: false,
		atpBoost: false,
		dnaReplication: false,
		proteinExport: false
	},
	meiosisMultiplier: 0
};

// Immutable state - cannot be reassigned
export let gameState: GameState = $state(initialGameState);

let timer: number | undefined;

export function startGameTimer() {
	if (timer) return;

	timer = setInterval(() => {
		gameState.resources.proteinas += gameState.gainSpeeds.proteinas;
		gameState.resources.oxigenio += gameState.gainSpeeds.oxigenio;
		gameState.resources.glicose += gameState.gainSpeeds.glicose;
		gameState.resources.atp += gameState.gainSpeeds.atp;
	}, 1000);
}

export function stopGameTimer() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
	}
}

export function resetGame() {
	console.log(gameState);
	stopGameTimer();
	gameState.resources = { ...initialGameState.resources };
	gameState.gainSpeeds = { ...initialGameState.gainSpeeds };
	gameState.flags = { ...initialGameState.flags };
	gameState.purchasedUpgrades = { ...initialGameState.purchasedUpgrades };
	gameState.meiosisMultiplier = initialGameState.meiosisMultiplier;
	startGameTimer();
	console.log(gameState);
}

export function saveGame(): string {
	const saveData = {
		...gameState,
		timestamp: new Date().toISOString()
	};
	const saveString = JSON.stringify(saveData);
	localStorage.setItem('o-mito-de-condria-save', saveString);
	return saveString;
}

export function loadGame(): boolean {
	const saveString = localStorage.getItem('o-mito-de-condria-save');
	if (!saveString) return false;

	try {
		const saveData = JSON.parse(saveString);
		// Remove timestamp from the loaded data
		const { timestamp, ...loadedGameState } = saveData;

		// Update the gameState with loaded data
		gameState.resources = { ...loadedGameState.resources };
		gameState.gainSpeeds = { ...loadedGameState.gainSpeeds };
		gameState.flags = { ...loadedGameState.flags };
		gameState.purchasedUpgrades = { ...loadedGameState.purchasedUpgrades };
		gameState.meiosisMultiplier = loadedGameState.meiosisMultiplier;

		return true;
	} catch (error) {
		console.error('Failed to load save data:', error);
		return false;
	}
}

export function exportSave(): string {
	return saveGame();
}

export function hasSaveData(): boolean {
	return localStorage.getItem('o-mito-de-condria-save') !== null;
}

export function hasUpgrade(upgradeId: string): boolean {
	return gameState.purchasedUpgrades[upgradeId] || false;
}

export function getPurchasedUpgrades(): string[] {
	return Object.keys(gameState.purchasedUpgrades).filter((key) => gameState.purchasedUpgrades[key]);
}

export function canAffordUpgrade(cost: number): boolean {
	// For now, we'll use ATP as the currency
	// You can modify this logic to use different resources or combinations
	return gameState.resources.atp >= cost;
}

export function purchaseUpgradeWithCost(upgradeId: string, cost: number): boolean {
	// Check if upgrade is already purchased
	if (gameState.purchasedUpgrades[upgradeId]) {
		return false;
	}

	// Check if player can afford the upgrade
	if (gameState.resources.atp < cost) {
		return false;
	}

	// Deduct cost and add upgrade to purchased list
	gameState.resources.atp -= cost;
	gameState.purchasedUpgrades[upgradeId] = true;
	return true;
}

export function performMitosis(): boolean {
	// Check if player has enough resources for mitosis
	if (
		gameState.resources.atp < 100 ||
		gameState.resources.proteinas < 50 ||
		gameState.resources.oxigenio < 30 ||
		gameState.resources.glicose < 25
	) {
		return false;
	}

	// Deduct resources and gain cells
	gameState.resources.atp -= 100;
	gameState.resources.proteinas -= 50;
	gameState.resources.oxigenio -= 30;
	gameState.resources.glicose -= 25;
	gameState.resources.cells += 1;
	return true;
}

export function performMeiosis(): boolean {
	// Check if player has enough cells for meiosis
	if (gameState.resources.cells < 10) {
		return false;
	}

	// Calculate new multiplier (10% increase per meiosis)
	const newMultiplier = gameState.meiosisMultiplier + 0.1;

	// Reset game state but keep the multiplier
	gameState.resources = { ...initialGameState.resources };
	gameState.gainSpeeds = { ...initialGameState.gainSpeeds };
	gameState.flags = { ...initialGameState.flags };
	gameState.purchasedUpgrades = { ...initialGameState.purchasedUpgrades };
	gameState.meiosisMultiplier = newMultiplier;

	// Apply multiplier to gain speeds
	const currentGainSpeeds = gameState.gainSpeeds;
	gameState.gainSpeeds.proteinas += currentGainSpeeds.proteinas * (newMultiplier - 1);
	gameState.gainSpeeds.oxigenio += currentGainSpeeds.oxigenio * (newMultiplier - 1);
	gameState.gainSpeeds.glicose += currentGainSpeeds.glicose * (newMultiplier - 1);
	gameState.gainSpeeds.atp += currentGainSpeeds.atp * (newMultiplier - 1);

	return true;
}
