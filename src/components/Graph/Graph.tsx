import { useState, ChangeEvent } from 'react';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Graph as GraphType } from 'types/Graph';
import {
    NEUTRAL_BUTTON_CLASS_NAME,
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

import styles from './Graph.module.css';

// TODO: this one and all others pieces of shit definitely should be rewritten
export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);
    const [[startVertex, endVertex], setVertexList] = useState<number[]>(INITIAL_VERTEX_LIST);
    const [network, setNetwork] = useState<any>({});
    const [executingStatus, updateExecutingStatus] = useState<boolean>(false);

    const isButtonDisabled = Object.keys(network).length === 0 || executingStatus;
    const { stepByStep, previous } = dijkstra(prepareDijsktraData(graph), startVertex);

    const onStartVertexChange = ({ target: value }: ChangeEvent<HTMLInputElement>): void => {
        setVertexList(([_, vertex]) => [Number(value), vertex]);
    };

    const onEndVertexChange = ({ target: value }: ChangeEvent<HTMLInputElement>): void => {
        setVertexList(([vertex]) => [vertex, Number(value)]);
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
        resetCanvas();
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

        // drawing meta data under the node identifier
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

            // marking the node as proceeded
            networkBody.nodes[activeVertex].setOptions({ color: VIS_VISITED_NODE_COLOR });
            network.redraw();
        }

        updateExecutingStatus(false);
    };

    return (
        <section className={ styles.wrapper } aria-label="Graph">
            <GraphDataInput callback={ setGraph } />
            <fieldset className={ styles.info }>
                <label>
                    Type <b>start</b> vertex:
                    <input
                      type="number"
                      defaultValue={ startVertex }
                      onChange={ onStartVertexChange }
                    />
                </label>
                <label>
                    Type <b>end</b> vertex:
                    <input
                      type="number"
                      defaultValue={ endVertex }
                      onChange={ onEndVertexChange }
                    />
                </label>
            </fieldset>
            <div className={ styles.btnWrapper }>
                <button
                  className={ NEUTRAL_BUTTON_CLASS_NAME }
                  type="button"
                  onClick={ showJourney }
                  disabled={ isButtonDisabled }
                >
                    Show journey
                </button>
                <button
                  className={ NEUTRAL_BUTTON_CLASS_NAME }
                  type="button"
                  onClick={ resetCanvas }
                  disabled={ isButtonDisabled }
                >
                    Reset a draw
                </button>
                <button
                  className={ NEUTRAL_BUTTON_CLASS_NAME }
                  type="button"
                  onClick={ showPathTo }
                  disabled={ isButtonDisabled }
                >
                    Show the shortest path
                </button>
            </div>
            <VisGraph
              graph={ prepareVisData(graph) }
              setNetwork={ setNetwork }
            />
        </section>
    );
};
