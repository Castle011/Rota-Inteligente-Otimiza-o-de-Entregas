
import { Point } from '../types';

const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

/**
 * Finds a tour for a set of points using the Nearest Neighbor heuristic.
 * This is a simple approximation for the Traveling Salesperson Problem (TSP).
 * The tour starts and ends at the specified startNode (depot).
 * @param points The delivery points to visit.
 * @param startNode The starting and ending point (e.g., the depot).
 * @returns An ordered array of points representing the tour.
 */
export const findNearestNeighborTour = (points: Point[], startNode: Point): Point[] => {
    if (points.length === 0) {
        return [startNode, startNode];
    }

    const unvisited = new Set(points);
    const tour: Point[] = [startNode];
    let currentPoint = startNode;

    while (unvisited.size > 0) {
        let nearestPoint: Point | null = null;
        let minDistance = Infinity;

        unvisited.forEach(point => {
            const d = distance(currentPoint, point);
            if (d < minDistance) {
                minDistance = d;
                nearestPoint = point;
            }
        });

        if (nearestPoint) {
            tour.push(nearestPoint);
            unvisited.delete(nearestPoint);
            currentPoint = nearestPoint;
        } else {
            // Should not happen if unvisited is not empty
            break;
        }
    }

    // Return to the depot
    tour.push(startNode);
    return tour;
};
