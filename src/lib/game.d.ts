export type GameState = {
	resources: {
		proteinas: number;
		oxigenio: number;
		glicose: number;
		atp: number;
	};
	gainSpeeds: {
		proteinas: number;
		oxigenio: number;
		glicose: number;
		atp: number;
	};
	flags: Record<string, boolean>;
	purchasedUpgrades: Record<string, boolean>;
};
