import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { supabase, BudgetGoal } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BudgetTrackerProps {
  onClose: () => void;
}

export default function BudgetTracker({ onClose }: BudgetTrackerProps) {
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [contribution, setContribution] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budget_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error('Error loading goals:', err);
      setError('Failed to load goals');
    }
  };

  const handleCreateGoal = async () => {
    if (!user || !goalName.trim() || !targetAmount) {
      setError('Please enter goal name and target amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('budget_goals')
        .insert({
          user_id: user.id,
          goal_name: goalName,
          target_amount: parseFloat(targetAmount),
          current_saved: 0,
        });

      if (error) throw error;

      setGoalName('');
      setTargetAmount('');
      await loadGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContribution = async (goalId: string) => {
    if (!contribution) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      const newAmount = goal.current_saved + parseFloat(contribution);
      const { error } = await supabase
        .from('budget_goals')
        .update({
          current_saved: newAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) throw error;

      setContribution('');
      setSelectedGoal(null);
      await loadGoals();
    } catch (err) {
      console.error('Error adding contribution:', err);
      setError('Failed to add contribution');
    }
  };

  const calculateProgress = (goal: BudgetGoal) => {
    return Math.min((goal.current_saved / goal.target_amount) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Budget Goal Tracker</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Create New Goal</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="Goal name (e.g., Emergency Fund)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Target amount"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleCreateGoal}
                disabled={loading || !goalName.trim() || !targetAmount}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create Goal
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Goals</h3>
            {goals.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No goals yet. Create your first goal above!
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map(goal => {
                  const progress = calculateProgress(goal);
                  const isComplete = progress >= 100;

                  return (
                    <div
                      key={goal.id}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{goal.goal_name}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            ${goal.current_saved.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                          </p>
                        </div>
                        {isComplete && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            Complete!
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isComplete ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-1 text-right">
                          {progress.toFixed(1)}%
                        </p>
                      </div>

                      {!isComplete && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={selectedGoal === goal.id ? contribution : ''}
                            onChange={(e) => {
                              setSelectedGoal(goal.id);
                              setContribution(e.target.value);
                            }}
                            placeholder="Add contribution"
                            min="0"
                            step="0.01"
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            onClick={() => handleAddContribution(goal.id)}
                            disabled={!contribution || selectedGoal !== goal.id}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
