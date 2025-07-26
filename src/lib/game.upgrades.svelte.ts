import type { GameState } from './game.d.ts';

export type Upgrade = {
	id: string;
	name: string;
	description: string;
	effectDescription?: string;
	cost: number;
	effect: (gameState: GameState) => void;
	requirements?: (gameState: GameState) => string[];
};

export const upgrades: Record<string, Upgrade> = {
	mitochondria: {
		id: 'mitochondria',
		name: 'Mitocôndria',
		description:
			'Encontro com a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo.',
		effectDescription: 'Desbloqueia aprimoramentos adicionais',
		cost: 10,
		effect: (gameState: GameState) => {
			// Mitochondria upgrade effect - could add special bonuses here
		}
	},
	nucleus: {
		id: 'nucleus',
		name: 'Núcleo Celular',
		description: 'Envolve o material genético da célula em uma membrana nuclear (carioteca).',
		effectDescription: 'Desbloqueia aprimoramentos adicionais',
		cost: 15,
		effect: (gameState: GameState) => {
			// Nucleus upgrade effect - could add special bonuses here
		}
	},
	ribosomes: {
		id: 'ribosomes',
		name: 'Ribossomos',
		description: 'Fábricas de proteínas da célula. Essenciais para a síntese proteica.',
		effectDescription: 'Proteínas +2/s, Desbloqueia aprimoramentos adicionais',
		cost: 6,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 2;
		}
	},
	golgiApparatus: {
		id: 'golgiApparatus',
		name: 'Complexo de Golgi',
		description: 'Sistema de empacotamento e distribuição de proteínas.',
		effectDescription: 'Desbloqueia aprimoramentos adicionais',
		cost: 12,
		effect: (gameState: GameState) => {
			// Golgi apparatus upgrade effect - could add special bonuses here
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.ribosomes) {
				unmet.push(upgrades.ribosomes.name);
			}
			return unmet;
		}
	},
	proteinBoost: {
		id: 'proteinBoost',
		name: 'Síntese Proteica',
		description: 'Aumenta a produção de proteínas.',
		effectDescription: 'Proteínas +0.1/s',
		cost: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 0.1;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.ribosomes) {
				unmet.push(upgrades.ribosomes.name);
			}
			return unmet;
		}
	},
	oxygenBoost: {
		id: 'oxygenBoost',
		name: 'Respiração Celular',
		description: 'Melhora a captação de oxigênio.',
		effectDescription: 'Oxigênio +0.15/s',
		cost: 7,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.oxigenio += 0.15;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			return unmet;
		}
	},
	glucoseBoost: {
		id: 'glucoseBoost',
		name: 'Metabolismo da Glicose',
		description: 'Aumenta a eficiência do metabolismo da glicose.',
		effectDescription: 'Glicose +0.12/s',
		cost: 6,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 0.12;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			return unmet;
		}
	},
	atpBoost: {
		id: 'atpBoost',
		name: 'Produção de ATP',
		description: 'Aumenta a produção de ATP através da fosforilação oxidativa.',
		effectDescription: 'ATP +0.2/s',
		cost: 9,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 0.2;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			return unmet;
		}
	},
	dnaReplication: {
		id: 'dnaReplication',
		name: 'Replicação do DNA',
		description: 'Permite a replicação do material genético para divisão celular.',
		effectDescription: 'Proteínas +0.3/s',
		cost: 20,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 0.3;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.nucleus) {
				unmet.push(upgrades.nucleus.name);
			}
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			return unmet;
		}
	},
	proteinExport: {
		id: 'proteinExport',
		name: 'Exportação de Proteínas',
		description: 'Sistema avançado de exportação de proteínas para fora da célula.',
		effectDescription: 'Proteínas +0.25/s, ATP +0.1/s',
		cost: 18,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 0.25;
			gameState.gainSpeeds.atp += 0.1;
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.golgiApparatus) {
				unmet.push(upgrades.golgiApparatus.name);
			}
			if (!gameState.purchasedUpgrades.ribosomes) {
				unmet.push(upgrades.ribosomes.name);
			}
			return unmet;
		}
	}
};
