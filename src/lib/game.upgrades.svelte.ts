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
	},
	epithelialCells: {
		id: 'epithelialCells',
		name: 'Células Epiteliais',
		description:
			'Revestem superfícies internas e externas do corpo, formando barreiras protetoras e auxiliando na absorção e secreção de substâncias.',
		effectDescription: 'Proteínas +12/s, Glicose +8/s, Oxigênio +6/s',
		cost: { atp: 1200, proteinas: 800, glicose: 600, oxigenio: 400, cells: 1 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 12;
			gameState.gainSpeeds.glicose += 8;
			gameState.gainSpeeds.oxigenio += 6;
			discover('epithelialCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.endocytosis) {
				unmet.push(upgrades.endocytosis.name);
			}
			return unmet;
		}
	},
	bloodCells: {
		id: 'bloodCells',
		name: 'Células Sanguíneas',
		description:
			'Incluem hemácias responsáveis pelo transporte de oxigênio, leucócitos que combatem infecções e plaquetas envolvidas na coagulação sanguínea.',
		effectDescription: 'Oxigênio +15/s, ATP +10/s, Proteínas +8/s',
		cost: { atp: 1500, proteinas: 1000, oxigenio: 800, glicose: 500, cells: 2 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.oxigenio += 15;
			gameState.gainSpeeds.atp += 10;
			gameState.gainSpeeds.proteinas += 8;
			discover('bloodCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.epithelialCells) {
				unmet.push(upgrades.epithelialCells.name);
			}
			return unmet;
		}
	},
	nerveCells: {
		id: 'nerveCells',
		name: 'Células Nervosas',
		description:
			'Transmitem impulsos nervosos, permitindo a comunicação entre diferentes partes do corpo e o processamento de informações.',
		effectDescription: 'ATP +18/s, Proteínas +12/s, Glicose +10/s',
		cost: { atp: 1800, proteinas: 1200, glicose: 900, oxigenio: 600, cells: 3 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 18;
			gameState.gainSpeeds.proteinas += 12;
			gameState.gainSpeeds.glicose += 10;
			discover('nerveCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.bloodCells) {
				unmet.push(upgrades.bloodCells.name);
			}
			return unmet;
		}
	},
	muscleCells: {
		id: 'muscleCells',
		name: 'Células Musculares',
		description:
			'Responsáveis pela contração e movimento do corpo, incluindo músculos esqueléticos, cardíacos e lisos.',
		effectDescription: 'ATP +20/s, Glicose +15/s, Oxigênio +12/s',
		cost: { atp: 2000, proteinas: 1500, glicose: 1200, oxigenio: 800, cells: 4 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 20;
			gameState.gainSpeeds.glicose += 15;
			gameState.gainSpeeds.oxigenio += 12;
			discover('muscleCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.nerveCells) {
				unmet.push(upgrades.nerveCells.name);
			}
			return unmet;
		}
	},
	boneCells: {
		id: 'boneCells',
		name: 'Células Ósseas',
		description:
			'Osteoblastos, osteócitos e osteoclastos desempenham papéis na formação, manutenção e remodelação do tecido ósseo.',
		effectDescription: 'Proteínas +18/s, ATP +12/s, Glicose +10/s',
		cost: { atp: 2200, proteinas: 1800, glicose: 1400, oxigenio: 1000, cells: 5 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 18;
			gameState.gainSpeeds.atp += 12;
			gameState.gainSpeeds.glicose += 10;
			discover('boneCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.muscleCells) {
				unmet.push(upgrades.muscleCells.name);
			}
			return unmet;
		}
	},
	fatCells: {
		id: 'fatCells',
		name: 'Células Adiposas',
		description: 'Armazenam gordura, fornecendo energia e isolamento térmico.',
		effectDescription: 'Glicose +25/s, ATP +15/s, Proteínas +8/s',
		cost: { atp: 2500, proteinas: 2000, glicose: 1800, oxigenio: 1200, cells: 6 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 25;
			gameState.gainSpeeds.atp += 15;
			gameState.gainSpeeds.proteinas += 8;
			discover('fatCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.boneCells) {
				unmet.push(upgrades.boneCells.name);
			}
			return unmet;
		}
	},
	skinCells: {
		id: 'skinCells',
		name: 'Células da Pele',
		description:
			'Incluem melanócitos que produzem melanina, responsáveis pela coloração da pele, e células que atuam na proteção e regulação térmica.',
		effectDescription: 'Proteínas +20/s, Oxigênio +15/s, Glicose +12/s',
		cost: { atp: 2800, proteinas: 2200, glicose: 1600, oxigenio: 1400, cells: 7 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 20;
			gameState.gainSpeeds.oxigenio += 15;
			gameState.gainSpeeds.glicose += 12;
			discover('skinCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.fatCells) {
				unmet.push(upgrades.fatCells.name);
			}
			return unmet;
		}
	},
	immuneCells: {
		id: 'immuneCells',
		name: 'Células do Sistema Imunológico',
		description:
			'Produzem anticorpos e combatem agentes patogênicos, incluindo linfócitos, macrófagos e células natural killer.',
		effectDescription: 'Proteínas +25/s, ATP +18/s, Oxigênio +20/s',
		cost: { atp: 3200, proteinas: 2500, glicose: 2000, oxigenio: 1800, cells: 8 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 25;
			gameState.gainSpeeds.atp += 18;
			gameState.gainSpeeds.oxigenio += 20;
			discover('immuneCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.skinCells) {
				unmet.push(upgrades.skinCells.name);
			}
			return unmet;
		}
	},
	pancreasCells: {
		id: 'pancreasCells',
		name: 'Células do Pâncreas',
		description: 'Células beta produzem insulina, enquanto outras produzem enzimas digestivas.',
		effectDescription: 'Glicose +30/s, ATP +20/s, Proteínas +15/s',
		cost: { atp: 3500, proteinas: 2800, glicose: 2400, oxigenio: 2000, cells: 9 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.glicose += 30;
			gameState.gainSpeeds.atp += 20;
			gameState.gainSpeeds.proteinas += 15;
			discover('pancreasCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.immuneCells) {
				unmet.push(upgrades.immuneCells.name);
			}
			return unmet;
		}
	},
	liverCells: {
		id: 'liverCells',
		name: 'Células do Fígado',
		description:
			'Desempenham funções como a produção de bile, desintoxicação e metabolismo de substâncias.',
		effectDescription: 'ATP +25/s, Proteínas +22/s, Glicose +18/s, Oxigênio +16/s',
		cost: { atp: 4000, proteinas: 3200, glicose: 2800, oxigenio: 2400, cells: 10 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.atp += 25;
			gameState.gainSpeeds.proteinas += 22;
			gameState.gainSpeeds.glicose += 18;
			gameState.gainSpeeds.oxigenio += 16;
			discover('liverCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.pancreasCells) {
				unmet.push(upgrades.pancreasCells.name);
			}
			return unmet;
		}
	},
	cartilageCells: {
		id: 'cartilageCells',
		name: 'Células do Tecido Cartilaginoso',
		description: 'Condroblastos e condrócitos formam e mantêm a cartilagem.',
		effectDescription: 'Proteínas +28/s, ATP +22/s, Glicose +20/s, Oxigênio +18/s',
		cost: { atp: 4500, proteinas: 3600, glicose: 3200, oxigenio: 2800, cells: 12 },
		tier: 5,
		effect: (gameState: GameState) => {
			gameState.gainSpeeds.proteinas += 28;
			gameState.gainSpeeds.atp += 22;
			gameState.gainSpeeds.glicose += 20;
			gameState.gainSpeeds.oxigenio += 18;
			discover('cartilageCells');
		},
		requirements: (gameState: GameState) => {
			const unmet: string[] = [];
			if (!gameState.purchasedUpgrades.liverCells) {
				unmet.push(upgrades.liverCells.name);
			}
			return unmet;
		}
	}
};
