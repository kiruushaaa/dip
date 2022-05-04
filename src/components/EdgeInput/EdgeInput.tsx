import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

import { GraphData } from 'components/GraphDataInput';

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
        <div>
            <ul aria-label={ `Edges of the node ${nodeIdx}` }>
                { fields.map(({ id: key }, idx) => {
                    return (
                        <li key={ key }>
                            <select { ...register(`graph.${nodeIdx}.edges.${idx}.to` as const, { valueAsNumber: true }) }>
                                { nodes.map(nodeId => {
                                    return (
                                        <option
                                            key={ `node_${nodeId}` }
                                            defaultValue={ nodeId }
                                        >
                                            { nodeId }
                                        </option>
                                    );
                                }) }
                            </select>
                            <input
                                type="number"
                                { ...register(`graph.${nodeIdx}.edges.${idx}.weight` as const, { valueAsNumber: true }) }
                            />
                            <button type="submit" onClick={ (): void => remove(idx) }>
                                Remove edge
                            </button>
                        </li>
                    );
                }) }
            </ul>
            <button
                type="button"
                onClick={ appendEdge }
                disabled= { fields.length === nodes.length }
            >
                Append edge
            </button>
        </div>
    );
};
