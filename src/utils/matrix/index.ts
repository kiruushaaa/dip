export const getArray = (dim: number, startIndex: number = 0): { value: number }[] =>
    Array.from({ length: dim }, (_, idx) => ({ value: startIndex + idx + 1 }));