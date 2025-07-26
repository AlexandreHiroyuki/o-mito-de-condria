import type { GameState } from './game.d.ts';

export const discoveries = {
	mitochondria: {
		id: 'mitochondria',
		name: 'O Mito de Côndria!',
		description:
			'Você encontrou a mitológica Côndria! Uma parceiria mutualista nunca antes vista na história do micro mundo.',

		onDiscover: (gameState: GameState) => {}
	}
};
