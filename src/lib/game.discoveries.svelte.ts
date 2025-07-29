export type Discovery = {
	id: string;
	name: string;
	message: string;
};

export const discoveries: Record<string, Discovery> = {
	mitochondria: {
		id: 'mitochondria',
		name: 'O Mito de Côndria!',
		message:
			'Você encontrou a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo.'
	}
};
