import { useState, useEffect } from 'react';
import { X, Save, Loader2, Trash2 } from 'lucide-react';
import { supabase, DecisionNode, Connection, DecisionMap } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SaveLoadModalProps {
  nodes: DecisionNode[];
  connections: Connection[];
  currentMapId: string | null;
  currentMapName: string;
  onClose: () => void;
  onLoad: (map: DecisionMap) => void;
  onSaveSuccess: (mapId: string, mapName: string) => void;
}

export default function SaveLoadModal({
  nodes,
  connections,
  currentMapId,
  currentMapName,
  onClose,
  onLoad,
  onSaveSuccess,
}: SaveLoadModalProps) {
  const [mapName, setMapName] = useState(currentMapName);
  const [savedMaps, setSavedMaps] = useState<DecisionMap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadSavedMaps();
  }, []);

  const loadSavedMaps = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('decision_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedMaps(data || []);
    } catch (err) {
      console.error('Error loading maps:', err);
      setError('Failed to load saved maps');
    }
  };

  const handleSave = async () => {
    if (!user || !mapName.trim()) {
      setError('Please enter a map name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (currentMapId) {
        const { error } = await supabase
          .from('decision_maps')
          .update({
            name: mapName,
            nodes,
            connections,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentMapId);

        if (error) throw error;
        onSaveSuccess(currentMapId, mapName);
      } else {
        const { data, error } = await supabase
          .from('decision_maps')
          .insert({
            user_id: user.id,
            name: mapName,
            nodes,
            connections,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          onSaveSuccess(data.id, mapName);
        }
      }

      await loadSavedMaps();
      setError('');
    } catch (err) {
      console.error('Error saving map:', err);
      setError('Failed to save map');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mapId: string) => {
    if (!confirm('Are you sure you want to delete this map?')) return;

    try {
      const { error } = await supabase
        .from('decision_maps')
        .delete()
        .eq('id', mapId);

      if (error) throw error;
      await loadSavedMaps();
    } catch (err) {
      console.error('Error deleting map:', err);
      setError('Failed to delete map');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Save & Load Maps</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Save Current Map</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Enter map name..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={loading || !mapName.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {currentMapId ? 'Update' : 'Save'}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Saved Maps</h3>
            {savedMaps.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No saved maps yet. Save your first map above!
              </div>
            ) : (
              <div className="space-y-2">
                {savedMaps.map(map => (
                  <div
                    key={map.id}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{map.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {map.nodes.length} nodes, {map.connections.length} connections
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Last updated: {new Date(map.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onLoad(map)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(map.id)}
                          className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
