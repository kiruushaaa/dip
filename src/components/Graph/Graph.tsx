import { useState } from 'react';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Graph as GraphType} from 'types/Graph';
import { INITIAL_GRAPH } from 'helpers/global';
import { prepareVisData } from 'utils/graph/vis';
import { prepareDijsktraData, restorePath } from 'utils/graph/dijkstra';
import { dijkstra } from 'algorithms/dijkstra';

export const TIMESTAMP = 700;

export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);
    const [vertex, setVertex] = useState<number>(1);
    const [network, setNetwork] = useState<any>({});

    const showPath = (): void => {
        const { journey } = dijkstra(prepareDijsktraData(graph), vertex);

        console.log(journey);

        journey.forEach(({ activeVertex, distances }) => {
            network.body.nodes[activeVertex].setOptions({ color: { background: 'yellowgreen', border: 'green' } });
            network.redraw();
        });

        // network.body.container.scrollIntoView({ behavior: 'smooth' });
        // const path = restorePath(previous, 7);


        // Object.keys(network.body.nodes).forEach((node) => {
        //     network.body.nodes[node].setOptions({ color: { background: '#97C2FC' } });
        // });

        // network.redraw();

        // path.reduce((time, node) => {
        //     const timeout = setTimeout(() => {
        //         network.body.nodes[node].setOptions({ color: { background: 'tomato' } });
        //         network.redraw();

        //         clearTimeout(timeout);
        //     }, time);

        //     return time + TIMESTAMP;
        // }, TIMESTAMP);
    }

    return (
        <section aria-label="Graph">
            <GraphDataInput callback={ setGraph } />
            <button
                type="button"
                onClick={ showPath }
                disabled={ Object.keys(network).length === 0 }
            >
                Show
            </button>
            <VisGraph
                graph={ prepareVisData(graph) }
                setVertex={ setVertex }
                setNetwork={ setNetwork }
            />
        </section>
    );
};
