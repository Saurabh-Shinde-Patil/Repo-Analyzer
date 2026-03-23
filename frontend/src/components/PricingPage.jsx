import { useState } from 'react';
import PricingCard from './PricingCard';

const personalPlans = [
  {
    id: 'go',
    name: 'Go',
    price: 8,
    currency: 'USD',
    currencySymbol: '$',
    taxNote: '',
    tagline: 'Keep chatting with expanded access',
    isRecommended: false,
    features: [
      { icon: 'sparkles', text: 'Explore topics in depth' },
      { icon: 'message', text: 'Chat longer and upload more content' },
      { icon: 'image', text: 'Make more images for your projects' },
      { icon: 'brain', text: 'Get more memory for smarter replies' },
      { icon: 'zap', text: 'Get help with planning and tasks' },
      { icon: 'folder', text: 'Explore projects, tasks, and custom GPTs' },
    ]
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 20,
    currency: 'USD',
    currencySymbol: '$',
    taxNote: '',
    tagline: 'Unlock the full experience',
    isRecommended: false,
    features: [
      { icon: 'zap', text: 'Solve complex problems' },
      { icon: 'message', text: 'Have long chats over multiple sessions' },
      { icon: 'image', text: 'Create more images, faster' },
      { icon: 'brain', text: 'Remember goals and past conversations' },
      { icon: 'globe', text: 'Plan travel and tasks with agent mode' },
      { icon: 'settings', text: 'Organize projects and customize GPTs' },
      { icon: 'video', text: 'Produce and share videos on Sora' },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 200,
    currency: 'USD',
    currencySymbol: '$',
    taxNote: '',
    tagline: 'Maximize your productivity',
    isRecommended: false,
    features: [
      { icon: 'sparkles', text: 'Master advanced tasks and topics' },
      { icon: 'infinity', text: 'Tackle big projects with unlimited core chat' },
      { icon: 'image', text: 'Create high-quality images at any scale' },
      { icon: 'brain', text: 'Keep full context with maximum memory' },
      { icon: 'zap', text: 'Run research and plan tasks with agents' },
      { icon: 'scale', text: 'Scale your projects and automate workflows' },
      { icon: 'video', text: 'Expand your limits with Sora video creation' },
    ]
  },
];

const businessPlans = [
  {
    id: 'go',
    name: 'Go',
    price: 399,
    currency: 'INR',
    currencySymbol: '₹',
    taxNote: '(inclusive of GST)',
    tagline: 'Keep chatting with expanded access',
    isRecommended: false,
    features: [
      { icon: 'sparkles', text: 'Explore topics in depth' },
      { icon: 'message', text: 'Chat longer and upload more content' },
      { icon: 'image', text: 'Make more images for your projects' },
      { icon: 'brain', text: 'Get more memory for smarter replies' },
      { icon: 'zap', text: 'Get help with planning and tasks' },
      { icon: 'folder', text: 'Explore projects, tasks, and custom GPTs' },
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: '2,099',
    currency: 'INR',
    currencySymbol: '₹',
    taxNote: '(exclusive of GST)',
    tagline: 'Get more work done with AI for teams',
    isRecommended: true,
    features: [
      { icon: 'zap', text: 'Conduct professional analysis' },
      { icon: 'infinity', text: 'Get unlimited core chat' },
      { icon: 'image', text: 'Produce images, videos, slides, & more' },
      { icon: 'shield', text: 'Secure your space with SSO, MFA, & more' },
      { icon: 'scale', text: 'Protect privacy; data never used for training' },
      { icon: 'folder', text: 'Share projects & custom GPTs' },
      { icon: 'globe', text: 'Integrate with SharePoint & other tools' },
    ]
  },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('personal');

  const plans = activeTab === 'personal' ? personalPlans : businessPlans;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-16 px-4">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-8">
        Upgrade your plan
      </h1>

      {/* Toggle */}
      <div className="flex justify-center mb-10 sm:mb-14">
        <div className="inline-flex items-center bg-[#2a2a3e] rounded-full p-1 border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('personal')}
            className={`
              px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${activeTab === 'personal'
                ? 'bg-white text-[#0f0f1a] shadow-md'
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`
              px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${activeTab === 'business'
                ? 'bg-white text-[#0f0f1a] shadow-md'
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Business
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`
          grid gap-6 w-full
          ${activeTab === 'personal'
            ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
          }
        `}
      >
        {plans.map(plan => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Payment providers */}
      <div className="mt-12 text-center">
        <p className="text-white/30 text-xs mb-3 uppercase tracking-wider font-medium">Payment powered by</p>
        <div className="flex justify-center items-center gap-6">
          <span className="text-white/20 text-sm font-semibold px-4 py-2 rounded-lg border border-white/[0.06] bg-white/[0.03]">
            Stripe
          </span>
          <span className="text-white/20 text-sm font-semibold px-4 py-2 rounded-lg border border-white/[0.06] bg-white/[0.03]">
            Razorpay
          </span>
        </div>
      </div>
    </div>
  );
}
