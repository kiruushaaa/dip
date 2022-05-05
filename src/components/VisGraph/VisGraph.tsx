import { Dispatch, SetStateAction } from 'react';
import Graph from 'react-graph-vis';

import { VisGraph as VisGraphType } from 'types/VisGraph';

interface IVisGraph {
    graph: VisGraphType
    setVertex: Dispatch<SetStateAction<number>>
    setNetwork: Dispatch<SetStateAction<any>>
}

export const VisGraph = ({ graph, setVertex, setNetwork }: IVisGraph) => {
    const options = {
        physics: {
            enabled: false,
        },
        edges: {
            color: '#999',
            smooth: {
                type: 'vertical',
                forceDirection: 'none',
                roundness: 0,
            }
        },
        height: '520px'
    };

    const events = {
        selectNode: ({ nodes }: any): void => {
            const [vertex] = nodes as number[];

            setVertex(vertex);
        }
    };

    return (
        <Graph
            graph={ graph }
            options={ options }
            events={ events }
            getNetwork={ (network: any): void=> {
                setNetwork(network);
            } }
        />
    );
};
