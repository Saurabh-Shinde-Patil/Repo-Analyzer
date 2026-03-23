import { useLocation, useNavigate, Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentPlan, setIsLoading } = usePlan();
  const [processing, setProcessing] = useState(false);

  const plan = location.state?.plan;

  if (!plan) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No plan selected</h2>
        <p className="text-white/50 mb-8">Please go back and select a plan to upgrade.</p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0f0f1a] font-semibold rounded-full hover:bg-white/90 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Pricing
        </Link>
      </div>
    );
  }

  const handleProceedToPayment = async () => {
    setProcessing(true);

    try {
      // Call backend API to create subscription
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/subscribe`, {
        userId: 'user_' + Date.now(), // Placeholder userId
        planId: plan.id,
        planName: plan.name,
        price: typeof plan.price === 'string' ? parseInt(plan.price.replace(/,/g, '')) : plan.price,
        currency: plan.currency,
      });

      setCurrentPlan(plan.id);
      setIsLoading(false);
      navigate('/success', { state: { plan } });
    } catch (error) {
      console.error('Subscription error:', error);
      // Still navigate to success for demo purposes
      setCurrentPlan(plan.id);
      setIsLoading(false);
      navigate('/success', { state: { plan } });
    } finally {
      setProcessing(false);
    }
  };

  const displayPrice = typeof plan.price === 'string' ? plan.price : plan.price.toLocaleString();

  return (
    <div className="w-full max-w-2xl mx-auto py-10 sm:py-20 px-4">
      {/* Back link */}
      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to plans
      </Link>

      {/* Checkout card */}
      <div className="bg-[#1a1a2e]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#6c5ce7]/20 rounded-xl">
            <CreditCard size={24} className="text-[#6c5ce7]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Checkout</h2>
            <p className="text-white/40 text-sm">Complete your subscription</p>
          </div>
        </div>

        {/* Plan summary */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{plan.name} Plan</h3>
            {plan.isRecommended && (
              <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-[#6c5ce7] text-white rounded-full">
                Recommended
              </span>
            )}
          </div>
          <p className="text-white/50 text-sm mb-4">{plan.tagline}</p>
          <div className="w-full h-px bg-white/[0.06] my-4" />
          <div className="flex flex-col gap-2">
            {plan.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                <Check size={14} className="text-emerald-400" />
                <span>{feature.text}</span>
              </div>
            ))}
            {plan.features.length > 4 && (
              <p className="text-white/30 text-xs mt-1">+ {plan.features.length - 4} more features</p>
            )}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 mb-8">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Price Breakdown</h4>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-white/60">{plan.name} Plan (Monthly)</span>
            <span className="text-white font-semibold">{plan.currencySymbol}{displayPrice}</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-white/60">Platform fee</span>
            <span className="text-emerald-400 font-semibold">Free</span>
          </div>

          {plan.taxNote && (
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-white/60">Tax</span>
              <span className="text-white/40 text-xs">{plan.taxNote}</span>
            </div>
          )}

          <div className="w-full h-px bg-white/[0.08] my-4" />

          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-white font-bold text-2xl">{plan.currencySymbol}{displayPrice}<span className="text-white/40 text-sm font-normal">/mo</span></span>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-white/30 text-xs mb-6">
          <Shield size={14} />
          <span>Payments are secure and encrypted. Cancel anytime.</span>
        </div>

        {/* CTA */}
        <button
          onClick={handleProceedToPayment}
          disabled={processing}
          className={`
            w-full py-4 rounded-full text-base font-bold transition-all duration-300
            bg-gradient-to-r from-[#6c5ce7] to-[#a855f7] text-white
            shadow-[0_0_30px_rgba(108,92,231,0.3)]
            hover:shadow-[0_0_40px_rgba(108,92,231,0.5)] hover:-translate-y-0.5
            active:translate-y-0 active:scale-[0.99]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
            flex items-center justify-center gap-2
          `}
        >
          {processing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Proceed to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
}
