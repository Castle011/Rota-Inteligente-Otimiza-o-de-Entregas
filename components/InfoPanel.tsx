import React from 'react';
import { Cluster, Route, Point } from '../types';

interface InfoPanelProps {
    stage: 'initial' | 'points' | 'clustered' | 'routed';
    numPoints: number;
    clusters: Cluster[];
    routes: Route[];
    totalDistance: number;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string | number; unit?: string, icon: React.ReactNode }> = ({ title, value, unit, icon }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-4">
        <div className="text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">
                {value} <span className="text-lg font-normal text-gray-300">{unit}</span>
            </p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[], title: string, unit: string }> = ({ data, title, unit }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const chartHeight = 150;
    const barWidth = 30;
    const barMargin = 15;
    const chartWidth = data.length * (barWidth + barMargin);

    return (
        <div className="bg-gray-700/50 p-4 rounded-lg mt-4">
            <h3 className="font-bold text-gray-300 mb-4">{title}</h3>
            {data.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} style={{minWidth: chartWidth}}>
                        {data.map((item, index) => {
                            const barHeight = (item.value / maxValue) * chartHeight;
                            return (
                                <g key={index} transform={`translate(${index * (barWidth + barMargin)}, 0)`}>
                                    <title>{`${item.label}: ${item.value.toFixed(0)} ${unit}`}</title>
                                    <rect
                                        y={chartHeight - barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={item.color}
                                        rx="3"
                                        className="transition-all duration-300"
                                    />
                                    <text x={barWidth / 2} y={chartHeight + 15} textAnchor="middle" fill="#9CA3AF" fontSize="12">
                                        {item.label}
                                    </text>
                                    <text x={barWidth / 2} y={chartHeight - barHeight - 5} textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                                        {item.value.toFixed(0)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            ) : <p className="text-gray-500 text-sm text-center">Dados indisponíveis.</p>}
        </div>
    );
};

const Icons = {
    Truck: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Package: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Route: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ stage, numPoints, clusters, routes, totalDistance }) => {

    const distance = (p1: Point, p2: Point): number => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const deliveriesData = clusters.map((cluster, i) => ({
        label: `Rota ${i + 1}`,
        value: cluster.points.length,
        color: cluster.color,
    }));

    const distanceData = routes.map((route, i) => {
        let routeDist = 0;
        for (let j = 0; j < route.points.length - 1; j++) {
            routeDist += distance(route.points[j], route.points[j+1]);
        }
        return {
            label: `Rota ${i + 1}`,
            value: routeDist,
            color: route.color,
        };
    });

    const getStageDescription = () => {
        switch (stage) {
            case 'initial':
                return "Ajuste os parâmetros e clique em 'Gerar Pedidos' para iniciar a simulação.";
            case 'points':
                return `${numPoints} pedidos foram gerados. Agora, agrupe-os por entregador.`;
            case 'clustered':
                return `Pedidos agrupados em ${clusters.length} zonas. Otimize a rota para cada entregador.`;
            case 'routed':
                return `Rotas otimizadas! Veja os resultados no dashboard abaixo.`;
            default:
                return '';
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 mt-6 border border-gray-700 space-y-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Dashboard de Otimização</h2>
            <div className="bg-gray-900 p-4 rounded-md">
                <p className="text-gray-300 text-center text-sm">{getStageDescription()}</p>
            </div>
            
            {(stage === 'routed' || stage === 'clustered' || stage === 'points') && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <StatCard title="Distância Total" value={stage === 'routed' ? totalDistance.toFixed(0) : '-'} unit="un." icon={Icons.Route} />
                       <StatCard title="Entregadores" value={clusters.length > 0 ? clusters.length : '-'} icon={Icons.Truck} />
                       <StatCard title="Entregas" value={numPoints > 0 ? numPoints : '-'} icon={Icons.Package} />
                    </div>
                     {(stage === 'clustered' || stage === 'routed') && <BarChart data={deliveriesData} title="Entregas por Rota" unit="pedidos" />}
                    {stage === 'routed' && <BarChart data={distanceData} title="Distância por Rota" unit="un." />}
                </>
            )}
        </div>
    );
};