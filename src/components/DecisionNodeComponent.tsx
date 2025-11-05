import { useState } from 'react';
import { DecisionNode, Connection } from '../lib/supabase';
import { Trash2, Link, X } from 'lucide-react';

interface DecisionNodeComponentProps {
  node: DecisionNode;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<DecisionNode>) => void;
  onDelete: (id: string) => void;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  onStartConnection: (id: string) => void;
  onCompleteConnection: (id: string) => void;
  onDoubleClick: (node: DecisionNode) => void;
  connections: Connection[];
  onDeleteConnection: (from: string, to: string) => void;
}

export default function DecisionNodeComponent({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onUpdate,
  onDelete,
  onMouseDown,
  onStartConnection,
  onCompleteConnection,
  onDoubleClick,
  connections,
  onDeleteConnection,
}: DecisionNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (text: string) => {
    onUpdate(node.id, { text });
  };

  const handleWeightChange = (weight: number) => {
    onUpdate(node.id, { weight });
  };

  const bgColor = node.type === 'decision' ? 'bg-green-100 border-green-500' : 'bg-slate-100 border-slate-400';
  const selectedRing = isSelected ? 'ring-4 ring-blue-400' : '';
  const connectingRing = isConnecting ? 'ring-4 ring-amber-400' : '';

  const relatedConnections = connections.filter(c => c.from === node.id || c.to === node.id);

  return (
    <div
      className={`absolute w-[200px] bg-white border-2 rounded-xl shadow-lg ${bgColor} ${selectedRing} ${connectingRing} transition-all cursor-move z-10`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(node.id, e);
        onSelect(node.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(node);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isConnecting) {
          onCompleteConnection(node.id);
        }
      }}
    >
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold uppercase text-slate-600">
            {node.type}
          </span>
          <div className="flex gap-1">
            {node.type === 'decision' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartConnection(node.id);
                }}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
                title="Connect to factor"
              >
                <Link className="w-3 h-3 text-slate-600" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Delete node"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <input
            type="text"
            value={node.text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false);
            }}
            autoFocus
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            className="text-sm font-medium text-slate-900 mb-2 cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {node.text}
          </p>
        )}

        {node.type === 'factor' && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600">Weight</span>
              <span className="text-xs font-bold text-slate-900">{node.weight}</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              value={node.weight}
              onChange={(e) => handleWeightChange(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>-10</span>
              <span>0</span>
              <span>+10</span>
            </div>
          </div>
        )}

        {relatedConnections.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Connections</div>
            <div className="space-y-1">
              {relatedConnections.map((conn, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConnection(conn.from, conn.to);
                  }}
                  className="flex items-center justify-between w-full px-2 py-1 text-xs bg-slate-50 hover:bg-red-50 rounded group transition-colors"
                >
                  <span className="text-slate-700">
                    {conn.from === node.id ? 'To factor' : 'From decision'}
                  </span>
                  <X className="w-3 h-3 text-slate-400 group-hover:text-red-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
