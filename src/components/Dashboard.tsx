import React from 'react';
import { 
  Calendar, Shield, Sparkles, TrendingUp, ChevronRight, 
  Flame, Droplet, Moon, Pizza, Dumbbell, Scale 
} from 'lucide-react';
import { MetricData, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  metrics: MetricData[];
  onOpenTracker: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'assessments' | 'report') => void;
  selectedDate: string;
}

export default function Dashboard({ 
  user, 
  metrics, 
  onOpenTracker, 
  onNavigateToTab,
  selectedDate 
}: DashboardProps) {
  
  // Date navigator items
  const dates = [
    { label: '15', sub: 'Mon', key: '15_Jun' },
    { label: '16', sub: 'Tue', key: '16_Jun' },
    { label: '17 Jun', sub: 'Wed', key: '17_Jun', active: true },
    { label: '18', sub: 'Thu', key: '18_Jun' },
    { label: '19', sub: 'Fri', key: '19_Jun' },
    { label: '20', sub: 'Sat', key: '20_Jun' },
  ];

  // Helper to format values elegantly
  const findMetric = (id: string): MetricData => {
    return metrics.find(m => m.id === id) || { id, name: id, current: 0, target: 100, unit: '' };
  };

  const steps = findMetric('steps');
  const hydration = findMetric('hydration');
  const sleep = findMetric('sleep');
  const nutrition = findMetric('nutrition');
  const workout = findMetric('activity');
  const weight = findMetric('weight');

  // Calculates percentage safely
  const getPercent = (m: MetricData) => {
    if (m.target === 0) return 0;
    return Math.min(100, Math.round((m.current / m.target) * 100));
  };

  // Convert sleep minutes to h and m
  const formatSleep = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${hrs}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-[#071418] text-slate-100 flex flex-col pb-28">
      {/* Top Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-[#071418]/85 backdrop-blur-md z-40 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          {/* Circular image top left */}
          <div className="w-9 h-9 rounded-full border border-emerald-400 overflow-hidden bg-slate-900 shadow-md">
            <img 
              src="/src/assets/images/ashit_portrait_1781860036824.jpg" 
              alt="Ashit Header Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="text-sm font-bold text-slate-100">Ashit</h2>
              <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-[9px] font-mono font-bold px-1 rounded-sm leading-tight inline">
                ✔ INSURE+
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">GOQii ID: #8493</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Doctor overlapping thumbnails */}
          <div className="flex -space-x-1.5 cursor-pointer" onClick={() => onNavigateToTab('report')}>
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-[#071418] flex items-center justify-center text-[9px] shadow">👨‍⚕️</div>
            <div className="w-5 h-5 rounded-full bg-slate-850 border border-[#071418] flex items-center justify-center text-[9px] shadow">👩‍⚕️</div>
          </div>
          {/* Assessment quick link */}
          <button 
            onClick={() => onNavigateToTab('assessments')}
            className="p-2 bg-slate-900/60 border border-slate-850 rounded-xl text-emerald-400 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="animate-pulse" />
          </button>
        </div>
      </header>

      {/* Date Navigation matching Screen 1 */}
      <section className="px-4 py-3 bg-[#071418] flex items-center justify-between">
        <button className="p-2 text-slate-400 hover:text-white transition">
          <Calendar size={15} />
        </button>
        
        <div className="flex items-center space-x-2 scrollbar-none overflow-x-auto">
          {dates.map((d) => (
            <button
              key={d.key}
              className={`px-3 py-1.5 rounded-full transition-all text-xs font-semibold flex flex-col items-center justify-center min-w-[44px] ${
                d.active 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span className="text-[10px] uppercase font-mono tracking-wider">{d.sub}</span>
              <span className="text-xs">{d.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Profile Shield card matching Screen 1 */}
      <main className="px-4 pt-3 flex-1 space-y-4">
        <div id="central-bio-card" className="bg-[#122226]/80 p-6 rounded-3xl border border-[#233c42]/40 shadow-xl space-y-5 text-center relative overflow-hidden backdrop-blur-sm">
          {/* Subtle neon ambient backdrop spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Portrait framed with dynamic protective green badge */}
          <div className="relative w-28 h-28 mx-auto">
            {/* Multi-layered circular scanning or protection rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#10b981]/30 animate-[spin_25s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-emerald-400/50"></div>
            
            <div className="absolute inset-3 rounded-full overflow-hidden bg-slate-850 shadow-md">
              <img 
                src="/src/assets/images/ashit_portrait_1781860036824.jpg" 
                alt="Ashit Jagannath Amin" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Micro shield pill banner */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full inline-flex items-center space-x-1 whitespace-nowrap shadow z-10">
              <Shield size={9} className="text-emerald-400 fill-emerald-500/20" />
              <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest font-mono">I am protected</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold font-serif text-white tracking-wide">
              {user.fullName}
            </h1>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-emerald-400 font-mono">
              <span className="text-[10px]">💚 GOQii Age: {user.ageYears}y {user.ageMonths}m</span>
            </div>
            
            {/* Custom quote block */}
            <p className="text-xs italic text-slate-400 max-w-xs mx-auto pt-1 font-sans font-medium leading-relaxed">
              "{user.quote}"
            </p>
          </div>

          {/* Overall Health Risk Score Block matching Screen 1 */}
          <div className="border-t border-slate-800/80 pt-4 cursor-pointer" onClick={() => onNavigateToTab('report')}>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#a3b8cc] font-bold">Health Risk Score</span>
            <div className="flex items-baseline justify-center space-x-1 mt-1">
              <span className="font-mono text-3xl font-extrabold text-[#11bcf2] tracking-tighter">
                {user.healthRiskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">/100</span>
            </div>

            {/* Risk rating level pill */}
            <div className="mt-2.5">
              <span className="bg-rose-950/40 border border-rose-900/40 text-rose-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono inline-block">
                {user.riskCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Grid Metrics widgets matching Screen 1 */}
        <div id="metrics-grid" className="grid grid-cols-2 gap-3 pb-8">
          
          {/* 1. Steps Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Steps</span>
            
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {/* Progress canvas circle SVG */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - getPercent(steps)/100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-emerald-400">
                <Flame size={18} className="fill-emerald-500/10" />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{steps.current.toLocaleString()}</div>
              <div className="text-[9px] text-slate-400 font-mono">of {steps.target.toLocaleString()}</div>
            </div>
          </div>

          {/* 2. Hydration Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Hydration</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#06b6d4" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - getPercent(hydration)/100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-cyan-400">
                <Droplet size={18} className="fill-cyan-500/10" />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{hydration.current.toFixed(1)}L</div>
              <div className="text-[9px] text-slate-400 font-mono">of {hydration.target.toFixed(1)}L</div>
            </div>
          </div>

          {/* 3. Sleep Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Sleep</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#8cb2d9" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - getPercent(sleep)/100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-sky-400">
                <Moon size={18} className="fill-sky-500/10" />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{formatSleep(sleep.current)}</div>
              <div className="text-[9px] text-slate-400 font-mono">of {formatSleep(sleep.target)}</div>
            </div>
          </div>

          {/* 4. Nutrition Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Nutrition</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#4b5563" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - getPercent(nutrition)/100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-slate-500">
                <Pizza size={18} className="text-slate-400" />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{nutrition.current}</div>
              <div className="text-[9px] text-slate-400 font-mono">of {nutrition.target} kcal</div>
            </div>
          </div>

          {/* 5. Activity Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Activity</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#34d399" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.75)}`} // pre-loaded or pre-filled partially as in image
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-emerald-400">
                <Dumbbell size={18} />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{formatSleep(workout.current)}</div>
              <div className="text-[9px] text-slate-400 font-mono">active workout</div>
            </div>
          </div>

          {/* 6. Weight Widget */}
          <div className="bg-[#122226]/70 border border-[#233c42]/35 p-4 rounded-3xl flex flex-col justify-between space-y-3 min-h-[172px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans block">Weight</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1c2d30" strokeWidth="4" fill="none" />
                <circle 
                  cx="40" cy="40" r="32" stroke="#06b6d4" strokeWidth="4.5" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.6)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-cyan-400">
                <Scale size={18} />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-sm font-bold text-white font-mono">{weight.current} kg</div>
              <div className="text-[9px] text-slate-400 font-mono">target: {weight.target} kg</div>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Action Button '+' inside central bottom location */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          id="dashboard-tracker-fab"
          onClick={onOpenTracker}
          className="w-14 h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/25 active:scale-95 flex items-center justify-center text-slate-950 transition-all cursor-pointer"
        >
          <span className="text-3xl font-light leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
