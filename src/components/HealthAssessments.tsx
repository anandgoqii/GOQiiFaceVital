import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, ClipboardCheck, Brain, Smile, 
  Sparkles, Scan, Ban, Plus, Timer, Heart 
} from 'lucide-react';
import { AssessmentItem } from '../types';

interface HealthAssessmentsProps {
  onBack: () => void;
  onLaunchHRA: () => void;
  onLaunchFaceScan: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'assessments' | 'report') => void;
}

export default function HealthAssessments({ 
  onBack, 
  onLaunchHRA, 
  onLaunchFaceScan,
  onNavigateToTab
}: HealthAssessmentsProps) {
  
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<'none' | 'cognitive' | 'breathing'>('none');
  
  // Cognitive speed states
  const [gameStage, setGameStage] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [calculatedCognitiveAge, setCalculatedCognitiveAge] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  // Breathing trainer states
  const [breathStage, setBreathStage] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(4);

  // List of assessments matching Screen 3 precisely
  const assessments: AssessmentItem[] = [
    {
      id: 'hra',
      title: 'Health Risk Assessment',
      desc: 'Take the Health Risk Assessment (HRA) questionnaire to evaluate and improve your health status.',
      icon: 'clipboard-check',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      category: 'Lifestyle'
    },
    {
      id: 'cognitive',
      title: 'Cognitive Age Assessment',
      desc: 'Assess and improve cognitive ability through gamified experiences designed for focus.',
      icon: 'brain',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      category: 'Cognitive'
    },
    {
      id: 'mental',
      title: 'Mental Wellness Assessment',
      desc: 'Identify symptoms of anxiety and depression and take steps towards better mental health.',
      icon: 'smile',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      category: 'Neurological'
    },
    {
      id: 'skinalyze',
      title: 'Skinalyze',
      desc: 'Experience a comprehensive skin analysis with a simple camera scan for rapid diagnostics.',
      icon: 'sparkles',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      category: 'Derm'
    },
    {
      id: 'face_scan',
      title: 'Face Scan',
      desc: 'Scan your face to analyze key facial metrics and get personalized insights on your overall wellbeing.',
      icon: 'scan',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      category: 'Cardiovascular'
    },
    {
      id: 'addiction',
      title: 'Addiction Assessments',
      desc: 'Assess your dependence on nicotine, smoking, or drugs with a quick clinical test.',
      icon: 'ban',
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
      category: 'Psychological'
    },
  ];

  const handleAssessmentClick = (id: string) => {
    if (id === 'hra') {
      onLaunchHRA();
    } else if (id === 'face_scan') {
      onLaunchFaceScan();
    } else if (id === 'cognitive') {
      setActiveInteractiveTool('cognitive');
      resetCognitiveGame();
    } else if (id === 'mental') {
      setActiveInteractiveTool('breathing');
      startBreathingCycle();
    }
  };

  // 1. Cognitive Game logic
  const resetCognitiveGame = () => {
    setGameStage('idle');
    setReactionTime(null);
    setCalculatedCognitiveAge(null);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const startCognitiveGame = () => {
    setGameStage('waiting');
    const delay = 2000 + Math.random() * 3000; // 2-5s random wait
    const id = setTimeout(() => {
      setGameStage('ready');
      setStartTime(Date.now());
    }, delay);
    setTimeoutId(id);
  };

  const stampReaction = () => {
    if (gameStage === 'waiting') {
      // Too early!
      if (timeoutId) clearTimeout(timeoutId);
      alert('Too hasty! Tap only when the card turns bright green.');
      resetCognitiveGame();
      return;
    }
    if (gameStage === 'ready') {
      const diff = Date.now() - startTime;
      setReactionTime(diff);
      
      // Calculate a fun mock visual age depending on response speed
      // Normal human response is ~250ms
      let age = Math.round(20 + (diff - 200) / 10);
      age = Math.max(18, Math.min(85, age));
      setCalculatedCognitiveAge(age);
      setGameStage('result');
    }
  };

  // 2. Breathing sequence loops
  const startBreathingCycle = () => {
    setBreathStage('Inhale');
    setBreathCounter(4);
  };

  useEffect(() => {
    if (activeInteractiveTool !== 'breathing') return;

    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          // transition to next state
          if (breathStage === 'Inhale') {
            setBreathStage('Hold');
            return 4; // hold 4 seconds
          } else if (breathStage === 'Hold') {
            setBreathStage('Exhale');
            return 4; // exhale 4 seconds
          } else {
            setBreathStage('Inhale');
            return 4; // inhale 4 seconds
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeInteractiveTool, breathStage]);

  return (
    <div className="min-h-screen bg-[#071418] text-slate-100 flex flex-col pb-28">
      {/* Top Header bar with exact back arrow and Serif styled Title */}
      <header className="px-4 pt-5 pb-3 sticky top-0 bg-[#071418]/90 z-40 border-b border-white/5 flex items-center space-x-3 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="p-2 border border-slate-900 bg-slate-900/60 rounded-xl text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-serif text-xl font-semibold tracking-wide text-white">Health Assessments</span>
      </header>

      {activeInteractiveTool === 'none' ? (
        /* Standard Screen 3 list */
        <main className="flex-1 px-4 py-4 space-y-3.5">
          {assessments.map((item) => {
            return (
              <div 
                key={item.id}
                id={`assessment-card-${item.id}`}
                onClick={() => handleAssessmentClick(item.id)}
                className="bg-[#122226]/80 hover:bg-[#15292d] border border-[#233c42]/30 hover:border-emerald-500/30 p-4.5 rounded-3xl flex items-center space-x-4 cursor-pointer transition-all duration-250 hover:shadow-lg hover:shadow-emerald-500/5 group"
              >
                {/* Icon Wrapper matching look with tailored categories */}
                <div className={`p-3 rounded-2xl shrink-0 ${item.color}`}>
                  {item.icon === 'clipboard-check' && <ClipboardCheck size={20} />}
                  {item.icon === 'brain' && <Brain size={20} />}
                  {item.icon === 'smile' && <Smile size={20} />}
                  {item.icon === 'sparkles' && <Sparkles size={20} />}
                  {item.icon === 'scan' && <Scan size={20} />}
                  {item.icon === 'ban' && <Ban size={20} />}
                </div>

                {/* Text Content block */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                      Evaluate
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-sans text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Right Arrow chevron */}
                <div className="p-1.5 bg-slate-950/60 rounded-full border border-slate-850 text-slate-500 group-hover:text-white transition-all">
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </main>
      ) : activeInteractiveTool === 'cognitive' ? (
        /* GAMI-FIED PLYABLE REFLEX AGE TESTER MODULE */
        <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full flex flex-col justify-center space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Cognitive Focus Lab</span>
              <button 
                onClick={() => setActiveInteractiveTool('none')} 
                className="text-xs text-slate-500 hover:text-white"
              >
                Close Lab
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold font-sans">Visual Reaction Speed Game</h2>
              <p className="text-xs text-slate-400 mt-1">Tap the screen ASAP the instant the red card flashes neon green!</p>
            </div>

            {/* Tap Panel */}
            <div 
              onClick={gameStage === 'ready' ? stampReaction : gameStage === 'waiting' ? stampReaction : undefined}
              className={`h-48 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2 ${
                gameStage === 'idle' 
                  ? 'bg-slate-950 border-dashed border-slate-800 text-slate-500' 
                  : gameStage === 'waiting' 
                    ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' 
                    : gameStage === 'ready' 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'bg-slate-950 border-emerald-500/20 text-emerald-400'
              }`}
            >
              {gameStage === 'idle' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); startCognitiveGame(); }}
                  className="bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs"
                >
                  Start Focus Sweep
                </button>
              )}
              {gameStage === 'waiting' && (
                <div className="space-y-1">
                  <div className="text-sm font-semibold tracking-wide animate-pulse">Wait for green...</div>
                  <div className="text-[10px] font-mono opacity-60">Do not tap yet!</div>
                </div>
              )}
              {gameStage === 'ready' && (
                <div className="text-base tracking-widest text-[#071418] uppercase">TAP NOW!</div>
              )}
              {gameStage === 'result' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Response Calculated</div>
                  <div className="text-3xl font-extrabold text-white font-mono">{reactionTime}ms</div>
                  <div className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full w-fit mx-auto">
                    Estimated Cognitive Age: <strong>{calculatedCognitiveAge} Years</strong>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startCognitiveGame(); }}
                    className="mt-3 text-[10px] text-slate-500 underline hover:text-white"
                  >
                    Test Again
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center space-x-1">
              <Timer size={12} />
              <span>Standard 25-yr-old average is 240ms reaction time</span>
            </div>
          </div>
        </main>
      ) : (
        /* PHYSICAL DEEP-BREATHING YOGA WAVE MODULE */
        <main className="flex-1 px-4 py-8 max-w-sm mx-auto w-full flex flex-col justify-center space-y-6">
          <div className="bg-[#122226] border border-[#233c42]/50 p-6 rounded-3xl text-center space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">BioFeedback Vitals Lab</span>
              <button 
                onClick={() => setActiveInteractiveTool('none')} 
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Trainer
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold font-sans text-white">Pranayama breathing exercise</h2>
              <p className="text-xs text-slate-400">Regularize your heart-rate variability and optimize cortisol metrics instantly.</p>
            </div>

            {/* Pulsing circle container */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              {/* Outer expanding ring */}
              <div className={`absolute inset-0 rounded-full border-2 border-emerald-400/40 opacity-40 transition-all duration-[4s] ease-in-out ${
                breathStage === 'Inhale' 
                  ? 'scale-100 ring-4 ring-emerald-400/20' 
                  : breathStage === 'Hold' 
                    ? 'scale-100 opacity-90' 
                    : 'scale-50'
              }`}></div>

              {/* Central Core Circle */}
              <div className={`w-28 h-28 rounded-full bg-emerald-500/15 border-2 border-emerald-400/60 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.15)] transition-all duration-[4s] ease-in-out ${
                breathStage === 'Inhale' ? 'scale-105' : breathStage === 'Hold' ? 'scale-110 bg-emerald-500/20' : 'scale-90'
              }`}>
                <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider font-extrabold">{breathStage}</span>
                <span className="text-2xl font-black text-white font-mono mt-1">{breathCounter}s</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              Synchronize your lungs. Follow the expansion rings.
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center space-x-1.5 pt-1">
              <Heart size={11} className="text-rose-400 fill-rose-500/20 animate-pulse" />
              <span>Lowers active blood pressure and calms nervous tension</span>
            </div>
          </div>
        </main>
      )}

      {/* Floating Plus FAB matching Screen 3 bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => onNavigateToTab('dashboard')}
          className="w-14 h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center text-slate-950 transition-all cursor-pointer"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
