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
		image: '/cell_shell.png'
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
		image: '/cell_shell.png'
	}
};
