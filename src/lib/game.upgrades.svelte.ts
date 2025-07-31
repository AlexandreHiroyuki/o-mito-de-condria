import type { GameResources, GameState } from './game.d.ts';
import { discover } from './game.svelte.js';

export type Upgrade = {
	id: string;
	name: string;
	description: string;
	effectDescription?: string;
	cost: Partial<GameResources>;
	tier: number; // The tier is the depth which this upgrade is in the requirements tree (it is the highest tier of its dependencies + 1)
	effect: (gameState: GameState) => void;
	requirements?: (gameState: GameState) => string[];
};

export const upgrades: Record<string, Upgrade> = {
	mitochondria: {
		id: 'mitochondria',
		name: 'Mitocôndria',
		description:
			'Encontro com a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo.',
		effectDescription: 'Consome Oxigênio e Glicose para produzir ATP +5/s',
		cost: { atp: 8 },
		tier: 0,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 5;
			// Consume oxygen and glucose to produce ATP
			gameState.gainSpeeds.oxigenio -= 2;
			gameState.gainSpeeds.glicose -= 2;
			discover('mitochondria');
		}
	},
	nucleus: {
		id: 'nucleus',
		name: 'Núcleo Celular',
		description: 'Envolve o material genético da célula em uma membrana nuclear (carioteca).',
		effectDescription: 'Proteínas +1/s, Desbloqueia aprimoramentos adicionais',
		cost: { atp: 10 },
		tier: 0,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 1;
			discover('nucleus');
		}
	},
	ribosomes: {
		id: 'ribosomes',
		name: 'Ribossomos',
		description: 'Fábricas de proteínas da célula. Essenciais para a síntese proteica.',
		effectDescription: 'Proteínas +2/s, Desbloqueia aprimoramentos adicionais',
		cost: { atp: 6 },
		tier: 0,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 2;
			discover('ribosomes');
		}
	},
	golgiApparatus: {
		id: 'golgiApparatus',
		name: 'Complexo de Golgi',
		description: 'Sistema de empacotamento e distribuição de proteínas.',
		effectDescription: 'Proteínas +3/s, ATP +2/s',
		cost: { atp: 45, proteinas: 12 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 3;
			gameState.gainSpeeds.atp += 2;
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
		effectDescription: 'Proteínas +2.5/s',
		cost: { atp: 35, proteinas: 20 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 2.5;
			discover('proteinSynthesis');
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
		effectDescription: 'Oxigênio +3/s',
		cost: { atp: 40, glicose: 25 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.oxigenio += 3;
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
		effectDescription: 'Glicose +2.5/s',
		cost: { atp: 38, oxigenio: 18 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 2.5;
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
		effectDescription: 'ATP +4/s',
		cost: { atp: 50, oxigenio: 25, glicose: 20 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 4;
			discover('energyProduction');
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
		effectDescription: 'Proteínas +6/s',
		cost: { atp: 75, proteinas: 35, oxigenio: 30 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 6;
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
		effectDescription: 'Proteínas +8/s, ATP +4/s',
		cost: { atp: 120, proteinas: 60, glicose: 45 },
		tier: 2,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 8;
			gameState.gainSpeeds.atp += 4;
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
