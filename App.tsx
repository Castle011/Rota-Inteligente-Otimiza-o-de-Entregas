
import React, { useState, useCallback, useMemo } from 'react';
import { Controls } from './components/Controls';
import { Map } from './components/Map';
import { InfoPanel } from './components/InfoPanel';
import { Point, Cluster, Route } from './types';
import { MAP_WIDTH, MAP_HEIGHT, DEPOT } from './constants';
import { kmeans } from './services/kmeans';
import { findNearestNeighborTour } from './services/pathfinding';

const App: React.FC = () => {
    const [numPoints, setNumPoints] = useState<number>(50);
    const [numClusters, setNumClusters] = useState<number>(5);
    const [points, setPoints] = useState<Point[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stage, setStage] = useState<'initial' | 'points' | 'clustered' | 'routed'>('initial');

    const handleGeneratePoints = useCallback(() => {
        setIsLoading(true);
        setClusters([]);
        setRoutes([]);
        const newPoints: Point[] = Array.from({ length: numPoints }, (_, id) => ({
            id,
            x: Math.random() * (MAP_WIDTH - 20) + 10,
            y: Math.random() * (MAP_HEIGHT - 20) + 10,
        }));
        setPoints(newPoints);
        setStage('points');
        setTimeout(() => setIsLoading(false), 300);
    }, [numPoints]);

    const handleCluster = useCallback(() => {
        if (points.length === 0) return;
        setIsLoading(true);
        setRoutes([]);
        setTimeout(() => {
            const newClusters = kmeans(points, numClusters);
            setClusters(newClusters);
            setStage('clustered');
            setIsLoading(false);
        }, 500); // Simulate processing time
    }, [points, numClusters]);

    const handleFindRoutes = useCallback(() => {
        if (clusters.length === 0) return;
        setIsLoading(true);
        setTimeout(() => {
            const newRoutes = clusters.map(cluster => {
                const tour = findNearestNeighborTour(cluster.points, DEPOT);
                return { points: tour, color: cluster.color };
            });
            setRoutes(newRoutes);
            setStage('routed');
            setIsLoading(false);
        }, 500); // Simulate processing time
    }, [clusters]);

    const totalDistance = useMemo(() => {
        return routes.reduce((total, route) => {
            let routeDist = 0;
            for (let i = 0; i < route.points.length - 1; i++) {
                const p1 = route.points[i];
                const p2 = route.points[i + 1];
                routeDist += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            }
            return total + routeDist;
        }, 0);
    }, [routes]);

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg p-4">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold text-cyan-400">Rota Inteligente: Sabor Express</h1>
                    <p className="text-gray-400">Otimização de Entregas com Algoritmos de IA</p>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 w-full flex-shrink-0">
                    <Controls
                        numPoints={numPoints}
                        setNumPoints={setNumPoints}
                        numClusters={numClusters}
                        setNumClusters={setNumClusters}
                        onGeneratePoints={handleGeneratePoints}
                        onCluster={handleCluster}
                        onFindRoutes={handleFindRoutes}
                        isLoading={isLoading}
                        stage={stage}
                    />
                     <InfoPanel
                        stage={stage}
                        numPoints={points.length}
                        clusters={clusters}
                        routes={routes}
                        totalDistance={totalDistance}
                    />
                </div>
                <div className="flex-grow bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-700 overflow-hidden">
                    <Map points={points} clusters={clusters} routes={routes} />
                </div>
            </main>
        </div>
    );
};

export default App;
