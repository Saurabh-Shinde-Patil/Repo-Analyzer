import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, FileCode, Brain, Sparkles, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: GitBranch, label: 'Connecting to GitHub', sub: 'Fetching repository metadata & tree structure', color: '#818CF8', duration: 3000 },
  { icon: FileCode,  label: 'Reading Source Files',  sub: 'Extracting entry points, routes & key files',  color: '#67E8F9', duration: 5000 },
  { icon: Brain,     label: 'Running AI Analysis',   sub: 'Analyzing architecture, dependencies & patterns', color: '#C084FC', duration: 16000 },
  { icon: Sparkles,  label: 'Building Insights',     sub: 'Security scan, API map, env vars & more',     color: '#6EE7B7', duration: 4000 },
];

export default function LoadingAnalysis({ repoUrl }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const repoName = repoUrl
    ? repoUrl.replace('https://github.com/', '').split('?')[0]
    : 'repository';

  useEffect(() => {
    let step = 0;
    const advance = () => {
      if (step < STEPS.length - 1) {
        setCompletedSteps(prev => [...prev, step]);
        step++;
        setCurrentStep(step);
        setTimeout(advance, STEPS[step].duration);
      }
    };
    setTimeout(advance, STEPS[0].duration);
  }, []);

  const progress = Math.round(((currentStep + 0.5) / STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-8 py-12"
    >
      {/* Animated icon */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-36 h-36 rounded-full"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent)', filter: 'blur(24px)' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute w-20 h-20 rounded-full"
          style={{ border: '1px dashed rgba(99,102,241,0.3)' }}
        />
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
          style={{
            background: 'var(--surface)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 40px rgba(99,102,241,0.25)',
          }}
        >
          <AnimatePresence mode="wait">
            {(() => {
              const { icon: Icon, color } = STEPS[currentStep];
              return (
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={32} style={{ color }} />
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="badge badge-indigo mb-3">
          <GitBranch size={12} />
          {repoName}
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
          Analyzing Repository
        </h2>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          Typically 30–60 seconds · Please wait
        </p>
      </div>

      {/* Steps */}
      <div className="w-full flex flex-col gap-2.5">
        {STEPS.map((step, i) => {
          const { icon: Icon, label, sub, color } = step;
          const isCompleted = completedSteps.includes(i);
          const isActive = currentStep === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-500"
              style={{
                background: isActive ? 'rgba(99,102,241,0.07)' : isCompleted ? 'rgba(16,185,129,0.04)' : 'var(--card-bg)',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : isCompleted ? 'rgba(16,185,129,0.15)' : 'var(--border)'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: isCompleted ? 'rgba(16,185,129,0.12)' : isActive ? 'rgba(99,102,241,0.12)' : 'var(--surface2)',
                }}
              >
                {isCompleted
                  ? <CheckCircle size={18} style={{ color: '#10B981' }} />
                  : <Icon size={18} style={{
                      color: isActive ? color : 'var(--text4)',
                      animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    }}
                    />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: isCompleted ? '#10B981' : isActive ? 'var(--text)' : 'var(--text4)' }}>
                  {label}
                  {isCompleted && <span className="ml-2 text-xs font-normal opacity-50">Done</span>}
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: isActive ? 'var(--text3)' : 'var(--text4)' }}>
                  {sub}
                </div>
              </div>
              {isActive && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ border: `2px solid rgba(99,102,241,0.2)`, borderTopColor: '#818CF8' }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #22D3EE)' }}
          initial={{ width: '5%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs font-mono -mt-5" style={{ color: 'var(--text4)' }}>{progress}%</p>
    </motion.div>
  );
}
