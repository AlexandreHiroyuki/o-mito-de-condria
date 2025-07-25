import { writable } from 'svelte/store';
import type { GameState } from './game.d.js';

const initialGameState: GameState = {
	resources: {
		proteinas: 0,
		oxigenio: 0,
		glicose: 0,
		atp: 0
	},
	gainSpeeds: {
		proteinas: 0.2,
		oxigenio: 0.2,
		glicose: 0.2,
		atp: 0.2
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
	}
};

export const gameStore = writable<GameState>(initialGameState);

let timer: number | undefined;

export function startGameTimer() {
	if (timer) return;

	timer = setInterval(() => {
		gameStore.update((state) => ({
			...state,
			resources: {
				proteinas: state.resources.proteinas + state.gainSpeeds.proteinas,
				oxigenio: state.resources.oxigenio + state.gainSpeeds.oxigenio,
				glicose: state.resources.glicose + state.gainSpeeds.glicose,
				atp: state.resources.atp + state.gainSpeeds.atp
			}
		}));
	}, 1000);
}

export function stopGameTimer() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
	}
}

export function resetGame() {
	gameStore.set(initialGameState);

	stopGameTimer();
	startGameTimer();
}

export function getGameState(): GameState {
	let state: GameState = initialGameState;

	gameStore.subscribe((value) => {
		state = value;
	})();

	return state;
}

export function saveGame(): string {
	const state = getGameState();
	const saveData = {
		...state,
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
		const { timestamp, ...gameState } = saveData;
		gameStore.set(gameState);
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

export function purchaseUpgrade(upgradeId: string): boolean {
	let purchased = false;

	gameStore.update((state) => {
		// Check if upgrade is already purchased
		if (state.purchasedUpgrades[upgradeId]) {
			return state;
		}

		// Add upgrade to purchased list
		const newState = {
			...state,
			purchasedUpgrades: {
				...state.purchasedUpgrades,
				[upgradeId]: true
			}
		};

		purchased = true;
		return newState;
	});

	return purchased;
}

export function hasUpgrade(upgradeId: string): boolean {
	let hasUpgrade = false;

	gameStore.subscribe((state) => {
		hasUpgrade = state.purchasedUpgrades[upgradeId] || false;
	})();

	return hasUpgrade;
}

export function getPurchasedUpgrades(): string[] {
	let purchasedUpgrades: string[] = [];

	gameStore.subscribe((state) => {
		purchasedUpgrades = Object.keys(state.purchasedUpgrades).filter(
			(key) => state.purchasedUpgrades[key]
		);
	})();

	return purchasedUpgrades;
}

export function canAffordUpgrade(cost: number): boolean {
	let canAfford = false;

	gameStore.subscribe((state) => {
		// For now, we'll use ATP as the currency
		// You can modify this logic to use different resources or combinations
		canAfford = state.resources.atp >= cost;
	})();

	return canAfford;
}

export function purchaseUpgradeWithCost(upgradeId: string, cost: number): boolean {
	let purchased = false;

	gameStore.update((state) => {
		// Check if upgrade is already purchased
		if (state.purchasedUpgrades[upgradeId]) {
			return state;
		}

		// Check if player can afford the upgrade
		if (state.resources.atp < cost) {
			return state;
		}

		// Deduct cost and add upgrade to purchased list
		const newState = {
			...state,
			resources: {
				...state.resources,
				atp: state.resources.atp - cost
			},
			purchasedUpgrades: {
				...state.purchasedUpgrades,
				[upgradeId]: true
			}
		};

		purchased = true;
		return newState;
	});

	return purchased;
}
