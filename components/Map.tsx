import React from 'react';
import { Point, Cluster, Route } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, DEPOT } from '../constants';

interface MapProps {
    points: Point[];
    clusters: Cluster[];
    routes: Route[];
}

const DepotIcon: React.FC<{ point: Point }> = ({ point }) => (
    <g transform={`translate(${point.x}, ${point.y})`}>
        <circle cx="0" cy="0" r="12" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
        <path d="M-5 -5 L 0 -10 L 5 -5 L 5 5 L -5 5 Z" fill="#0F172A" transform="translate(0, -1)" />
        <rect x="-3" y="-1" width="6" height="6" fill="#0F172A" />
    </g>
);

const DeliveryTruck: React.FC<{ route: Route }> = ({ route }) => {
    // Convert points to SVG path data: M x1,y1 L x2,y2 L x3,y3...
    const pathData = "M " + route.points.map(p => `${p.x},${p.y}`).join(' L ');
    
    let totalDistance = 0;
    for (let i = 0; i < route.points.length - 1; i++) {
        const p1 = route.points[i];
        const p2 = route.points[i + 1];
        totalDistance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    // Animation duration is proportional to route distance
    const duration = `${Math.max(8, totalDistance / 40)}s`;

    return (
        <circle r="5" fill={route.color} stroke="#FFFFFF" strokeWidth="1.5">
            {/* Fix: Corrected typo in repeatCount from "indefefinite" to "indefinite". */}
            <animateMotion
                dur={duration}
                repeatCount="indefinite"
                path={pathData}
                begin="0s"
            />
        </circle>
    );
};


export const Map: React.FC<MapProps> = ({ points, clusters, routes }) => {
    const pointsToRender = clusters.length > 0
        ? clusters.flatMap(c => c.points.map(p => ({ ...p, color: c.color })))
        : points.map(p => ({ ...p, color: '#9CA3AF' })); // Default gray

    return (
        <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
        >
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#1F2937" rx="8" />
            
            {/* Grid */}
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

            {/* Routes */}
            {routes.map((route, index) => (
                <polyline
                    key={index}
                    points={route.points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-60"
                />
            ))}

             {/* Delivery Trucks Animation */}
             {routes.map((route, index) => (
                <DeliveryTruck key={`truck-${index}`} route={route} />
            ))}
            
            {/* Centroids */}
             {clusters.map((cluster, index) => (
                <g key={index}>
                    <rect 
                        x={cluster.centroid.x - 5} 
                        y={cluster.centroid.y - 5}
                        width="10" height="10" 
                        fill={cluster.color}
                        stroke="#1F2937"
                        strokeWidth="2"
                        transform={`rotate(45, ${cluster.centroid.x}, ${cluster.centroid.y})`}
                    />
                </g>
            ))}

            {/* Delivery Points */}
            {pointsToRender.map(point => (
                <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    fill={point.color}
                    stroke="#111827"
                    strokeWidth="1.5"
                    className="transition-all duration-500"
                />
            ))}

            {/* Point sequence numbers */}
            {routes.map(route =>
                route.points.slice(1, -1).map((point, index) => (
                    <g key={`${point.id}-label`} transform={`translate(${point.x + 8}, ${point.y - 8})`}>
                        <rect x="-6" y="-11" width={((index + 1) > 9 ? 20 : 14)} height="14" fill="rgba(15, 23, 42, 0.8)" rx="3" />
                        <text
                            fontSize="10px"
                            fontWeight="bold"
                            fill="#FFFFFF"
                            textAnchor="middle"
                        >
                            {index + 1}
                        </text>
                    </g>
                ))
            )}

            <DepotIcon point={DEPOT} />
        </svg>
    );
};