import { useState, ChangeEvent } from 'react';
import cn from 'classnames';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
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
import { parseValue, wait } from 'utils/global';
import { prepareVisData } from 'utils/graph/vis';
import { prepareDijsktraData, restorePath } from 'utils/graph/dijkstra';
import { dijkstra } from 'algorithms/dijkstra';

import global from 'style/global.module.css';
import styles from './Graph.module.css';

export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);
    const [vertexList, setVertexList] = useState<number[]>(INITIAL_VERTEX_LIST);
    const [network, setNetwork] = useState<any>({});
    const [executingStatus, updateExecutingStatus] = useState<boolean>(false);
    const [nextStep, setNextStep] = useState<() => void>();
    const [isAutoMode, setAutoMode] = useState(true);

    const [startVertex, endVertex] = vertexList;
    const isButtonDisabled = Object.keys(network).length === 0 || executingStatus;
    const { stepByStep, previous } = dijkstra(prepareDijsktraData(graph), startVertex);

    const vertexChangeHandler = (isStartHandler = false) => ({ target: { value } }: ChangeEvent<HTMLSelectElement>): void => {
        resetCanvas();

        setVertexList(([start, end]) => {
            const newVertex = Number(value);

            return isStartHandler ? [newVertex, end] : [start, newVertex];
        });
    };

    const onAutoModeChange = (): void => {
        setAutoMode((isAutoMode) => !isAutoMode);
    };

    const flatPromise = () => new Promise<void>((resolve) => {
        setNextStep(() => () => resolve());
    });

    const waitForNextStep = async (time: number): Promise<void> => {
        const promises = [flatPromise()];

        if (isAutoMode) {
            promises.push(wait(time));
        }

        await Promise.race(promises);
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
        const pseudoEdges = [] as number[];

        network.unselectAll();
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

            pseudoEdges.push(edge);
            network.redraw();
            await wait(2000);
        }

        updateExecutingStatus(false);

        await wait(6000);

        networkBody.data.edges.remove(pseudoEdges);
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

        await waitForNextStep(3000);

        for (const [stepIndex, { activeVertex, distances }] of journey.entries()) {
            // coloring active node
            networkBody.nodes[activeVertex].setOptions({
                color: VIS_ACTIVE_NODE_COLOR
            });
            network.redraw();

            await waitForNextStep(2000);

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

                await waitForNextStep(1500);

                // update meta for the node
                networkBody.nodes[to].setOptions({
                    label: `${to} [${Math.min(potentialWeight, distances[to])}]`
                });
                network.redraw();

                await waitForNextStep(3000);

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
            <GraphDataInput callback={ setGraph } />
            <fieldset className={ styles.info }>
                <legend>Find the shortest path</legend>
                <label>
                    From node
                    <select defaultValue={ startVertex } onChange={ vertexChangeHandler(true) }>
                        { graph.map(({ id }) => {
                            return (
                                <option
                                  key={ `start_node_${id}` }
                                  value={ id }
                                  disabled={ id === endVertex }
                                >
                                    node { id }
                                </option>
                            );
                        }) }
                    </select>
                </label>
                <label>
                    To node
                    <select defaultValue={ endVertex } onChange={ vertexChangeHandler() }>
                        { graph.map(({ id }) => {
                            return (
                                <option
                                  key={ `end_node_${id}` }
                                  value={ id }
                                  disabled={ id === startVertex }
                                >
                                    node { id }
                                </option>
                            );
                        }) }
                    </select>
                </label>
            </fieldset>
            <label className={ cn(styles.journeyCheckbox) }>
                <input
                  type="checkbox"
                  onChange={ onAutoModeChange }
                  checked={ !isAutoMode }
                  disabled={ executingStatus }
                />
                Show journey click-by-click
            </label>
            <div className={ styles.btnWrapper }>
                {
                    executingStatus && !isAutoMode
                        ? (
                            <button
                              className={ cn(global.btn, global.btnNext) }
                              type="button"
                              onClick={ nextStep }
                            >
                                Next step
                            </button>
                        )
                        : (
                            <button
                              className={ cn(global.btn, global.btnSuccess) }
                              type="button"
                              onClick={ showJourney }
                              disabled={ isButtonDisabled }
                            >
                                Show journey
                            </button>
                        )
                }
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
