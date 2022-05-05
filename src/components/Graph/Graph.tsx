import { useState } from 'react';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Graph as GraphType } from 'types/Graph';
import { INITIAL_GRAPH } from 'helpers/global';
import {
    VIS_ACTIVE_NODE_COLOR,
    VIS_VISITED_NODE_COLOR,
    VIS_EDGE_PATH_CONFIG
} from 'helpers/vis';
import { parseValue, timer } from 'utils/global';
import { prepareVisData } from 'utils/graph/vis';
import { prepareDijsktraData, restorePath } from 'utils/graph/dijkstra';
import { dijkstra } from 'algorithms/dijkstra';

export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);
    const [vertex, setVertex] = useState<number>(1);
    const [network, setNetwork] = useState<any>({});

    const showJourney = async () => {
        const { stepByStep } = dijkstra(prepareDijsktraData(graph), vertex);
        const [{ distances: initialDistances }, ...journey] = stepByStep;
        const networkBody = network.body;

        Object.entries(initialDistances).forEach(([key, value]) => {
            networkBody.nodes[key].setOptions({
                label: `${key} [${parseValue(value)}]`
            });
            network.redraw();
        });

        await timer(3000);

        for (const [stepIndex, { activeVertex, distances }] of journey.entries()) {
            networkBody.nodes[activeVertex].setOptions({
                color: VIS_ACTIVE_NODE_COLOR
            });
            network.redraw();

            await timer(2000);

            const { edges = [] } = graph.find(({ id }) => id === activeVertex) ?? {};

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

                networkBody.nodes[to].setOptions({
                    label: `${to} [${Math.min(potentialWeight, distances[to])}]`
                });
                network.redraw();

                await timer(3000);

                networkBody.data.edges.remove(edge);
                network.redraw();
            }

            networkBody.nodes[activeVertex].setOptions({ color: VIS_VISITED_NODE_COLOR });
            network.redraw();
        }
    };

    return (
        <section aria-label="Graph">
            <GraphDataInput callback={ setGraph } />
            <button
                type="button"
                onClick={ showJourney }
                disabled={ Object.keys(network).length === 0 }
            >
                Show journey
            </button>
            <VisGraph
                graph={ prepareVisData(graph) }
                setVertex={ setVertex }
                setNetwork={ setNetwork }
            />
        </section>
    );
};
