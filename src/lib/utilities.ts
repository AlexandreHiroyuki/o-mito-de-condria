import type { GameResources } from './game.d.ts';

class CurrencyNumberFormat extends Intl.NumberFormat {
	format(value: number | bigint): string {
		return super.format(typeof value === 'number' ? Math.floor(value) : value);
	}
}

export const bigNumberFormatter = new CurrencyNumberFormat('pt-br', {
	notation: 'compact',
	compactDisplay: 'long'
});

// Resource names mapping
const resourceNames: Record<string, string> = {
	proteinas: 'Proteínas',
	oxigenio: 'Oxigênio',
	glicose: 'Glicose',
	atp: 'ATP',
	cells: 'Células'
};

/**
 * Formats a cost object into a readable string
 */
export function formatCost(cost: Partial<GameResources>): string {
	const costEntries = Object.entries(cost);
	if (costEntries.length === 0) return 'Grátis';

	return costEntries
		.map(([resource, amount]) => {
			const resourceName = resourceNames[resource] || resource;
			return `${amount} ${resourceName}`;
		})
		.join(', ');
}

/**
 * Formats time remaining in MM:SS format
 */
export function formatTimeRemaining(timeLeft: number): string {
	if (timeLeft <= 0) return 'Pronto!';

	const minutes = Math.floor(timeLeft / (1000 * 60));
	const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Checks if player can afford a cost
 */
export function canAffordCost(resources: GameResources, cost: Partial<GameResources>): boolean {
	for (const [resource, amount] of Object.entries(cost)) {
		if (resources[resource as keyof GameResources] < amount) {
			return false;
		}
	}
	return true;
}
