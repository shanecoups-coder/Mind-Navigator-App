import { useState, useRef, useEffect } from 'react';
import { DecisionNode, Connection } from '../lib/supabase';
import { Plus, Save, FolderOpen, TrendingUp } from 'lucide-react';
import DecisionNodeComponent from './DecisionNodeComponent';
import AnalysisModal from './AnalysisModal';
import SaveLoadModal from './SaveLoadModal';
import BudgetTracker from './BudgetTracker';
import PremiumModal from './PremiumModal';

interface DecisionCanvasProps {
  isPremium: boolean;
  onUpgradePremium: () => void;
}

export default function DecisionCanvas({ isPremium, onUpgradePremium }: DecisionCanvasProps) {
  const [nodes, setNodes] = useState<DecisionNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [analysisNode, setAnalysisNode] = useState<DecisionNode | null>(null);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [currentMapName, setCurrentMapName] = useState<string>('Untitled Map');
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const addNode = (type: 'decision' | 'factor') => {
    const newNode: DecisionNode = {
      id: `${type}-${Date.now()}`,
      type,
      text: type === 'decision' ? 'New Decision' : 'New Factor',
      weight: type === 'factor' ? 0 : undefined,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: string, updates: Partial<DecisionNode>) => {
    setNodes(nodes.map(node => node.id === id ? { ...node, ...updates } : node));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const startConnection = (nodeId: string) => {
    setConnectingFrom(nodeId);
  };

  const completeConnection = (toNodeId: string) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      const fromNode = nodes.find(n => n.id === connectingFrom);
      const toNode = nodes.find(n => n.id === toNodeId);

      if (fromNode?.type === 'decision' && toNode?.type === 'factor') {
        const exists = connections.some(c => c.from === connectingFrom && c.to === toNodeId);
        if (!exists) {
          setConnections([...connections, { from: connectingFrom, to: toNodeId }]);
        }
      }
    }
    setConnectingFrom(null);
  };

  const deleteConnection = (from: string, to: string) => {
    setConnections(connections.filter(c => !(c.from === from && c.to === to)));
  };

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggedNode(nodeId);
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      const node = nodes.find(n => n.id === draggedNode);
      if (node) {
        updateNode(draggedNode, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleDoubleClick = (node: DecisionNode) => {
    if (node.type === 'decision') {
      setAnalysisNode(node);
    }
  };

  const calculateScore = (decisionId: string): number => {
    const connectedFactors = connections
      .filter(c => c.from === decisionId)
      .map(c => nodes.find(n => n.id === c.to))
      .filter(n => n?.type === 'factor');

    return connectedFactors.reduce((sum, factor) => sum + (factor?.weight || 0), 0);
  };

  const getConnectedFactors = (decisionId: string) => {
    return connections
      .filter(c => c.from === decisionId)
      .map(c => nodes.find(n => n.id === c.to))
      .filter((n): n is DecisionNode => n !== undefined && n.type === 'factor');
  };

  const handleExport = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    const exportData = {
      name: currentMapName,
      nodes,
      connections,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMapName.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mind Navigator</h1>
          <p className="text-sm text-slate-600">{currentMapName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addNode('decision')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Decision
          </button>
          <button
            onClick={() => addNode('factor')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Factor
          </button>
          <button
            onClick={() => setShowSaveLoad(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save/Load
          </button>
          <button
            onClick={() => setShowBudget(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Budget
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={idx}
                x1={fromNode.x + 100}
                y1={fromNode.y + 40}
                x2={toNode.x + 100}
                y2={toNode.y + 40}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <DecisionNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isConnecting={connectingFrom === node.id}
            onSelect={setSelectedNode}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onMouseDown={handleNodeMouseDown}
            onStartConnection={startConnection}
            onCompleteConnection={completeConnection}
            onDoubleClick={handleDoubleClick}
            connections={connections}
            onDeleteConnection={deleteConnection}
          />
        ))}
      </div>

      {analysisNode && (
        <AnalysisModal
          node={analysisNode}
          score={calculateScore(analysisNode.id)}
          factors={getConnectedFactors(analysisNode.id)}
          isPremium={isPremium}
          onClose={() => setAnalysisNode(null)}
          onUpgrade={() => {
            setAnalysisNode(null);
            setShowPremiumModal(true);
          }}
        />
      )}

      {showSaveLoad && (
        <SaveLoadModal
          nodes={nodes}
          connections={connections}
          currentMapId={currentMapId}
          currentMapName={currentMapName}
          onClose={() => setShowSaveLoad(false)}
          onLoad={(map) => {
            setNodes(map.nodes);
            setConnections(map.connections);
            setCurrentMapId(map.id);
            setCurrentMapName(map.name);
            setShowSaveLoad(false);
          }}
          onSaveSuccess={(mapId, mapName) => {
            setCurrentMapId(mapId);
            setCurrentMapName(mapName);
          }}
        />
      )}

      {showBudget && (
        <BudgetTracker onClose={() => setShowBudget(false)} />
      )}

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={onUpgradePremium}
        />
      )}
    </div>
  );
}
