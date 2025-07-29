export type GameResources = {
	proteinas: number;
	oxigenio: number;
	glicose: number;
	atp: number;
	cells: number;
};

export type MitosisStage = {
	id: string;
	name: string;
	description: string;
	resourceCost: Partial<GameResources>;
	progressMark: number;
};

export type MitosisProgress = {
	currentStage: number; // index of current stage
	progress: number;
};

export type GameState = {
	resources: GameResources;
	gainSpeeds: GameResources;
	flags: Record<string, boolean>;
	discoveries: Record<string, boolean>;
	purchasedUpgrades: Record<string, boolean>;
	meiosisMultiplier: number;
	mitosisProgress: MitosisProgress;
};
