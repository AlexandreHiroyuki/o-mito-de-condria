export type Discovery = {
	id: string;
	name: string;
	message: string;
	description?: string;
	image?: string;
};

export const discoveries: Record<string, Discovery> = {
	mitochondria: {
		id: 'mitochondria',
		name: 'O Mito de Côndria!',
		message:
			'Você encontrou a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo.',
		description:
			'A mitocôndria é uma organela celular que produz energia através da respiração celular. Ela converte oxigênio e glicose em ATP, a moeda energética da célula.',
		image: '/mithocondria.png'
	},
	nucleus: {
		id: 'nucleus',
		name: 'O Centro de Comando',
		message: 'Você descobriu o núcleo celular! O centro de controle de toda a atividade celular.',
		description:
			'O núcleo é a organela mais importante da célula, contendo o material genético (DNA) que controla todas as funções celulares.',
		image: '/nucleus.png'
	},
	ribosomes: {
		id: 'ribosomes',
		name: 'Fábricas de Proteínas',
		message: 'Você encontrou os ribossomos! As fábricas microscópicas que produzem proteínas.',
		description:
			'Os ribossomos são organelas responsáveis pela síntese de proteínas, essenciais para todas as funções celulares.',
		image: '/cell_shell.png'
	},
	cellDivision: {
		id: 'cellDivision',
		name: 'A Divisão Celular',
		message: 'Você testemunhou a divisão celular! Uma célula se torna duas.',
		description:
			'A divisão celular é o processo pelo qual uma célula se divide em duas células filhas idênticas.',
		image: '/cell_shell_cytokinesis.png'
	},
	proteinSynthesis: {
		id: 'proteinSynthesis',
		name: 'Síntese Proteica',
		message: 'Você observou a síntese de proteínas em ação!',
		description:
			'A síntese proteica é o processo pelo qual as células produzem proteínas a partir do código genético.',
		image: '/cell_shell.png'
	},
	energyProduction: {
		id: 'energyProduction',
		name: 'Produção de Energia',
		message: 'Você descobriu como a célula produz energia!',
		description:
			'A produção de energia na célula ocorre principalmente através da respiração celular nas mitocôndrias.',
		image: '/mithocondria.png'
	},
	centriole: {
		id: 'centriole',
		name: 'O Centríolo',
		message: 'Você descobriu o centríolo! A organela responsável pela divisão celular.',
		description:
			'O centríolo é uma organela que forma o fuso mitótico durante a divisão celular, garantindo que os cromossomos sejam distribuídos corretamente.',
		image: '/dividing_cells.png'
	},
	cilia: {
		id: 'cilia',
		name: 'Cílios e Flagelos',
		message: 'Você descobriu os cílios e flagelos! Estruturas de movimento e captação celular.',
		description:
			'Os cílios e flagelos são estruturas microscópicas formadas por microtúbulos que permitem o movimento celular e a captação de partículas do ambiente.',
		image: '/cell_shell.png'
	},
	lysosome: {
		id: 'lysosome',
		name: 'O Lisossomo',
		message: 'Você descobriu o lisossomo! A organela responsável pela digestão intracelular.',
		description:
			'O lisossomo é uma organela que contém enzimas digestivas capazes de quebrar macromoléculas em nutrientes utilizáveis pela célula.',
		image: '/cell_shell.png'
	},
	peroxisome: {
		id: 'peroxisome',
		name: 'O Peroxissomo',
		message: 'Você descobriu o peroxissomo! A organela que decompõe ácidos graxos e aminoácidos.',
		description:
			'O peroxissomo é uma organela que decompõe ácidos graxos e aminoácidos, produzindo peróxido de hidrogênio que é convertido em oxigênio.',
		image: '/cell_shell.png'
	},
	glycolysis: {
		id: 'glycolysis',
		name: 'A Glicólise',
		message: 'Você descobriu a glicólise! O processo que quebra a glicose em piruvato.',
		description:
			'A glicólise é um processo anaeróbico que quebra a glicose em piruvato, produzindo ATP e liberando energia para a célula.',
		image: '/cell_shell.png'
	},
	fermentation: {
		id: 'fermentation',
		name: 'A Fermentação',
		message: 'Você descobriu a fermentação! O processo anaeróbico que regenera NAD+.',
		description:
			'A fermentação é um processo anaeróbico que converte piruvato em lactato ou etanol, regenerando NAD+ para continuar a glicólise.',
		image: '/cell_shell.png'
	},
	phagocytosis: {
		id: 'phagocytosis',
		name: 'A Fagocitose',
		message: 'Você descobriu a fagocitose! O processo de englobamento de partículas grandes.',
		description:
			'A fagocitose é o processo pelo qual a célula engloba partículas grandes, formando vacúolos que são digeridos pelos lisossomos.',
		image: '/cell_shell.png'
	},
	endocytosis: {
		id: 'endocytosis',
		name: 'A Endocitose',
		message:
			'Você descobriu a endocitose! O processo de internalização de fluidos e macromoléculas.',
		description:
			'A endocitose é o processo de internalização de fluidos e macromoléculas através da invaginação da membrana plasmática.',
		image: '/cell_shell.png'
	},
	meiosis: {
		id: 'meiosis',
		name: 'Meiose! Um novo começo para a vida!',
		message:
			'Você ativou a meiose pela primeira vez! O processo de divisão celular que forma gametas.',
		description:
			'Novo organismo, novo mundo! A meiose é um tipo especial de divisão celular que reduz o número de cromossomos pela metade, formando células reprodutivas (gametas) com metade do material genético.',
		image: '/chromosome.png'
	}
};
