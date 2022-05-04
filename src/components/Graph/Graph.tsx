import { useState } from 'react';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Graph as GraphType} from 'types/Graph';
import { INITIAL_GRAPH } from 'helpers/global';
import { parseValue } from 'utils/global';
import { prepareVisData } from 'utils/graph/vis';
import { prepareDijsktraData, restorePath } from 'utils/graph/dijkstra';
import { dijkstra } from 'algorithms/dijkstra';

export const timer = (time: number) => new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
        resolve();
        clearTimeout(timeout);
    }, time);
});

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
                color: {
                    background: '#ca7575',
                    border: '#887171'
                }
            });
            network.redraw();

            await timer(2000);

            const { edges = [] } = graph.graph.find(({ id }) => id === activeVertex) ?? {};

            for (const { to, weight } of edges) {
                const currentWeight = stepByStep[stepIndex].distances[to];
                const potentialWeight = distances[activeVertex] + weight;

                const [edge] = networkBody.data.edges.add({
                    from: activeVertex,
                    to,
                    smooth: { roundness: 1 },
                    color: '#758ea3',
                    width: 3,
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

            networkBody.nodes[activeVertex].setOptions({ color: { background: '#56cada', border: '#8b8b8b' } });
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
