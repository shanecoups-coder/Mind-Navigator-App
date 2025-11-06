import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Header from './components/Header';
import DecisionCanvas from './components/DecisionCanvas';
import PremiumModal from './components/PremiumModal';
import HelpModal from './components/HelpModal';
import { BoltDatabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (user) {
      loadPremiumStatus();
      checkFirstVisit();
    }
  }, [user]);

  const checkFirstVisit = () => {
    const hasVisited = localStorage.getItem('hasVisitedMindNavigator');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowHelpModal(true);
      localStorage.setItem('hasVisitedMindNavigator', 'true');
    }
  };

  const loadPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data } = await Bolt Database
        .from('user_subscriptions')
        .select('is_premium')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setIsPremium(data.is_premium);
      } else {
        await Bolt Database
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            is_premium: false,
          });
      }
    } catch (err) {
      console.error('Error loading premium status:', err);
    }
  };

  const handleUpgradePremium = async () => {
    if (!user) return;

    try {
      const { data: existing } = await Bolt Database
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await Bolt Database
          .from('user_subscriptions')
          .update({
            is_premium: true,
            premium_since: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        await Bolt Database
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            is_premium: true,
            premium_since: new Date().toISOString(),
          });
      }

      setIsPremium(true);
      setShowPremiumModal(false);
    } catch (err) {
      console.error('Error upgrading to premium:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        isPremium={isPremium}
        onUpgradePremium={() => setShowPremiumModal(true)}
        onShowHelp={() => setShowHelpModal(true)}
      />
      <DecisionCanvas isPremium={isPremium} onUpgradePremium={() => setShowPremiumModal(true)} />
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handleUpgradePremium}
        />
      )}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
