import { Control, useFieldArray, UseFormRegister } from 'react-hook-form';
import cn from 'classnames';

import { GraphData } from 'components/GraphDataInput';

import global from 'style/global.module.css';
import styles from './EdgeInput.module.css';

export interface IEdgeInput {
    nodeIdx: number
    nodes: number[]
    control: Control<GraphData>
    register: UseFormRegister<GraphData>
}

export const EdgeInput = ({ nodeIdx, nodes, control, register }: IEdgeInput) => {
    const { fields, remove, append } = useFieldArray({
        name: `graph.${nodeIdx}.edges` as const,
        control
    });

    const appendEdge = (): void => {
        append({ to: 0, weight: 0 });
    };

    return (
        <div className={ styles.outerWrapper }>
            <ul className={ styles.wrapper } aria-label={ `Edges of the node ${nodeIdx}` }>
                { fields.map(({ id: key }, idx) => {
                    return (
                        <li key={ key } className={ styles.edgeWrapper }>
                            <label className={ styles.nodeSelect }>
                                To
                                <select { ...register(`graph.${nodeIdx}.edges.${idx}.to` as const, {
                                    valueAsNumber: true,
                                }) }>
                                    { nodes.map(nodeId => {
                                        return (
                                            <option
                                              key={ `node_${nodeId}` }
                                              value={ nodeId }
                                            >
                                                node { nodeId }
                                            </option>
                                        );
                                    }) }
                                </select>
                            </label>
                            <label className={ styles.weightChooser }>
                                with weight
                                <input
                                  type="number"
                                  min="1"
                                  { ...register(`graph.${nodeIdx}.edges.${idx}.weight` as const, {
                                      valueAsNumber: true,
                                      min: 1
                                  }) }
                                />
                            </label>
                            <button
                              className={ cn(global.btn, global.btnRemove, styles.btnRemove) }
                              type="submit"
                              onClick={ (): void => remove(idx) }
                            >
                                Remove edge
                            </button>
                        </li>
                    );
                }) }
            </ul>
            <button
              className={ cn(global.btn, global.btnAppend, styles.btnAppend) }
              type="button"
              onClick={ appendEdge }
              disabled= { fields.length === nodes.length }
            >
                Append edge
            </button>
        </div>
    );
};
