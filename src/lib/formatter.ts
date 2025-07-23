class CurrencyNumberFormat extends Intl.NumberFormat {
	format(value: number | bigint): string {
		return super.format(typeof value === 'number' ? Math.floor(value) : value);
	}
}

export const bigNumberFormatter = new CurrencyNumberFormat('pt-br', {
	notation: 'compact',
	compactDisplay: 'long'
});
