import Graph from 'react-graph-vis';

export const GraphComponent = () => {
    const graph = {
        nodes: [
            { id: 1, label: "Node 1", title: "node 1 tooltip text" },
            { id: 2, label: "Node 2", title: "node 2 tooltip text" },
            { id: 3, label: "Node 3", title: "node 3 tooltip text" },
            { id: 4, label: "Node 4", title: "node 4 tooltip text" },
            { id: 5, label: "Node 5", title: "node 5 tooltip text" },
            { id: 6, label: "Node 6", title: "node 6 tooltip text" },
            { id: 7, label: "Node 7", title: "node 7 tooltip text" }
        ],
        edges: [
            { from: 1, to: 2, label: '2' },
            { from: 1, to: 3, label: '1' },
            { from: 2, to: 6, label: '7' },
            { from: 1, to: 2, label: '2' },
            { from: 3, to: 4, label: '5' },
            { from: 3, to: 5, label: '2' },
            { from: 4, to: 6, label: '2' },
            { from: 5, to: 6, label: '1' },
            { from: 6, to: 7, label: '1' }
        ]
    };

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
            graph={graph}
            options={options}
            events={events}
        />
    );
}
