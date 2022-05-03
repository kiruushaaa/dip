import { useState } from 'react';

import { GraphDataInput } from 'components/GraphDataInput';
import { VisGraph } from 'components/VisGraph';
import { Graph as GraphType} from 'types/Graph';
import { INITIAL_GRAPH } from 'helpers/global';
import { prepareVisData } from 'utils/graph';

export const Graph = () => {
    const [graph, setGraph] = useState<GraphType>(INITIAL_GRAPH);

    return (
        <section aria-label="Matrix">
            <GraphDataInput callback={ setGraph } />
            <VisGraph graph={ prepareVisData(graph) } />
        </section>
    );
};
