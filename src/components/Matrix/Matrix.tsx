import { useState } from 'react';

export const DEFAULT_DIM = 5;

export const Matrix = () => {
    const [dim, setDim] = useState<number>(DEFAULT_DIM);

    return (
        <section aria-label="Matrix">
            <DimensionInput callback={ setDim } />
            <MatrixInput dim={ dim } />
        </section>
    );
};
