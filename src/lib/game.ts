import { writable } from 'svelte/store';

type GameState = {
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
};

export const gameStore = writable<GameState>({
	resources: {
		proteinas: 0,
		oxigenio: 0,
		glicose: 0,
		atp: 0
	},
	gainSpeeds: {
		proteinas: 0.2,
		oxigenio: 0.2,
		glicose: 0.2,
		atp: 0.2
	}
});

let timer: number | undefined;

export function startGameTimer() {
	if (timer) return;

	timer = setInterval(() => {
		gameStore.update((state) => ({
			...state,
			resources: {
				proteinas: state.resources.proteinas + state.gainSpeeds.proteinas,
				oxigenio: state.resources.oxigenio + state.gainSpeeds.oxigenio,
				glicose: state.resources.glicose + state.gainSpeeds.glicose,
				atp: state.resources.atp + state.gainSpeeds.atp
			}
		}));
	}, 1000);
}

export function stopGameTimer() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
	}
}

export function resetGame() {
	gameStore.set({
		resources: {
			proteinas: 0,
			oxigenio: 0,
			glicose: 0,
			atp: 0
		},
		gainSpeeds: {
			proteinas: 0.2,
			oxigenio: 0.2,
			glicose: 0.2,
			atp: 0.2
		}
	});
}

export function getGameState(): GameState {
	let state: GameState = {
		resources: {
			proteinas: 0,
			oxigenio: 0,
			glicose: 0,
			atp: 0
		},
		gainSpeeds: {
			proteinas: 0.2,
			oxigenio: 0.2,
			glicose: 0.2,
			atp: 0.2
		}
	};

	gameStore.subscribe((value) => {
		state = value;
	})();

	return state;
}
