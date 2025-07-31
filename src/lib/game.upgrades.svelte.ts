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
	centriole: {
		id: 'centriole',
		name: 'Centríolo',
		description: 'Organela responsável pela formação do fuso mitótico durante a divisão celular.',
		effectDescription: 'Desbloqueia a mitose, Proteínas +1/s',
		cost: { atp: 15, proteinas: 8 },
		tier: 0,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 1;
			discover('centriole');
		}
	},
	proteinExport: {
		id: 'proteinExport',
		name: 'Exportação de Proteínas',
		description: 'Sistema avançado de exportação de proteínas para fora da célula.',
		effectDescription: 'Proteínas +8/s, ATP +4/s',
		cost: { atp: 240, proteinas: 120, glicose: 90 },
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
	},
	cilia: {
		id: 'cilia',
		name: 'Cílios e Flagelos',
		description:
			'Os centríolos atuam como corpúsculos basais, servindo como ponto de partida para a formação e organização dos microtúbulos que compõem cílios e flagelos, estruturas envolvidas na movimentação celular e na captação de partículas.',
		effectDescription: 'Proteínas +3/s, Oxigênio +2/s, Glicose +2/s',
		cost: { atp: 80, proteinas: 40, oxigenio: 25 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 3;
			gameState.gainSpeeds.oxigenio += 2;
			gameState.gainSpeeds.glicose += 2;
			discover('cilia');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.centriole) {
				unmet.push(upgrades.centriole.name);
			}
			return unmet;
		}
	},
	lysosome: {
		id: 'lysosome',
		name: 'Lisossomo',
		description:
			'Organela responsável pela digestão intracelular, quebrando macromoléculas em nutrientes utilizáveis.',
		effectDescription: 'Glicose +4/s, Proteínas +2/s',
		cost: { atp: 60, proteinas: 30, oxigenio: 20 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 4;
			gameState.gainSpeeds.proteinas += 2;
			discover('lysosome');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.golgiApparatus) {
				unmet.push(upgrades.golgiApparatus.name);
			}
			return unmet;
		}
	},
	peroxisome: {
		id: 'peroxisome',
		name: 'Peroxissomo',
		description:
			'Organela que decompõe ácidos graxos e aminoácidos, produzindo peróxido de hidrogênio que é convertido em oxigênio.',
		effectDescription: 'Oxigênio +5/s, Glicose +2/s',
		cost: { atp: 70, proteinas: 35, glicose: 25 },
		tier: 1,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.oxigenio += 5;
			gameState.gainSpeeds.glicose += 2;
			discover('peroxisome');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			return unmet;
		}
	},
	glycolysis: {
		id: 'glycolysis',
		name: 'Glicólise',
		description:
			'Processo anaeróbico que quebra a glicose em piruvato, produzindo ATP e liberando energia.',
		effectDescription: 'Glicose +6/s, ATP +3/s',
		cost: { atp: 180, proteinas: 90, oxigenio: 60 },
		tier: 2,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 6;
			gameState.gainSpeeds.atp += 3;
			discover('glycolysis');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.mitochondria) {
				unmet.push(upgrades.mitochondria.name);
			}
			if (!gameState.purchasedUpgrades.ribosomes) {
				unmet.push(upgrades.ribosomes.name);
			}
			return unmet;
		}
	},
	fermentation: {
		id: 'fermentation',
		name: 'Fermentação',
		description:
			'Processo anaeróbico que converte piruvato em lactato ou etanol, regenerando NAD+ para continuar a glicólise.',
		effectDescription: 'Glicose +8/s, Oxigênio +3/s',
		cost: { atp: 220, proteinas: 110, glicose: 80 },
		tier: 2,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 8;
			gameState.gainSpeeds.oxigenio += 3;
			discover('fermentation');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.glycolysis) {
				unmet.push(upgrades.glycolysis.name);
			}
			return unmet;
		}
	},
	phagocytosis: {
		id: 'phagocytosis',
		name: 'Fagocitose',
		description:
			'Processo pelo qual a célula engloba partículas grandes, formando vacúolos que são digeridos pelos lisossomos.',
		effectDescription: 'Proteínas +5/s, Glicose +4/s, Oxigênio +2/s',
		cost: { atp: 260, proteinas: 130, oxigenio: 80 },
		tier: 2,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 5;
			gameState.gainSpeeds.glicose += 4;
			gameState.gainSpeeds.oxigenio += 2;
			discover('phagocytosis');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.lysosome) {
				unmet.push(upgrades.lysosome.name);
			}
			if (!gameState.purchasedUpgrades.nucleus) {
				unmet.push(upgrades.nucleus.name);
			}
			return unmet;
		}
	},
	endocytosis: {
		id: 'endocytosis',
		name: 'Endocitose',
		description:
			'Processo de internalização de fluidos e macromoléculas através da invaginação da membrana plasmática.',
		effectDescription: 'Glicose +6/s, Oxigênio +4/s, Proteínas +3/s',
		cost: { atp: 300, proteinas: 150, glicose: 100 },
		tier: 2,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 6;
			gameState.gainSpeeds.oxigenio += 4;
			gameState.gainSpeeds.proteinas += 3;
			discover('endocytosis');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.golgiApparatus) {
				unmet.push(upgrades.golgiApparatus.name);
			}
			if (!gameState.purchasedUpgrades.lysosome) {
				unmet.push(upgrades.lysosome.name);
			}
			return unmet;
		}
	}
};
