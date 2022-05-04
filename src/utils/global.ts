export const INF_SYMBOL = '∞';

export const parseValue = (value: any): string | number => value === Infinity ? INF_SYMBOL : value;

export const timer = (time: number) => new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
        resolve();
        clearTimeout(timeout);
    }, time);
});
