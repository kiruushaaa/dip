import { useState, ChangeEvent } from 'react';
import cn from 'classnames';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Information } from 'components/Information';
import { Graph as GraphType } from 'types/Graph';
import {
    INITIAL_GRAPH,
    INITIAL_VERTEX_LIST
} from 'helpers/global';
import {
    ACTIVE_COLOR,
    VIS_ACTIVE_NODE_COLOR,
    VIS_VISITED_NODE_COLOR,
    VIS_EDGE_PATH_CONFIG,
    VIS_DEFAULT_NODE_COLOR
} from 'helpers/vis';
import { parseValue, timer } from 'utils/global';
import { prepareVisData } from 'utils/graph/vis';
import { prepareDijsktraData, restorePath } from 'utils/graph/dijkstra';
import { dijkstra } from 'algorithms/dijkstra';

import global from 'style/global.module.css';
import styles from './Graph.module.css';

// TODO: this one and all others pieces of shit definitely should be rewritten
export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);
    const [vertexList, setVertexList] = useState<number[]>(INITIAL_VERTEX_LIST);
    const [network, setNetwork] = useState<any>({});
    const [executingStatus, updateExecutingStatus] = useState<boolean>(false);

    const [startVertex, endVertex] = vertexList;
    const isButtonDisabled = Object.keys(network).length === 0 || executingStatus;
    const { stepByStep, previous } = dijkstra(prepareDijsktraData(graph), startVertex);

    const onStartVertexChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
        setVertexList(([_, end]) => [
            Number(value),
            end
        ]);
    };

    const onEndVertexChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
        setVertexList(([start]) => [
            start,
            Number(value)
        ]);
    };

    const resetCanvas = (): void => {
        const networkBody = network.body;

        graph.forEach(({ id }) => {
            networkBody.nodes[id].setOptions({
                color: VIS_DEFAULT_NODE_COLOR,
                label: String(id)
            });
        });

        network.redraw();
    };

    const showPathTo = async (): Promise<void> => {
        const networkBody = network.body;
        const path = restorePath(previous, endVertex);
        const additionalEdgeList = [] as number[];

        network.unselectAll();
        // resetCanvas();
        updateExecutingStatus(true);

        for (const [idx, nodeId] of path.entries()) {
            const to = path[idx + 1];

            if (!to) break;

            const [edge] = networkBody.data.edges.add({
                color: ACTIVE_COLOR,
                from: nodeId,
                to,
                width: 4
            });

            additionalEdgeList.push(edge);
            network.redraw();
            await timer(2000);
        }

        await timer(5000);

        networkBody.data.edges.remove(additionalEdgeList);
        updateExecutingStatus(false);
    };

    const showJourney = async (): Promise<void> => {
        const [{ distances: initialDistances }, ...journey] = stepByStep;
        const networkBody = network.body;

        network.unselectAll();
        resetCanvas();
        updateExecutingStatus(true);

        // drawing meta data right to the node identifier
        Object.entries(initialDistances).forEach(([key, value]) => {
            networkBody.nodes[key].setOptions({
                label: `${key} [${parseValue(value)}]`
            });
            network.redraw();
        });

        await timer(3000);

        for (const [stepIndex, { activeVertex, distances }] of journey.entries()) {
            // coloring active node
            networkBody.nodes[activeVertex].setOptions({
                color: VIS_ACTIVE_NODE_COLOR
            });
            network.redraw();

            await timer(2000);

            const { edges = [] } = graph.find(({ id }) => id === activeVertex) ?? {};

            // adding an edge representing an iteration
            for (const { to, weight } of edges) {
                const currentWeight = stepByStep[stepIndex].distances[to];
                const potentialWeight = distances[activeVertex] + weight;

                const [edge] = networkBody.data.edges.add({
                    ...VIS_EDGE_PATH_CONFIG,
                    from: activeVertex,
                    to,
                    label: `${distances[activeVertex]} + ${weight} = ${potentialWeight} < ${parseValue(currentWeight)} ?`
                });
                network.redraw();

                await timer(1000);

                // update meta for the node
                networkBody.nodes[to].setOptions({
                    label: `${to} [${Math.min(potentialWeight, distances[to])}]`
                });
                network.redraw();

                await timer(3000);

                networkBody.data.edges.remove(edge);
                network.redraw();
            }

            // marking the node as visited
            networkBody.nodes[activeVertex].setOptions({ color: VIS_VISITED_NODE_COLOR });
            network.redraw();
        }

        updateExecutingStatus(false);
    };

    return (
        <section className={ styles.wrapper } aria-label="Graph">
            <Information />
            <GraphDataInput callback={ setGraph } />
            <fieldset className={ styles.info }>
                <legend>Find the shortest path</legend>
                <label>
                    From node
                    <input
                      type="number"
                      value={ startVertex }
                      onChange={ onStartVertexChange }
                    />
                </label>
                <label>
                    To node
                    <input
                      type="number"
                      value={ endVertex }
                      onChange={ onEndVertexChange }
                    />
                </label>
            </fieldset>
            <div className={ styles.btnWrapper }>
                <button
                  className={ cn(global.btn, global.btnSuccess) }
                  type="button"
                  onClick={ showJourney }
                  disabled={ isButtonDisabled }
                >
                    Show journey
                </button>
                <button
                  className={ cn(global.btn, global.btnPath) }
                  type="button"
                  onClick={ showPathTo }
                  disabled={ isButtonDisabled  }
                >
                    Show the shortest path
                </button>
                <button
                  className={ cn(global.btn, global.btnDanger, styles.btnDanger) }
                  type="button"
                  onClick={ resetCanvas }
                  disabled={ isButtonDisabled }
                >
                    Reset a draw
                </button>
            </div>
            <VisGraph
              graph={ prepareVisData(graph) }
              setNetwork={ setNetwork }
            />
        </section>
    );
};
