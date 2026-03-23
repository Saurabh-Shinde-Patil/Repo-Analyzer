import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const plan = location.state?.plan;

  return (
    <div className="w-full max-w-xl mx-auto py-20 sm:py-32 px-4 text-center">
      {/* Animated success icon */}
      <div className="relative inline-flex mb-8">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.4)]">
          <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        You're all set!
      </h1>

      {/* Subheading */}
      <p className="text-white/50 text-lg mb-2">
        Your subscription to{' '}
        <span className="text-white font-semibold">{plan?.name || 'the selected plan'}</span>{' '}
        is now active.
      </p>

      {plan && (
        <p className="text-white/30 text-sm mb-10">
          {plan.currencySymbol}{typeof plan.price === 'string' ? plan.price : plan.price.toLocaleString()} {plan.currency}/month
        </p>
      )}

      {/* Features unlocked */}
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 mb-10 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-[#6c5ce7]" />
          <span className="text-white/70 text-sm font-semibold">Features unlocked</span>
        </div>
        {plan?.features?.slice(0, 5).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2 text-sm text-white/60">
            <CheckCircle size={14} className="text-emerald-400 shrink-0" />
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0f0f1a] font-bold rounded-full hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </Link>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
        >
          View all plans
        </Link>
      </div>
    </div>
  );
}
