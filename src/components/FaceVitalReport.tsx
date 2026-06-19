import React, { useState } from 'react';
import { 
  ArrowLeft, Brain, Sparkles, Shield, RefreshCw, FileText, 
  Eye, CheckCircle2, ChevronRight, MessageSquareCode, Download 
} from 'lucide-react';
import { Biomarker, UserProfile } from '../types';

interface FaceVitalReportProps {
  user: UserProfile;
  onBack: () => void;
  onLaunchChat: () => void;
}

export default function FaceVitalReport({ user, onBack, onLaunchChat }: FaceVitalReportProps) {
  
  // Scanned face biomarkers matching Screen 4 precisely
  const biomarkers: Biomarker[] = [
    { id: 'age', name: 'Biological Age', value: '43 Years', status: 'Moderate', color: 'text-amber-400' },
    { id: 'stress', name: 'Stress Index', value: 'Moderate', status: 'Moderate', color: 'text-amber-400' },
    { id: 'hydration', name: 'Hydration Score', value: '82%', status: 'Good', color: 'text-cyan-400' },
    { id: 'sleep', name: 'Sleep Quality', value: '78%', status: 'Good', color: 'text-sky-400' },
    { id: 'fatigue', name: 'Fatigue Risk', value: 'Low', status: 'Low', color: 'text-emerald-400' },
    { id: 'cardio', name: 'Cardio Risk', value: 'Moderate', status: 'Moderate', color: 'text-amber-500' },
    { id: 'skin', name: 'Skin Health', value: '85%', status: 'Good', color: 'text-cyan-400' },
    { id: 'recovery', name: 'Recovery Score', value: '76%', status: 'Good', color: 'text-emerald-400' },
  ];

  const [downloading, setDownloading] = useState(false);

  // Simulated PDF download
  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create and trigger a real small text clinical file download representing their wellness report
      const content = `
========================================
GOQii WELLNESS PLATFORM — FACESCAN AI REPORT
========================================
Patient Name: ${user.fullName}
Age Reference: ${user.ageYears}y ${user.ageMonths}m
Risk Profile: ${user.riskCategory} (Health Risk Score: ${user.healthRiskScore}/100)

BIOLOGICAL AGE ASSESSED: 43 Years
STRESS INDEX: Moderate
HYDRATION RECOGNITION: 82%
CARDIOVASCULAR LEVEL: Moderate
DIABETES CLASSIFICATION: PREDIABETIC (Index Load: 68/100)

GOQii PHYSICIAN AI RECS:
- Improve restorative sleep cycles to at least 8h daily (Current: 7h 24m)
- Perform 45m focused aerobics daily to raise heart-rate variability
- Incorporate high-fiber greens to regulate glucose dispatch.

Coach Support: Assigned & Active (Ananya Deshmukh)
Report Generated: June 19, 2026 UTC
HIPAA compliant security standard.
========================================
      `;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GOQii_FaceScanReport_${user.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#071418] text-slate-100 flex flex-col pb-32">
      {/* Top Header Row matching Screen 4 precisely */}
      <header className="px-4 pt-5 pb-3 bg-[#071418] sticky top-0 z-40 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onBack}
            className="p-2 border border-slate-900 bg-slate-900/60 rounded-xl text-slate-300 hover:text-white transition"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">Face Vital Report</h1>
            <p className="text-[9px] text-[#0ea5e9] uppercase tracking-wider font-mono font-bold leading-tight">AI Health Assessment Summary</p>
          </div>
        </div>

        {/* Dynamic header user avatar framed */}
        <div className="w-9 h-9 rounded-full border border-[#11bcf2]/60 overflow-hidden bg-slate-900 shadow">
          <img 
            src="/src/assets/images/ashit_portrait_1781860036824.jpg" 
            alt="Ashit Profile bubble" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 py-4 space-y-5 flex-1 max-w-md mx-auto w-full">
        
        {/* Module A: Overall Health Risk Score card matching top of Screen 4 */}
        <div id="overall-risk-summary-card" className="bg-[#122226]/90 p-5 rounded-3xl border border-[#233c42]/45 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">Overall Health Risk Score</h3>
            <span className="text-[10px] text-slate-500 font-mono">ID: FS_0x04F</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 py-1">
            {/* Visual concentric score arc with green/cyan progress */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="#162e33" strokeWidth="6" fill="none" />
                <circle 
                  cx="56" cy="56" r="46" stroke="#0ea5e9" strokeWidth="7" fill="none" 
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - user.healthRiskScore/100)}`}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-mono font-extrabold text-white">{user.healthRiskScore}</span>
                <span className="text-[9px] text-slate-500 font-mono block">/ 100</span>
              </div>
            </div>

            {/* Assessment classification and improvements indicators */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="bg-emerald-950/40 border border-emerald-900 inline-block px-3 py-1 rounded-full text-emerald-400 text-[9px] font-bold uppercase tracking-wider font-mono">
                Moderate Risk
              </div>
              <div className="text-xs text-emerald-400 font-mono font-semibold flex items-center justify-center sm:justify-start space-x-1">
                <span>📈 4% Improvement</span>
              </div>
              <p className="text-[10px] text-slate-400 max-w-[160px] leading-normal">
                Cardiovascular resilience remains secure. Priority focus directed on sleep habits.
              </p>
            </div>
          </div>

          {/* Substats block: Heart, Hydration, Recovery metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#233c42]/30 text-center">
            <div>
              <span className="text-[8.5px] uppercase font-mono tracking-wider text-slate-500 block">Heart</span>
              <span className="text-xs font-bold text-white font-mono">78%</span>
            </div>
            <div>
              <span className="text-[8.5px] uppercase font-mono tracking-wider text-slate-500 block">Hydration</span>
              <span className="text-xs font-bold text-white font-mono">82%</span>
            </div>
            <div>
              <span className="text-[8.5px] uppercase font-mono tracking-wider text-slate-500 block">Recovery</span>
              <span className="text-xs font-bold text-white font-mono">76%</span>
            </div>
          </div>
        </div>

        {/* Module B: Face Scan Biomakers banner with green pulse ● LIVE DATA label and 8-grid list */}
        <div id="biomarkers-grid-card" className="bg-[#122226]/80 p-5 rounded-3xl border border-[#233c42]/35 space-y-4">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-xs uppercase font-serif font-bold text-white tracking-wide">Face Scan Biomarkers</h3>
            <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Live Data</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {biomarkers.map((bio) => {
              return (
                <div key={bio.id} className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-900 flex flex-col justify-between h-[68px]">
                  <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider font-sans">{bio.name}</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-xs font-bold text-slate-100 font-mono">{bio.value}</span>
                    <span className={`text-[8.5px] font-semibold tracking-wide font-mono px-1 rounded-sm bg-slate-950/50 uppercase ${bio.color}`}>
                      {bio.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module C: Diabetes Risk block representation */}
        <div id="diabetes-risk-card" className="bg-[#122226]/80 p-5 rounded-3xl border border-[#233c42]/35 space-y-3.5">
          <div className="flex justify-between items-baseline">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Diabetes Assessment</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-[#11bcf2] font-mono">68</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="bg-yellow-950/50 border border-yellow-800 text-yellow-400 px-2.5 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider">
                Prediabetic
              </span>
              <span className="text-[8px] text-slate-500 font-mono block">HRA Score: Medium Risk</span>
            </div>
          </div>

          {/* Slider track line representing 68/100 */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Module D: GOQii AI Coach Insights Banner with focus accent line */}
        <div id="coach-insights-card" className="bg-[#122226]/85 p-5 rounded-3xl border border-[#233c42]/35 space-y-3">
          <h4 className="text-xs font-serif font-bold text-emerald-400 tracking-wide">GOQii AI Insights</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
            Your data indicates <strong className="text-emerald-300 font-bold">improving sleep quality and glucose control</strong> can significantly reduce chronic cardiovascular and diabetes risks by up to 15%.
          </p>

          <div className="bg-cyan-950/30 border border-cyan-500/20 px-3.5 py-2.5 rounded-2xl text-[10px] text-cyan-300 font-mono font-semibold flex items-center space-x-2">
            <span>💡 Priority Focus: Sleep + Glucose Management</span>
          </div>
        </div>

        {/* Module E: Lab Reports list */}
        <div id="reports-card" className="bg-[#122226]/80 p-5 rounded-3xl border border-[#233c42]/35 space-y-3.5">
          <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Uploaded Lab Reports</span>
          
          <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-slate-900 text-cyan-400 rounded-xl">
                <FileText size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold font-sans text-slate-300">HbA1c & Lipid Profile</h5>
                <span className="text-[8px] text-slate-500 font-mono">Captured: 1 Month Ago</span>
              </div>
            </div>

            <button className="p-2 bg-slate-900 text-slate-500 hover:text-white rounded-lg transition-all">
              <Eye size={13} />
            </button>
          </div>

          <button className="w-full py-2.5 border border-slate-800 hover:border-emerald-500/30 font-mono text-[10px] uppercase font-bold tracking-wider text-slate-300 hover:text-white rounded-xl bg-slate-950/20 hover:bg-slate-950/50 transition">
            View All Reports
          </button>
        </div>

        {/* Module F: Client Assigned Coach Support info box */}
        <div id="coach-referral-card" className="bg-[#122226]/90 p-4.5 rounded-3xl border border-[#233c42]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Coach Support avatar photo */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full border border-emerald-400 overflow-hidden bg-slate-800 shadow">
                <img 
                  src="/src/assets/images/coach_portrait_1781860051703.jpg" 
                  alt="Specialist Coach Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-[#122226] rounded-full"></span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-1">
                <h4 className="text-xs font-bold text-white font-sans">Ananya Deshmukh</h4>
                <span className="bg-emerald-400/20 text-[#10b981] text-[7.5px] font-mono font-bold px-1 rounded-sm select-none">COACH</span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono block">Assigned Support: YES</span>
            </div>
          </div>

          {/* Quick interaction stats */}
          <div className="text-right text-[10/11px] space-y-1.5 pl-2">
            <div>
              <span className="text-[8px] text-slate-500 font-mono uppercase block">Last active</span>
              <span className="text-[10px] font-bold text-slate-300 font-mono">2 Days Ago</span>
            </div>
          </div>
        </div>

        {/* Primary Screen Actions row: Talk to Coach & Download PDF Report */}
        <div className="pt-2 space-y-2">
          <button 
            id="talk-to-coach-btn"
            onClick={onLaunchChat}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-2xl hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/15 cursor-pointer"
          >
            <span>Talk to Coach</span>
          </button>

          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full py-3 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-white font-mono text-[10px] uppercase font-extrabold tracking-wider bg-slate-950/20 hover:bg-slate-950/50 rounded-2xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Download size={12} className={downloading ? 'animate-bounce' : ''} />
            <span>{downloading ? 'Compiling Report...' : 'Download PDF Report'}</span>
          </button>
        </div>

      </main>
    </div>
  );
}
