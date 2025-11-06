import { X, MousePointer, Plus, MoveHorizontal, Trash2, Save, BarChart3 } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">How to Use Mind Navigator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Getting Started</h3>
            <p className="text-slate-600 leading-relaxed">
              Mind Navigator helps you visualize complex decisions and their outcomes. Create nodes to represent
              decisions, options, or outcomes, and connect them to see the bigger picture.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Actions</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Add Node</h4>
                  <p className="text-sm text-slate-600">
                    Click the "+ Add Node" button to create a new decision point. Enter a title and description to define it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MoveHorizontal className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Connect Nodes</h4>
                  <p className="text-sm text-slate-600">
                    Click "Connect" on a node, then click another node to create a connection. This shows relationships between decisions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Move Nodes</h4>
                  <p className="text-sm text-slate-600">
                    Click and drag any node to reposition it on the canvas. Organize your decision map however makes sense to you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Delete Items</h4>
                  <p className="text-sm text-slate-600">
                    Click the trash icon on any node to delete it. Click a connection line and press Delete or Backspace to remove it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Save className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Save Your Work</h4>
                  <p className="text-sm text-slate-600">
                    Click "Save Map" to store your decision map. Give it a name and load it later from "Load Map".
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Analyze Decision</h4>
                  <p className="text-sm text-slate-600">
                    Click "Analyze" on any node to get AI-powered insights about that decision and its potential outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Node Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 mb-1">Decision</div>
                <p className="text-xs text-blue-700">A choice you need to make</p>
              </div>
              <div className="p-3 border-2 border-emerald-200 bg-emerald-50 rounded-lg">
                <div className="font-medium text-emerald-900 mb-1">Option</div>
                <p className="text-xs text-emerald-700">A possible path forward</p>
              </div>
              <div className="p-3 border-2 border-purple-200 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900 mb-1">Outcome</div>
                <p className="text-xs text-purple-700">A potential result</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Start with your main decision in the center, then branch out to options</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Use descriptive titles and details to make your map clear</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Color-code nodes by type to visualize decision flow</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-medium">•</span>
                <span>Save multiple maps to track different scenarios</span>
              </li>
            </ul>
          </section>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
