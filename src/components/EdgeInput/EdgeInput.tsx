import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

import { GraphValues } from 'components/GraphDataInput';

export interface IEdgeInput {
    nodeIdx: number
    control: Control<GraphValues>
    register: UseFormRegister<GraphValues>
}

export const EdgeInput = (props: IEdgeInput) => {
    return <div>Nested</div>;
};
