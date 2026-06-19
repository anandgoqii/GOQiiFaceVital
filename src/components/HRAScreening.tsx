import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { HRAPreferredAnswers } from '../types';

interface HRAScreeningProps {
  onBack: () => void;
  onSubmitAssessment: (score: number, category: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK') => void;
}

export default function HRAScreening({ onBack, onSubmitAssessment }: HRAScreeningProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [answers, setAnswers] = useState<HRAPreferredAnswers>({
    smoking: 'no',
    alcohol: 'social',
    exercise: 'moderate',
    sleep: 'balanced',
    nutrition: 'moderate',
    glucose: 'normal'
  });

  const handleSelectOption = (key: keyof HRAPreferredAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      calculateAndSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const calculateAndSubmit = () => {
    // Basic clinical logic to calculate risk score out of 100
    let score = 45; // base

    if (answers.smoking === 'yes') score += 20;
    if (answers.smoking === 'occasional') score += 10;
    
    if (answers.alcohol === 'frequent') score += 15;
    if (answers.alcohol === 'social') score += 5;

    if (answers.exercise === 'rarely') score += 15;
    if (answers.exercise === 'moderate') score += 5;
    if (answers.exercise === 'daily') score -= 5;

    if (answers.sleep === 'poor') score += 15;
    if (answers.sleep === 'balanced') score -= 5;

    if (answers.nutrition === 'poor') score += 15;
    if (answers.nutrition === 'organic') score -= 5;

    // Constrain score between 20 and 98
    score = Math.max(20, Math.min(98, score));

    let category: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' = 'MODERATE RISK';
    if (score < 45) {
      category = 'LOW RISK';
    } else if (score > 75) {
      category = 'HIGH RISK';
    }

    onSubmitAssessment(score, category);
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-6 pb-24 px-4">
      {/* Header */}
      <div className="w-full max-w-lg mx-auto flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-serif text-lg font-medium tracking-tight">Health Risk Assessment</h1>
          <p className="text-[10px] text-slate-400 font-mono">Evaluate wellness factors & calculate risk level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-lg mx-auto mb-8 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-emerald-400 font-mono">Question {step} of {totalSteps}</span>
          <span className="text-xs text-slate-400 font-semibold">{Math.round(progressPercentage)}% Completed</span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
          <div 
            className="bg-emerald-400 h-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Content */}
      <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center">
        <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-3xl backdrop-blur-sm shadow-xl space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-red-400/10 border border-red-500/20 rounded-2xl w-fit text-red-400">
                <Heart size={20} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-medium font-sans text-white">Do you smoke or use nicotine products?</h3>
              <p className="text-xs text-slate-400">Tobacco habits are a major contributor to biological aging and arterial health conditions.</p>
              
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {[
                  { value: 'yes', label: 'Yes, daily smoker' },
                  { value: 'occasional', label: 'Occasionally / Socially' },
                  { value: 'no', label: 'No, never smoked (or quit)' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption('smoking', opt.value)}
                    className={`text-left p-4 rounded-xl border text-xs font-semibold transition-all ${
                      answers.smoking === opt.value 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-cyan-400/10 border border-cyan-500/20 rounded-2xl w-fit text-cyan-400">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-lg font-medium font-sans text-white">How often do you consume alcoholic beverages?</h3>
              <p className="text-xs text-slate-400">Excessive alcohol intake directly impacts visceral fat levels, recovery vitals, and sleep hygiene.</p>
              
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {[
                  { value: 'frequent', label: 'Frequently (Multiple times a week)' },
                  { value: 'social', label: 'Socially (Occasional weekends)' },
                  { value: 'never', label: 'Rarely / Entirely Teetotaler' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption('alcohol', opt.value)}
                    className={`text-left p-4 rounded-xl border text-xs font-semibold transition-all ${
                      answers.alcohol === opt.value 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-400/10 border border-purple-500/20 rounded-2xl w-fit text-purple-400">
                <Heart size={20} />
              </div>
              <h3 className="text-lg font-medium font-sans text-white">What is your average sleep health currently?</h3>
              <p className="text-xs text-slate-400">Sleep allows cellular repair. Bad sleep raises chronic cortisol levels and decreases cognitive reaction time.</p>
              
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {[
                  { value: 'poor', label: 'Less than 6 hours / High stress' },
                  { value: 'moderate', label: '6 - 7 hours / Intermittent awakenings' },
                  { value: 'balanced', label: '7 - 9 hours / Highly restful' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption('sleep', opt.value)}
                    className={`text-left p-4 rounded-xl border text-xs font-semibold transition-all ${
                      answers.sleep === opt.value 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-400/10 border border-amber-500/20 rounded-2xl w-fit text-amber-400">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-lg font-medium font-sans text-white">How frequently do you get physical exercise?</h3>
              <p className="text-xs text-slate-400">At least 30 minutes of brisk walking, cycling, or weightlifting strengthens cardio performance and improves glucose dispatch.</p>
              
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {[
                  { value: 'rarely', label: 'Rarely (Mainly sedentary)' },
                  { value: 'moderate', label: 'Occasionally (1-3 times a week)' },
                  { value: 'daily', label: 'Regularly (4+ times a week)' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption('exercise', opt.value)}
                    className={`text-left p-4 rounded-xl border text-xs font-semibold transition-all ${
                      answers.exercise === opt.value 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-400/10 border border-indigo-500/20 rounded-2xl w-fit text-indigo-400">
                <Heart size={20} />
              </div>
              <h3 className="text-lg font-medium font-sans text-white">How cleanly is your daily diet / meal pattern?</h3>
              <p className="text-xs text-slate-400">Rich greens, fiber, lean proteins support strong cellular and skin repair, preventing pre-diabetic risk markers.</p>
              
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {[
                  { value: 'poor', label: 'Heavy Processed Foods, Sugars & Sodas' },
                  { value: 'moderate', label: 'Intermediate (Home cooked but standard starches)' },
                  { value: 'organic', label: 'Highly Nutrient Dense (Lots of greens, fiber)' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption('nutrition', opt.value)}
                    className={`text-left p-4 rounded-xl border text-xs font-semibold transition-all ${
                      answers.nutrition === opt.value 
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Step Bar */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                step === 1 
                  ? 'border-slate-900 bg-slate-950 text-slate-600 cursor-not-allowed' 
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/15 cursor-pointer"
            >
              <span>{step === totalSteps ? 'Submit Evaluation' : 'Continue'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
