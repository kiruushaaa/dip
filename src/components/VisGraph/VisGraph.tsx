import Graph from 'react-graph-vis';

import { VisGraph as VisGraphType } from 'types/VisGraph';

interface IVisGraph {
    graph: VisGraphType
}

export const VisGraph = ({ graph }: IVisGraph) => {
    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        height: "400px"
    };

    const events = {
        selectNode: function(event: any) {
            console.log(event);
        },
        selectEdge: console.log
    };

    return (
        <Graph
            graph={ graph }
            options={ options }
            events={ events }
        />
    );
}
