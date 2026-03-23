import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check, Zap, Crown, Building2, Sparkles, ArrowRight,
  GitBranch, MessageSquare, Shield, Code2, Brain, Users, Infinity, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Get started for nothing',
    price: { monthly: 0, annual: 0 },
    currency: '$',
    badge: null,
    icon: Zap,
    iconColor: '#67E8F9',
    features: [
      { icon: GitBranch,   text: '5 repository analyses / day' },
      { icon: Code2,       text: 'Code Explorer (file viewer)' },
      { icon: Brain,       text: 'Groq AI only (Llama 3)' },
      { icon: MessageSquare, text: '20 AI chat messages / day' },
      { icon: Check,       text: 'Tech stack & summary' },
      { icon: Check,       text: 'Folder structure view' },
    ],
    cta: 'Start Free',
    ctaStyle: 'outline',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For developers & students',
    price: { monthly: 9, annual: 7 },
    currency: '$',
    badge: null,
    icon: Sparkles,
    iconColor: '#A5B4FC',
    features: [
      { icon: GitBranch,   text: '50 analyses / day' },
      { icon: Brain,       text: 'All 4 AI providers' },
      { icon: MessageSquare, text: '200 chat messages / day' },
      { icon: Shield,      text: 'Security & bug scanner' },
      { icon: Code2,       text: 'API endpoint map' },
      { icon: Zap,         text: 'Priority Groq inference' },
      { icon: Check,       text: 'Env vars documentation' },
    ],
    cta: 'Start Starter',
    ctaStyle: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For professional engineers',
    price: { monthly: 29, annual: 22 },
    currency: '$',
    badge: 'Most Popular',
    icon: Crown,
    iconColor: '#FCD34D',
    features: [
      { icon: Infinity,    text: 'Unlimited analyses' },
      { icon: Brain,       text: 'All 4 AI providers + priority' },
      { icon: Infinity,    text: 'Unlimited AI chat' },
      { icon: Shield,      text: 'Advanced security scanning' },
      { icon: Users,       text: '5 team members' },
      { icon: Lock,        text: 'API access (REST)' },
      { icon: Brain,       text: 'Persistent chat memory across sessions' },
      { icon: Check,       text: 'Priority email support' },
    ],
    cta: 'Upgrade to Pro',
    ctaStyle: 'primary',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For engineering teams',
    price: { monthly: 79, annual: 59 },
    currency: '$',
    badge: null,
    icon: Building2,
    iconColor: '#6EE7B7',
    features: [
      { icon: Infinity,    text: 'Everything in Pro' },
      { icon: Users,       text: 'Up to 20 team members' },
      { icon: Shield,      text: 'SSO & advanced security' },
      { icon: Brain,       text: 'Shared AI workspaces' },
      { icon: Lock,        text: 'Audit logs & access control' },
      { icon: Zap,         text: 'Custom AI model support' },
      { icon: Check,       text: 'Dedicated support channel' },
      { icon: Check,       text: '99.9% SLA guarantee' },
    ],
    cta: 'Upgrade to Team',
    ctaStyle: 'outline',
  },
];

const FAQS = [
  { q: 'Can I change my plan anytime?', a: 'Yes — upgrade, downgrade or cancel at any time. Billing is prorated.' },
  { q: 'What counts as one analysis?', a: 'One full repository analysis (all 9 insight categories: summary, architecture, security, API map, etc.).' },
  { q: 'Does it work with private repositories?', a: 'Yes on Starter and above. Just connect your GitHub token in settings.' },
  { q: 'Which AI is fastest?', a: 'Groq (Llama 3) is consistently the fastest due to Groq\'s hardware-accelerated inference.' },
  { q: 'Is my code sent to the AI?', a: 'Only file paths and selective code snippets (first ~300 lines of entry files) are sent for analysis. We never store your source code.' },
];

function PlanCard({ plan, billing, index }) {
  const navigate = useNavigate();
  const isPopular = plan.badge === 'Most Popular';
  const price = billing === 'annual' ? plan.price.annual : plan.price.monthly;
  const Icon = plan.icon;

  const handleCta = () => {
    if (plan.id === 'free') {
      navigate('/');
    } else {
      navigate('/checkout', { state: { plan: { ...plan, price, currency: plan.currency } } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="relative flex flex-col rounded-2xl p-6 h-full"
      style={{
        background: isPopular
          ? 'linear-gradient(145deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
          : 'var(--card-bg)',
        border: isPopular ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)',
        boxShadow: isPopular ? '0 0 40px rgba(99,102,241,0.15)' : 'none',
      }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 16px rgba(99,102,241,0.5)' }}
        >
          ✦ Most Popular
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${plan.iconColor}1A` }}
          >
            <Icon size={20} style={{ color: plan.iconColor }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{plan.name}</h3>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>{plan.tagline}</p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>{plan.currency}</span>
        <span className="text-4xl font-black leading-none" style={{ color: 'var(--text)' }}>
          {price}
        </span>
        {price > 0 && (
          <span className="text-sm pb-0.5" style={{ color: 'var(--text3)' }}>/mo</span>
        )}
      </div>
      {billing === 'annual' && price > 0 && (
        <p className="text-xs mb-5" style={{ color: '#6EE7B7' }}>
          Billed annually · Save {Math.round((1 - plan.price.annual / plan.price.monthly) * 100)}%
        </p>
      )}
      {(billing === 'monthly' || price === 0) && <div className="mb-5" />}

      {/* CTA */}
      <button
        onClick={handleCta}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 mb-6 ${
          plan.ctaStyle === 'primary' ? 'primary-btn justify-center !rounded-xl !w-full' : ''
        }`}
        style={plan.ctaStyle !== 'primary' ? {
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text2)',
        } : {}}
        onMouseEnter={plan.ctaStyle !== 'primary' ? (e) => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
          e.currentTarget.style.color = '#A5B4FC';
        } : undefined}
        onMouseLeave={plan.ctaStyle !== 'primary' ? (e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text2)';
        } : undefined}
      >
        {plan.cta} <ArrowRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
      </button>

      {/* Divider */}
      <div className="w-full h-px mb-5" style={{ background: 'var(--border)' }} />

      {/* Features */}
      <ul className="flex flex-col gap-3 flex-1">
        {plan.features.map(({ icon: FIcon, text }, j) => (
          <li key={j} className="flex items-start gap-3 text-sm">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isPopular ? 'rgba(99,102,241,0.15)' : 'var(--surface2)' }}
            >
              <Check size={11} style={{ color: isPopular ? '#A5B4FC' : 'var(--text3)' }} />
            </div>
            <span style={{ color: 'var(--text2)' }}>{text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="badge badge-indigo mb-4 mx-auto">
          <Crown size={11} />
          Simple, transparent pricing
        </div>
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tighter mb-4"
          style={{ color: 'var(--text)' }}
        >
          Upgrade your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #818CF8, #C084FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AgniX
          </span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--text3)' }}>
          Start free. Scale as your team grows. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div
          className="inline-flex items-center p-1 rounded-full"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          {[
            { key: 'monthly', label: 'Monthly' },
            { key: 'annual',  label: 'Annual  · 25% off' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setBilling(key)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: billing === key ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                color: billing === key ? 'white' : 'var(--text3)',
                boxShadow: billing === key ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} index={i} />
        ))}
      </div>

      {/* Comparison footnote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-16 py-8 rounded-2xl"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: 'var(--text2)' }}>
          All plans include: Code Explorer · Architecture Diagrams · Dependency Map · API Map · Env Vars
        </p>
        <p className="text-xs" style={{ color: 'var(--text3)' }}>
          No credit card required for Free plan · Payments processed securely via Stripe & Razorpay
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-3">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={14} style={{ color: 'var(--text3)' }} />
                </motion.div>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#A5B4FC'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
          >
            ← Back to AgniX
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
