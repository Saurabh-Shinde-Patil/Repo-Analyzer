import { motion } from 'framer-motion';
import { Brain, FolderOpen, Shield, Network, GitBranch, MessageSquare, Zap, KeyRound } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: '#818CF8',
    title: 'Multi-Model AI Analysis',
    desc: 'Choose from Groq (Llama 3), Google Gemini, GPT-4o, or Llama 3.1 70B. Each generates a comprehensive understanding of the codebase in one pass.',
  },
  {
    icon: FolderOpen,
    color: '#67E8F9',
    title: 'Live Code Explorer',
    desc: 'Browse the entire repository file tree and click any file to view its source with full syntax highlighting — no cloning required.',
  },
  {
    icon: Network,
    color: '#C084FC',
    title: 'Architecture Mapping',
    desc: 'Understand entry points, execution lifecycle, runtime request flows, and dependency graphs visualised in a clean, scannable format.',
  },
  {
    icon: Shield,
    color: '#6EE7B7',
    title: 'Security & Bug Scan',
    desc: 'AI-powered scan surfaces potential bugs, security vulnerabilities, and anti-patterns with severity ratings and suggested fixes.',
  },
  {
    icon: MessageSquare,
    color: '#FCD34D',
    title: 'Persistent AI Chat',
    desc: 'Ask anything about the repo — architecture, setup, specific files. Chat history is saved per-repo and restored automatically.',
  },
  {
    icon: GitBranch,
    color: '#FCA5A5',
    title: 'API Endpoint Map',
    desc: 'Automatically extracts all HTTP endpoints with methods, routes, handlers, and descriptions — like Swagger but without any config.',
  },
  {
    icon: KeyRound,
    color: '#A5B4FC',
    title: 'Env Vars Documentation',
    desc: 'Discovers every environment variable the project uses, where it\'s referenced, and what it does — onboarding in seconds.',
  },
  {
    icon: Zap,
    color: '#FDBA74',
    title: 'Instant Results',
    desc: 'Powered by Groq\'s ultra-fast inference. Full repository analysis including 9 insight categories — typically in under 30 seconds.',
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};
const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="badge badge-indigo mb-4 mx-auto">
          <Zap size={11} />
          Everything you need
        </div>
        <h2
          className="text-3xl sm:text-5xl font-black tracking-tighter mb-4"
          style={{ color: 'var(--text)' }}
        >
          One URL.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #818CF8, #C084FC, #67E8F9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Complete Understanding.
          </span>
        </h2>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text3)' }}>
          AgniX gives you every insight you need to understand, present, or onboard to any GitHub repository.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 p-5 rounded-2xl cursor-default"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${color}40`;
              e.currentTarget.style.boxShadow = `0 8px 32px ${color}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}1A` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
