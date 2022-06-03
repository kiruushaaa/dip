import { Dispatch, SetStateAction } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import cn from 'classnames';

import { EdgeInput } from 'components/EdgeInput';
import { Graph } from 'types/Graph';
import { INITIAL_GRAPH, MIN_NODES_AMOUNT } from 'helpers/global';

import global from 'style/global.module.css';
import styles from './GraphDataInput.module.css';

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
    } = useForm<GraphData>({ mode: 'onBlur', defaultValues: { graph: INITIAL_GRAPH } });
    const { fields, append, remove } = useFieldArray({ name: 'graph', control });

    const appendNode = (): void => {
        const { graph } = getValues();

        append({
            id: Math.max(...graph.map(({ id }) => id), 0) + 1,
            edges: []
        }, { shouldFocus: false });
    };

    const removeNode = (): void => {
        remove(fields.length - 1);
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
        <form className={ styles.form } onSubmit={ handleSubmit(onSubmit) } aria-label="Graph Input">

            <div className={ styles.nodeAmountChooser }>
                <p>Amount of nodes:</p>
                <button
                  className={ cn(global.btn, global.btnAppend) }
                  type="button"
                  onClick={ appendNode }
                />
                <span className={ styles.nodeAmount } >{fields.length}</span>
                <button
                  className={ cn(global.btn, global.btnRemove) }
                  type="button"
                  onClick={ removeNode }
                  disabled={ fields.length === MIN_NODES_AMOUNT }
                />
            </div>
            <ul className={ styles.nodeList } aria-label="Node List">
                { fields.map(({ id: key }, idx) => {
                    return (
                        <li className={ styles.nodeWrapper } key={ key } aria-label={ `Node ${idx}` }>
                            <div className={ styles.nodeInnerWrapper }>
                                <label>
                                    Node
                                    <input
                                      type="number"
                                      { ...register(`graph.${idx}.id` as const, {
                                          valueAsNumber: true
                                      }) }
                                      readOnly
                                    />
                                </label>
                            </div>
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
            <button
              className={ cn(global.btn, global.btnPrimary) }
              type="submit">
            Submit graph
            </button>
        </form>
    );
};
