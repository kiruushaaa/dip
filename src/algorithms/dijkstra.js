const INITIAL_DATA = {
    minDistance: Infinity,
    nearestVertex: null
};

const findNearestVertex = (distances, visited) => {
    const { nearestVertex } = Object.keys(distances).reduce(({ minDistance, nearestVertex }, vertex) => {
        if (!visited[vertex] && (distances[vertex] < minDistance)) {
            return {
                minDistance: distances[vertex],
                nearestVertex: vertex
            };
        }

        return { minDistance, nearestVertex };
    }, INITIAL_DATA);

    return nearestVertex;
};

const prepareData = (vertices, startVertex) => ({
    distances: Object.assign({}, ...vertices.map(vertex => ({ [vertex]: Infinity })), { [startVertex]: 0 }),
    previous: Object.assign({}, ...vertices.map(vertex => ({ [vertex]: null }))),
    visited: {}
});

export const dijkstra = (graph, startVertex) => {
    const { distances, previous, visited } = prepareData(Object.keys(graph), startVertex);
    const stepByStep = [{ activeVertex: 0, distances: { ...distances } }];

    function handleVertex(vertex) {
        const activeVertexDistance = distances[vertex];

        const neighbors = graph[activeVertex];

        Object.keys(neighbors).forEach(neighborVertex => {
            const currentNeighborDistance = distances[neighborVertex];
            const newNeighborDistance = activeVertexDistance + neighbors[neighborVertex];

            if (newNeighborDistance < currentNeighborDistance) {
                distances[neighborVertex] = newNeighborDistance;
                previous[neighborVertex] = vertex;
            }
        });

        visited[vertex] = true;
    }

    let activeVertex = findNearestVertex(distances, visited);

    while(activeVertex) {
        handleVertex(activeVertex);
        stepByStep.push({ activeVertex: Number(activeVertex), distances: { ...distances } });
        activeVertex = findNearestVertex(distances, visited);
    }

    return { distances, previous, stepByStep };
};
