import { DecisionNode } from '../lib/supabase';
import { X, Lock, TrendingUp, TrendingDown } from 'lucide-react';

interface AnalysisModalProps {
  node: DecisionNode;
  score: number;
  factors: DecisionNode[];
  isPremium: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function AnalysisModal({
  node,
  score,
  factors,
  isPremium,
  onClose,
  onUpgrade,
}: AnalysisModalProps) {
  const positiveFactors = factors.filter(f => (f.weight || 0) > 0);
  const negativeFactors = factors.filter(f => (f.weight || 0) < 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Decision Analysis</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{node.text}</h3>
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Weighted Score</div>
              <div className={`text-4xl font-bold ${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {score > 0 ? '+' : ''}{score}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {factors.length} factor{factors.length !== 1 ? 's' : ''} connected
              </div>
            </div>
          </div>

          {!isPremium ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 text-center">
              <Lock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Unlock Advanced Analysis
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Get detailed factor breakdowns with positive and negative factor lists to make better decisions.
              </p>
              <button
                onClick={onUpgrade}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
              >
                Go Premium
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {positiveFactors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-semibold text-slate-900">
                      Positive Factors ({positiveFactors.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {positiveFactors.map(factor => (
                      <div
                        key={factor.id}
                        className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-900">{factor.text}</span>
                        <span className="text-sm font-bold text-green-600">+{factor.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {negativeFactors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <h4 className="text-lg font-semibold text-slate-900">
                      Negative Factors ({negativeFactors.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {negativeFactors.map(factor => (
                      <div
                        key={factor.id}
                        className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-900">{factor.text}</span>
                        <span className="text-sm font-bold text-red-600">{factor.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {factors.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No factors connected to this decision yet.
                </div>
              )}
            </div>
          )}
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
