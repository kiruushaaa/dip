import { Dispatch, SetStateAction } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { EdgeInput } from 'components/EdgeInput';
import { Graph } from 'types/Graph';
import { INITIAL_GRAPH, MIN_NODES_AMOUNT } from 'helpers/global';

export interface IGraphDataInput {
    callback: Dispatch<SetStateAction<Graph>>
}

export type GraphData = {
    graph: Graph
}

export const GraphDataInput = ({ callback }: IGraphDataInput) => {
    const {
        register,
        control,
        handleSubmit,
        getValues,
    } = useForm<GraphData>({ defaultValues: { graph: INITIAL_GRAPH } });
    const { fields, remove, append } = useFieldArray({ name: 'graph', control });

    const appendNode = (): void => {
        const { graph } = getValues();

        append({
            id: Math.max(...graph.map(({ id }) => id), 0) + 1,
            edges: []
        });
    };

    const getNodes = (indexToRemove: number): number[] => {
        const { graph } = getValues();

        return graph.reduce((nodes, { id }, idx) => {
            if (idx !== indexToRemove) {
                nodes.push(id);
            }

            return nodes;
        }, [] as number[]);
    };

    const onSubmit = ({ graph }: GraphData): void => callback(graph);

    return (
        <form onSubmit={ handleSubmit(onSubmit) } aria-label="Graph Input">
            <ul aria-label="Node List">
                { fields.map(({ id: key }, idx) => {
                    return (
                        <li key={ key } aria-label={ `Node ${idx}` } style={ { margin: '2rem' } }>
                            <input
                                type="number"
                                { ...register(`graph.${idx}.id` as const, {
                                    valueAsNumber: true
                                }) }
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={ (): void => remove(idx) }
                                disabled={ fields.length === MIN_NODES_AMOUNT }
                            >
                                Remove
                            </button>
                            <EdgeInput
                                nodeIdx={ idx }
                                nodes={ getNodes(idx) }
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
};
