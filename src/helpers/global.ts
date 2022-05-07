import cn from 'classnames';

import { Graph } from 'types/Graph';

import global from 'style/global.module.css';

export const MIN_NODES_AMOUNT = 3;

export const INITIAL_GRAPH: Graph = [
    { id: 1, edges: [{ to: 2, weight: 2 }, { to: 3, weight: 1 }] },
    { id: 2, edges: [{ to: 6, weight: 7 }] },
    { id: 3, edges: [{ to: 4, weight: 5 }, { to: 5, weight: 2 }] },
    { id: 4, edges: [{ to: 6, weight: 2 }] },
    { id: 5, edges: [{ to: 6, weight: 1 }] },
    { id: 6, edges: [{ to: 7, weight: 1 }] },
    { id: 7, edges: [] }
];

export const INITIAL_VERTEX_LIST = [1, 7];

export const NEUTRAL_BUTTON_CLASS_NAME = cn(global.btn, global.btnPrimary);
