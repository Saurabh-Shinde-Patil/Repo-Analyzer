import { Check, Sparkles, Brain, Image, MessageSquare, Zap, FolderOpen, Settings, Shield, Globe, Video, Users, Infinity, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';

// Icon map for feature icons
const iconMap = {
  'sparkles': Sparkles,
  'brain': Brain,
  'image': Image,
  'message': MessageSquare,
  'zap': Zap,
  'folder': FolderOpen,
  'settings': Settings,
  'shield': Shield,
  'globe': Globe,
  'video': Video,
  'users': Users,
  'infinity': Infinity,
  'scale': Scale,
  'check': Check,
};

export default function PricingCard({ plan }) {
  const navigate = useNavigate();
  const { currentPlan, setIsLoading } = usePlan();
  const isCurrent = currentPlan === plan.id;

  const handleUpgrade = () => {
    setIsLoading(true);
    navigate('/checkout', { state: { plan } });
  };

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-500 h-full
        ${plan.isRecommended
          ? 'bg-gradient-to-b from-[#1a1a3e] to-[#0f0f2e] border-2 border-[#6c5ce7]/60 shadow-[0_0_40px_rgba(108,92,231,0.15)]'
          : 'bg-[#1a1a2e]/80 border border-white/[0.08] hover:border-white/[0.15]'
        }
        hover:translate-y-[-4px] hover:shadow-2xl
      `}
    >
      {/* Recommended badge */}
      {plan.isRecommended && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-[#6c5ce7] text-white rounded-full shadow-lg">
            Recommended
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{plan.name}</h3>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-white/70 text-lg">{plan.currencySymbol}</span>
        <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{plan.price}</span>
        <div className="flex flex-col ml-2">
          <span className="text-white/50 text-xs font-medium">{plan.currency} /</span>
          <span className="text-white/50 text-xs font-medium">month{plan.taxNote ? ` ${plan.taxNote}` : ''}</span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-white/60 text-sm mt-2 mb-6">{plan.tagline}</p>

      {/* CTA Button */}
      {isCurrent ? (
        <button
          disabled
          className="w-full py-3 px-6 rounded-full text-sm font-semibold bg-white/[0.06] text-white/40 border border-white/[0.08] cursor-not-allowed mb-8"
        >
          Your current plan
        </button>
      ) : (
        <button
          onClick={handleUpgrade}
          className={`
            w-full py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300
            ${plan.isRecommended
              ? 'bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)]'
              : 'bg-white text-[#0f0f1a] hover:bg-white/90 shadow-md hover:shadow-lg'
            }
            hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
          `}
        >
          Upgrade to {plan.name}
        </button>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.08] my-6" />

      {/* Features */}
      <ul className="flex flex-col gap-3.5 flex-1">
        {plan.features.map((feature, idx) => {
          const Icon = iconMap[feature.icon] || Sparkles;
          return (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <Icon size={18} className="text-white/40 shrink-0 mt-0.5" />
              <span className="text-white/80 leading-relaxed">{feature.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
