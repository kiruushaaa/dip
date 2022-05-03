export type Edge = {
    to: number
    weight: number
}

export type Node = {
    id: number
    edges: Edge[]
}

export type Graph = {
    graph: Node[]
};
