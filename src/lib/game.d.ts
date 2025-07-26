export type GameState = {
	resources: {
		proteinas: number;
		oxigenio: number;
		glicose: number;
		atp: number;
		cells: number;
	};
	gainSpeeds: {
		proteinas: number;
		oxigenio: number;
		glicose: number;
		atp: number;
		cells: number;
	};
	flags: Record<string, boolean>;
	purchasedUpgrades: Record<string, boolean>;
	meiosisMultiplier: number;
};
