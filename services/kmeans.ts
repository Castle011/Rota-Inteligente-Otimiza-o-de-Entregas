
import { Point, Cluster } from '../types';
import { CLUSTER_COLORS } from '../constants';

const euclideanDistance = (p1: Point | { x: number; y: number }, p2: Point | { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const kmeans = (points: Point[], k: number, maxIterations = 20): Cluster[] => {
    if (points.length === 0 || k === 0) {
        return [];
    }
    
    // 1. Initialize centroids randomly
    let centroids = points.slice(0, k).map(p => ({ x: p.x, y: p.y }));
    
    let clusters: Point[][] = [];
    
    for (let i = 0; i < maxIterations; i++) {
        // 2. Assign points to the closest centroid
        clusters = Array.from({ length: k }, () => []);
        points.forEach(point => {
            let minDistance = Infinity;
            let closestCentroidIndex = 0;
            centroids.forEach((centroid, index) => {
                const distance = euclideanDistance(point, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroidIndex = index;
                }
            });
            clusters[closestCentroidIndex].push(point);
        });

        // 3. Recalculate centroids
        const newCentroids = clusters.map(cluster => {
            if (cluster.length === 0) {
                 // Re-initialize centroid if cluster is empty
                return points[Math.floor(Math.random() * points.length)];
            }
            const sum = cluster.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
            return { x: sum.x / cluster.length, y: sum.y / cluster.length };
        });

        // 4. Check for convergence
        let hasConverged = true;
        for (let j = 0; j < k; j++) {
            if (euclideanDistance(centroids[j], newCentroids[j]) > 0.001) {
                hasConverged = false;
                break;
            }
        }

        centroids = newCentroids;

        if (hasConverged) {
            break;
        }
    }

    return clusters.map((clusterPoints, index) => ({
        centroid: centroids[index],
        points: clusterPoints,
        color: CLUSTER_COLORS[index % CLUSTER_COLORS.length],
    }));
};
