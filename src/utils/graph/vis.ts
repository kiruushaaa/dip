import { Edge, Graph } from 'types/Graph';
import { VisEdge, VisGraph } from 'types/VisGraph';

const prepareVisEdges = (id: number, edges: Edge[]): VisEdge[] => edges.reduce((visEdges, { to, weight }) => {
    visEdges.push({ from: id, to, label: String(weight) });

    return visEdges;
}, [] as VisEdge[]);

export const prepareVisData = (graph: Graph): VisGraph => graph.reduce((visGraph, { id, edges }) => {
    visGraph.nodes.push({ id, label: String(id)});
    visGraph.edges.push(...prepareVisEdges(id, edges));

    return visGraph;
}, { nodes: [], edges: [] } as VisGraph);
