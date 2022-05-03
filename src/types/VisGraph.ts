export type VisNode = {
    id: number
    label: string
}

export type VisEdge = {
    from: number
    to: number
    label: string
}

export type VisGraph = {
    nodes: VisNode[]
    edges: VisEdge[]
}
