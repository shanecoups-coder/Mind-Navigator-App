import { X, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'pricing-table-id': string;
        'publishable-key': string;
        'customer-email'?: string;
        'client-reference-id'?: string;
      }, HTMLElement>;
    }
  }
}

export default function PremiumModal({ onClose }: PremiumModalProps) {
  const { user } = useAuth();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'stripe_checkout_completed') {
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <Crown className="w-12 h-12 text-white mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white mb-1">Go Premium</h2>
            <p className="text-amber-50">Unlock powerful decision-making tools</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <stripe-pricing-table
            pricing-table-id={import.meta.env.VITE_STRIPE_PRICING_TABLE_ID}
            publishable-key={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
            customer-email={user?.email || ''}
            client-reference-id={user?.id || ''}
          />
        </div>
      </div>
    </div>
  );
}
