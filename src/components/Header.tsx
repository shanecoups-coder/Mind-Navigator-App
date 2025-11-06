import { Crown, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  isPremium: boolean;
  onUpgradePremium: () => void;
  onShowHelp: () => void;
}

export default function Header({ isPremium, onUpgradePremium, onShowHelp }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            {user?.email}
          </div>
          {isPremium && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Premium</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onShowHelp}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
          {!isPremium && (
            <button
              onClick={onUpgradePremium}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Crown className="w-4 h-4" />
              Go Premium
            </button>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
