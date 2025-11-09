
export interface Point {
    id: number;
    x: number;
    y: number;
}

export interface Cluster {
    centroid: { x: number; y: number };
    points: Point[];
    color: string;
}

export interface Route {
    points: Point[];
    color: string;
}
