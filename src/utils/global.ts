export const INF_SYMBOL = '∞';

export const parseValue = (value: any): string | number => value === Infinity ? INF_SYMBOL : value;