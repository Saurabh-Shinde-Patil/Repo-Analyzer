import { motion } from 'framer-motion';
import { Lightbulb, Target, Users, LayoutDashboard, Briefcase, RotateCcw } from 'lucide-react';

function InfoCard({ title, icon: Icon, color, content }) {
  return (
    <div
      className="flex items-start gap-4 p-5 rounded-2xl"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      <div 
        className="shrink-0 p-3 rounded-xl mt-1"
        style={{
          background: `${color}15`, // adding opacity
          color: color
        }}
      >
        <Icon size={24} />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          {title}
        </h3>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text2)' }}>
          {content || 'Not available.'}
        </p>
      </div>
    </div>
  );
}

export default function NonTechDashboard({ data, onReset }) {
  const { overview, problem, users, use_case, business_value, repo } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
          >
            <Lightbulb size={20} style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Project Explained
            </h2>
            {repo && (
              <p className="text-sm font-medium" style={{ color: '#6EE7B7' }}>{repo}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#6EE7B7',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}
        >
          <RotateCcw size={14} />
          Analyze Another
        </button>
      </div>

      {/* Simplified Cards */}
      <div className="grid gap-5">
        <InfoCard 
          title="What does this project do?" 
          icon={LayoutDashboard} 
          color="#3B82F6" 
          content={overview} 
        />
        
        <InfoCard 
          title="The Problem It Solves" 
          icon={Target} 
          color="#EF4444" 
          content={problem} 
        />

        <InfoCard 
          title="Who Can Use This" 
          icon={Users} 
          color="#F59E0B" 
          content={users} 
        />

        <InfoCard 
          title="Real-World Use Case" 
          icon={Lightbulb} 
          color="#10B981" 
          content={use_case} 
        />

        <InfoCard 
          title="Business Value" 
          icon={Briefcase} 
          color="#8B5CF6" 
          content={business_value} 
        />
      </div>
    </motion.div>
  );
}
