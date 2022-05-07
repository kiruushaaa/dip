import { Dispatch, SetStateAction } from 'react';
import Graph from 'react-graph-vis';

import { VisGraph as VisGraphType } from 'types/VisGraph';

import './vis.css';

interface IVisGraph {
    graph: VisGraphType
    setNetwork: Dispatch<SetStateAction<any>>
}

export const VisGraph = ({ graph, setNetwork }: IVisGraph) => {
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
        height: '550'
    };

    return (
        <Graph
          graph={ graph }
          options={ options }
          getNetwork={ (network: any): void=> {
              setNetwork(network);
          } }
        />
    );
};
