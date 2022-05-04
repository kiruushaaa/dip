import { Edge, Graph } from 'types/Graph';
import { NumericEdge, GraphObj } from 'types/Dijkstra';

const prepareEdges = (edges: Edge[]): NumericEdge => edges.reduce((obj, { to, weight }) => {
    obj[to] = weight;

    return obj;
}, {} as NumericEdge);

export const prepareDijsktraData = (graph: Graph): GraphObj => graph.reduce((graphObj, { id, edges }) => {
    graphObj[id] = prepareEdges(edges);

    return graphObj;
}, {} as GraphObj);

export const restorePath = (obj: any, endVertex: number, path: number[] = []): number[] => {
    const to = obj[endVertex];
    const newPath = [Number(endVertex), ...path] as number[];
  
    return to ? restorePath(obj, to, newPath) : newPath;
}
