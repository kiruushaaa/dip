import { useForm, useFieldArray } from 'react-hook-form';

import { EdgeInput } from 'components/EdgeInput';

export interface IGraphDataInput {
}

export type GraphValues = {
    graph: {
        id: number
        edges: {
            to: number
            weight: number
        }[]
    }[]
};

const INITIAL_GRAPH: GraphValues = {
    graph: [
        { id: 1, edges: [{ to: 2, weight: 2 }, { to: 3, weight: 1 }] },
        { id: 2, edges: [{ to: 6, weight: 7 }] },
        { id: 3, edges: [{ to: 4, weight: 5 }, { to: 5, weight: 2 }] },
        { id: 4, edges: [{ to: 6, weight: 2 }] },
        { id: 5, edges: [{ to: 6, weight: 1 }] },
        { id: 6, edges: [{ to: 7, weight: 1 }] },
        { id: 7, edges: [] }
    ]
}

const MIN_NODES_AMOUNT = 3;

export const GraphDataInput = (props: IGraphDataInput) => {
    const {
        register,
        control,
        handleSubmit,
        getValues,
    } = useForm<GraphValues>({ defaultValues: INITIAL_GRAPH });
    const { fields, remove, append } = useFieldArray({ name: 'graph', control });

    const onSubmit = (data: GraphValues): void => console.log(data);

    const appendNode = (): void => {
        const { graph } = getValues();

        append({
            id: Math.max(...graph.map(({ id }) => id), 0) + 1,
            edges: []
        });
    };

    return (
        <form onSubmit={ handleSubmit(onSubmit) } aria-label="Graph Input">
            <ul>
                { fields.map(({ id }, idx) => {
                    return (
                        <li key={ id }>
                            <input
                                type="number"
                                {...register(`graph.${idx}.id` as const, {
                                    valueAsNumber: true
                                })}
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={(): void => remove(idx)}
                                disabled={ fields.length === MIN_NODES_AMOUNT }
                            >
                                Remove
                            </button>
                            <EdgeInput
                                nodeIdx={ idx }
                                control={ control }
                                register={ register }
                            />
                        </li>
                    );
                }) }
            </ul>
            <button type="button" onClick={ appendNode }>
                Append node
            </button>
            <button type="submit">
                Submit graph
            </button>
        </form>
    );
}
