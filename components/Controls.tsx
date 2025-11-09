import React from 'react';

interface ControlsProps {
    numPoints: number;
    setNumPoints: (value: number) => void;
    numClusters: number;
    setNumClusters: (value: number) => void;
    onGeneratePoints: () => void;
    onCluster: () => void;
    onFindRoutes: () => void;
    isLoading: boolean;
    stage: 'initial' | 'points' | 'clustered' | 'routed';
}

const baseButtonClass = "w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
const primaryButtonClass = `${baseButtonClass} bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75`;
const secondaryButtonClass = `${baseButtonClass} bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75`;

const IconSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const Controls: React.FC<ControlsProps> = ({
    numPoints,
    setNumPoints,
    numClusters,
    setNumClusters,
    onGeneratePoints,
    onCluster,
    onFindRoutes,
    isLoading,
    stage,
}) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 space-y-6 border border-gray-700">
            <div>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Parâmetros da Simulação</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="numPoints" className="block text-sm font-medium text-gray-300 mb-1">
                            Pontos de Entrega: <span className="font-bold text-white">{numPoints}</span>
                        </label>
                        <input
                            id="numPoints"
                            type="range"
                            min="10"
                            max="200"
                            step="5"
                            value={numPoints}
                            onChange={(e) => setNumPoints(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="numClusters" className="block text-sm font-medium text-gray-300 mb-1">
                            Entregadores (Clusters): <span className="font-bold text-white">{numClusters}</span>
                        </label>
                        <input
                            id="numClusters"
                            type="range"
                            min="2"
                            max="8"
                            value={numClusters}
                            onChange={(e) => setNumClusters(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 space-y-3">
                 <h2 className="text-xl font-bold text-cyan-400 mb-2">Etapas de Otimização</h2>
                {/* Fix: Corrected spinner display logic to show only for the currently active step. */}
                <button onClick={onGeneratePoints} disabled={isLoading} className={primaryButtonClass}>
                    {isLoading && (stage === 'initial' || stage === 'points') ? <IconSpinner /> : '1. Gerar Pedidos'}
                </button>
                <button onClick={onCluster} disabled={isLoading || stage === 'initial'} className={secondaryButtonClass}>
                     {isLoading && stage === 'points' ? <IconSpinner /> : '2. Agrupar Entregas (K-Means)'}
                </button>
                <button onClick={onFindRoutes} disabled={isLoading || stage !== 'clustered'} className={secondaryButtonClass}>
                    {isLoading && stage === 'clustered' ? <IconSpinner /> : '3. Otimizar Rotas'}
                </button>
            </div>
        </div>
    );
};
