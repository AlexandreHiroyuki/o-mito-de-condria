import type { GameState } from './game.d.js';

export type Upgrade = {
	id: string;
	name: string;
	description: string;
	cost: number;
	effect: (gameState: GameState) => void;
	requirements?: (gameState: GameState) => string[];
};

export const upgrades: Record<string, Upgrade> = {
	mitochondria: {
		id: 'mitochondria',
		name: 'Mitocôndria',
		description:
			'Encontro com a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo. [Desbloqueia aprimoramentos adicionais]',
		cost: 10,
		effect: (gameState: GameState) => {
			// Mitochondria upgrade effect - could add special bonuses here
		}
	},
	nucleus: {
		id: 'nucleus',
		name: 'Núcleo Celular',
		description:
			'O centro de comando da célula. Contém o material genético e controla todas as atividades celulares.',
		cost: 15,
		effect: (gameState: GameState) => {
			// Nucleus upgrade effect - could add special bonuses here
		}
	},
	ribosomes: {
		id: 'ribosomes',
		name: 'Ribossomos',
		description: 'Fábricas de proteínas da célula. Essenciais para a síntese proteica.',
		cost: 8,
		effect: (gameState: GameState) => {
			// Ribosomes upgrade effect - could add special bonuses here
		}
	},
	golgiApparatus: {
		id: 'golgiApparatus',
		name: 'Complexo de Golgi',
		description: 'Sistema de empacotamento e distribuição de proteínas.',
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
