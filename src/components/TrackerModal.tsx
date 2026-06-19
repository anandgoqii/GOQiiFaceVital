import React, { useState } from 'react';
import { 
  X, Pizza, Droplet, Smile, Activity, Brain, Moon, 
  Scale, ClipboardCheck, Heart, Leaf, Dumbbell, Sparkles 
} from 'lucide-react';

interface TrackerModalProps {
  onClose: () => void;
  onUpdateMetric: (metricId: string, amount: number, absolute?: boolean) => void;
  onNavigateToTab: (tab: 'dashboard' | 'assessments' | 'report') => void;
}

export default function TrackerModal({ onClose, onUpdateMetric, onNavigateToTab }: TrackerModalProps) {
  const [activeLog, setActiveLog] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const trackerItems = [
    { id: 'nutrition', name: 'Nutrition', label: 'Calories (kcal)', icon: Pizza, color: 'text-rose-400 bg-rose-500/10' },
    { id: 'hydration', name: 'Hydration', label: 'Water (Liters)', icon: Droplet, color: 'text-cyan-400 bg-cyan-400/10' },
    { id: 'meditation', name: 'Meditation', label: 'Meditation (minutes)', icon: Smile, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'physical', name: 'Physical Activity', label: 'Steps taken', icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'games', name: 'Games4good', label: 'Focus training logs', icon: Brain, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'sleep', name: 'Sleep Health', label: 'Minutes slept', icon: Moon, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'body_comp', name: 'Body Comp', label: 'Weight (kg)', icon: Scale, color: 'text-slate-400 bg-slate-500/10' },
    { id: 'assessment', name: 'Assessment', label: 'Redirect to Assessments', icon: ClipboardCheck, color: 'text-teal-400 bg-teal-500/10', action: 'assessments' },
    { id: 'vitals', name: 'Vitals', label: 'Heart Rate (bpm)', icon: Heart, color: 'text-pink-400 bg-pink-500/10' },
    { id: 'nutriforge', name: 'NutriForge', label: 'Green intake level (1-10)', icon: Leaf, color: 'text-green-400 bg-green-500/10' },
    { id: 'workout', name: 'Workout', label: 'Active mins', icon: Dumbbell, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'face_vital', name: 'Face Vital', label: 'Go to Face Scan', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10', action: 'assessments' },
  ];

  const handleGridItemClick = (item: typeof trackerItems[0]) => {
    if (item.action) {
      onNavigateToTab(item.action as any);
      onClose();
    } else {
      setActiveLog(item.id);
      setInputValue('');
    }
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputValue);
    if (!isNaN(val) && activeLog) {
      if (activeLog === 'hydration') {
        // Increment hydration by val liters
        onUpdateMetric('hydration', val);
      } else if (activeLog === 'physical') {
        // Increment steps
        onUpdateMetric('steps', val);
      } else if (activeLog === 'sleep') {
        // Sleep log takes minutes, convert or input minutes
        onUpdateMetric('sleep', val);
      } else if (activeLog === 'nutrition') {
        onUpdateMetric('nutrition', val);
      } else if (activeLog === 'workout') {
        onUpdateMetric('activity', val);
      } else if (activeLog === 'body_comp') {
        onUpdateMetric('weight', val, true);
      }
      
      setActiveLog(null);
      // Close after logging
      onClose();
    }
  };

  return (
    <div id="tracker-modal-overlay" className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col justify-between p-4 overflow-y-auto">
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto pt-4 px-2">
        <div className="flex items-center space-x-2">
          {/* Mock profile image top left */}
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/50 flex overflow-hidden">
            <span className="text-white text-xs m-auto">A</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold leading-tight">Ashit</h4>
            <span className="bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 text-[9px] px-1 rounded inline-block">✔ INSURE+</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Doc avatars */}
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-950 flex justify-center items-center text-[8px] text-white">👨‍⚕️</div>
            <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-950 flex justify-center items-center text-[8px] text-white">👩‍⚕️</div>
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
            <ClipboardCheck size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      {!activeLog ? (
        <div className="flex flex-col items-center my-6">
          <h2 className="font-serif text-2xl text-white font-medium tracking-wide">Track your activity</h2>
          <div className="w-12 h-1 bg-emerald-500/50 rounded-full mt-2"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center my-6">
          <h2 className="font-serif text-2xl text-white font-medium tracking-wide">
            Log {trackerItems.find(t => t.id === activeLog)?.name}
          </h2>
          <span className="text-xs text-slate-400 mt-1">
            Update your daily stats to evaluate health metrics
          </span>
        </div>
      )}

      {/* Main Area */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center px-2">
        {!activeLog ? (
          /* Tracker Grid matching Screen 2 */
          <div id="tracker-grid" className="grid grid-cols-3 gap-3">
            {trackerItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  id={`tracker-item-${item.id}`}
                  onClick={() => handleGridItemClick(item)}
                  className="bg-slate-950/40 border border-slate-800 hover:border-emerald-500/40 active:scale-95 transition-all p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 h-24 text-center cursor-pointer"
                >
                  <div className={`p-2.5 rounded-full ${item.color}`}>
                    <IconComp size={18} />
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium leading-tight">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Log Entry Screen */
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl w-full max-w-sm mx-auto">
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                  Amount ({trackerItems.find(t => t.id === activeLog)?.label})
                </label>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  required
                  placeholder={activeLog === 'hydration' ? 'e.g. 0.5' : activeLog === 'physical' ? 'e.g. 2000' : 'e.g. 50'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLog(null)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Floating Action Close Button at bottom */}
      <div className="flex justify-center py-6">
        <button
          id="close-tracker-btn"
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center text-slate-950 transition-all cursor-pointer"
        >
          <X size={26} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
