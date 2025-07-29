import type { GameResources, GameState, MitosisStage } from './game.d.ts';
import { discoveries } from './game.discoveries.svelte.js';
import { toaster } from './toaster.svelte.js';

export const mitosisDuration = 5 * 60; // unit: seconds

export const mitosisStages: MitosisStage[] = [
	{
		id: 'interphase',
		name: 'Interfase',
		description: 'A célula cresce e replica seu DNA',
		resourceCost: {}, // No cost for interphase
		progressMark: 0 // No duration - it's the default state
	},
	{
		id: 'prophase',
		name: 'Prófase',
		description: 'Os cromossomos se condensam e o fuso mitótico se forma',
		resourceCost: { atp: 25, oxigenio: 15 },
		progressMark: 0.2
	},
	{
		id: 'metaphase',
		name: 'Metáfase',
		description: 'Os cromossomos se alinham no centro da célula',
		resourceCost: { atp: 30, glicose: 20 },
		progressMark: 0.4
	},
	{
		id: 'anaphase',
		name: 'Anáfase',
		description: 'Os cromossomos se separam e migram para os polos',
		resourceCost: { atp: 35, proteinas: 20, oxigenio: 10 },
		progressMark: 0.6
	},
	{
		id: 'telophase',
		name: 'Telófase',
		description: 'A membrana nuclear se reforma e a citocinese começa',
		resourceCost: { atp: 40, glicose: 25, proteinas: 15 },
		progressMark: 0.8
	},
	{
		id: 'cytokinesis',
		name: 'Citocinese',
		description: 'A célula se divide completamente em duas células filhas',
		resourceCost: { atp: 50, proteinas: 30, oxigenio: 20, glicose: 15 },
		progressMark: 1.0
	}
];

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
	discoveries: {},
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
	meiosisMultiplier: 0,
	mitosisProgress: {
		currentStage: 0,
		progress: 0
	}
};

export let gameState: GameState = $state(initialGameState);

let timer: NodeJS.Timeout | undefined;

export function startGameTimer() {
	if (timer) return;

	timer = setInterval(() => {
		const getEffectiveGainSpeed = (initialSpeed: number, currentSpeed: number): number => {
			if (currentSpeed < initialSpeed) return initialSpeed;
			return currentSpeed;
		};

		gameState.resources.proteinas += getEffectiveGainSpeed(
			initialGameState.gainSpeeds.proteinas,
			gameState.gainSpeeds.proteinas
		);
		gameState.resources.oxigenio += getEffectiveGainSpeed(
			initialGameState.gainSpeeds.oxigenio,
			gameState.gainSpeeds.oxigenio
		);
		gameState.resources.glicose += getEffectiveGainSpeed(
			initialGameState.gainSpeeds.glicose,
			gameState.gainSpeeds.glicose
		);
		gameState.resources.atp += getEffectiveGainSpeed(
			initialGameState.gainSpeeds.atp,
			gameState.gainSpeeds.atp
		);

		if (
			gameState.mitosisProgress.currentStage > 0 &&
			gameState.mitosisProgress.progress <
				mitosisStages[gameState.mitosisProgress.currentStage].progressMark
		) {
			gameState.mitosisProgress.progress += 1 / mitosisDuration;
		}

		console.log(gameState.mitosisProgress.progress);
	}, 1000);
}

export function stopGameTimer() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
	}
}

export function resetGame() {
	stopGameTimer();
	gameState.resources = { ...initialGameState.resources };
	gameState.gainSpeeds = { ...initialGameState.gainSpeeds };
	gameState.flags = { ...initialGameState.flags };
	gameState.discoveries = { ...initialGameState.discoveries };
	gameState.purchasedUpgrades = { ...initialGameState.purchasedUpgrades };
	gameState.meiosisMultiplier = initialGameState.meiosisMultiplier;
	resetMitosis();
	startGameTimer();
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
		const { timestamp, ...loadedGameState } = saveData;

		gameState.resources = { ...initialGameState.resources, ...loadedGameState.resources };
		gameState.gainSpeeds = { ...initialGameState.gainSpeeds, ...loadedGameState.gainSpeeds };
		gameState.flags = { ...initialGameState.flags, ...loadedGameState.flags };
		gameState.discoveries = { ...initialGameState.discoveries, ...loadedGameState.discoveries };
		gameState.purchasedUpgrades = {
			...initialGameState.purchasedUpgrades,
			...loadedGameState.purchasedUpgrades
		};
		gameState.meiosisMultiplier =
			loadedGameState.meiosisMultiplier || initialGameState.meiosisMultiplier;
		gameState.mitosisProgress = loadedGameState.mitosisProgress || initialGameState.mitosisProgress;

		return true;
	} catch (error) {
		console.error('Failed to load save data:', error);
		return false;
	}
}

export function exportSave(): string {
	return saveGame();
}

export function importSave(saveString: string): boolean {
	try {
		const saveData = JSON.parse(saveString);
		const { timestamp, ...loadedGameState } = saveData;

		// Validate that the save data has the expected structure
		if (
			!loadedGameState.resources ||
			!loadedGameState.gainSpeeds ||
			!loadedGameState.purchasedUpgrades
		) {
			console.error('Invalid save data structure');
			return false;
		}

		// Load the game state
		gameState.resources = { ...initialGameState.resources, ...loadedGameState.resources };
		gameState.gainSpeeds = { ...initialGameState.gainSpeeds, ...loadedGameState.gainSpeeds };
		gameState.flags = { ...initialGameState.flags, ...loadedGameState.flags };
		gameState.discoveries = { ...initialGameState.discoveries, ...loadedGameState.discoveries };
		gameState.purchasedUpgrades = {
			...initialGameState.purchasedUpgrades,
			...loadedGameState.purchasedUpgrades
		};
		gameState.meiosisMultiplier =
			loadedGameState.meiosisMultiplier || initialGameState.meiosisMultiplier;

		// Save to localStorage to persist the imported data
		localStorage.setItem('o-mito-de-condria-save', saveString);

		return true;
	} catch (error) {
		console.error('Failed to import save data:', error);
		return false;
	}
}

export function hasSaveData(): boolean {
	return localStorage.getItem('o-mito-de-condria-save') !== null;
}

export function purchaseUpgradeWithCost(upgradeId: string, cost: Partial<GameResources>): boolean {
	// Check if upgrade is already purchased
	if (gameState.purchasedUpgrades[upgradeId]) {
		return false;
	}

	// Check if player can afford all required resources
	for (const [resource, amount] of Object.entries(cost)) {
		if (gameState.resources[resource as keyof GameResources] < amount) {
			return false;
		}
	}

	// Deduct all costs and add upgrade to purchased list
	for (const [resource, amount] of Object.entries(cost)) {
		gameState.resources[resource as keyof GameResources] -= amount;
	}
	gameState.purchasedUpgrades[upgradeId] = true;
	return true;
}

export function discover(discoveryId: string): boolean {
	if (gameState.discoveries[discoveryId]) {
		return false;
	}
	gameState.discoveries[discoveryId] = true;

	toaster.warning({
		title: discoveries[discoveryId].name,
		description: discoveries[discoveryId].message,
		duration: 3000
	});

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
	gameState.discoveries = { ...initialGameState.discoveries };
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

export function canProgressMitosis(): boolean {
	const currentStageIndex = gameState.mitosisProgress.currentStage;
	const currentStage = mitosisStages[currentStageIndex];

	if (gameState.mitosisProgress.progress < currentStage.progressMark) {
		return false;
	}

	if (currentStageIndex > 0) {
		for (const [resource, amount] of Object.entries(currentStage.resourceCost)) {
			if (gameState.resources[resource as keyof GameResources] < amount) {
				return false;
			}
		}
	}

	return true;
}

export function transitionMitosisStage(): boolean {
	const currentStageIndex = gameState.mitosisProgress.currentStage;
	const currentStage = mitosisStages[currentStageIndex];

	if (!canProgressMitosis()) {
		return false;
	}

	for (const [resource, amount] of Object.entries(currentStage.resourceCost)) {
		gameState.resources[resource as keyof GameResources] -= amount as number;
	}

	const nextStageIndex = currentStageIndex + 1;

	// If we've completed all stages (cytokinesis), go back to stage 0 and give reward
	if (nextStageIndex >= mitosisStages.length) {
		gameState.mitosisProgress.currentStage = 0;
		gameState.mitosisProgress.progress = 0;
		gameState.resources.cells += 1;
		return true;
	}

	// Move to next stage and start timer
	gameState.mitosisProgress.currentStage = nextStageIndex;

	return true;
}

export function resetMitosis(): void {
	gameState.mitosisProgress = {
		currentStage: 0,
		progress: 0
	};
}
