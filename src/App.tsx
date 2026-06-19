import React, { useState } from 'react';
import { UserProfile, MetricData } from './types';
import Dashboard from './components/Dashboard';
import TrackerModal from './components/TrackerModal';
import HealthAssessments from './components/HealthAssessments';
import HRAScreening from './components/HRAScreening';
import FaceScanSimulator from './components/FaceScanSimulator';
import FaceVitalReport from './components/FaceVitalReport';
import CoachChat from './components/CoachChat';

export default function App() {
  
  // 1. Core Profile States representing Ashit Jagannath Amin
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ashit',
    fullName: 'Ashit Jagannath Amin',
    ageYears: 35,
    ageMonths: 5,
    quote: 'Remain calm, because peace equals power.',
    healthRiskScore: 72,
    riskCategory: 'MODERATE RISK'
  });

  // 2. Reactive Metrics Array representing the widget grids
  const [metrics, setMetrics] = useState<MetricData[]>([
    { id: 'steps', name: 'Steps', current: 4443, target: 5000, unit: 'steps' },
    { id: 'hydration', name: 'Hydration', current: 1.3, target: 3.0, unit: 'L' },
    { id: 'sleep', name: 'Sleep', current: 444, target: 480, unit: 'mins' }, // 7h 24m of 8h
    { id: 'nutrition', name: 'Nutrition', current: 0, target: 3010, unit: 'kcal' },
    { id: 'activity', name: 'Activity', current: 45, target: 60, unit: 'mins' }, // 45m workout preloaded
    { id: 'weight', name: 'Weight', current: 76, target: 70, unit: 'kg' }
  ]);

  // 3. Navigation & Sub-Modes state management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessments' | 'report'>('dashboard');
  const [subMode, setSubMode] = useState<'none' | 'tracker_modal' | 'hra_wizard' | 'face_scanner' | 'coach_chat'>('none');

  // Multi-purpose state adjustment for physical, fluid logs, weight alterations
  const handleUpdateMetric = (id: string, amount: number, absolute: boolean = false) => {
    setMetrics((prev) => {
      return prev.map((m) => {
        if (m.id === id) {
          const newCurrent = absolute ? amount : m.current + amount;
          return { ...m, current: Math.max(0, parseFloat(newCurrent.toFixed(2))) };
        }
        return m;
      });
    });
  };

  // Callback when interactive HRA completes
  const handleHRASubmit = (score: number, category: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK') => {
    setProfile(prev => ({
      ...prev,
      healthRiskScore: score,
      riskCategory: category
    }));
    setSubMode('none');
    setActiveTab('report'); // take directly to report showing findings
  };

  // Navigational helpers
  const handleNavigateToTab = (tab: 'dashboard' | 'assessments' | 'report') => {
    setActiveTab(tab);
    setSubMode('none');
  };

  return (
    <div id="goqii-companion-root" className="min-h-screen bg-[#071418] max-w-lg mx-auto shadow-2xl relative">
      {/* 4. Overlay & Submodes display routing prioritizations */}
      {subMode === 'tracker_modal' && (
        <TrackerModal
          onClose={() => setSubMode('none')}
          onUpdateMetric={handleUpdateMetric}
          onNavigateToTab={handleNavigateToTab}
        />
      )}

      {subMode === 'hra_wizard' && (
        <HRAScreening
          onBack={() => setSubMode('none')}
          onSubmitAssessment={handleHRASubmit}
        />
      )}

      {subMode === 'face_scanner' && (
        <FaceScanSimulator
          onCancel={() => setSubMode('none')}
          onScanComplete={() => {
            setSubMode('none');
            setActiveTab('report');
          }}
        />
      )}

      {subMode === 'coach_chat' && (
        <CoachChat
          onBack={() => setSubMode('none')}
          vitalsContext={{
            riskScore: profile.healthRiskScore,
            riskCategory: profile.riskCategory,
            metricsSummary: metrics.map(m => `${m.name}: ${m.current}/${m.target} ${m.unit}`).join(', ')
          }}
        />
      )}

      {/* Main Tab/View layouts */}
      {subMode === 'none' && (
        <>
          {activeTab === 'dashboard' && (
            <Dashboard
              user={profile}
              metrics={metrics}
              onOpenTracker={() => setSubMode('tracker_modal')}
              onNavigateToTab={handleNavigateToTab}
              selectedDate="Wednesday 17 Jun"
            />
          )}

          {activeTab === 'assessments' && (
            <HealthAssessments
              onBack={() => setActiveTab('dashboard')}
              onLaunchHRA={() => setSubMode('hra_wizard')}
              onLaunchFaceScan={() => setSubMode('face_scanner')}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === 'report' && (
            <FaceVitalReport
              user={profile}
              onBack={() => setActiveTab('dashboard')}
              onLaunchChat={() => setSubMode('coach_chat')}
            />
          )}

          {/* Persistent global Navigation dock styled exactly to the design matches Screen layout */}
          <nav id="persistent-bottom-navbar" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#122226]/95 border-t border-[#233c42]/40 py-3 px-6 flex justify-around items-center z-30 backdrop-blur-md rounded-t-3xl">
            <button
              onClick={() => handleNavigateToTab('dashboard')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className={`text-[10px] uppercase font-mono font-bold tracking-widest`}>Companion</span>
            </button>

            <button
              onClick={() => handleNavigateToTab('assessments')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'assessments' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className={`text-[10px] uppercase font-mono font-bold tracking-widest`}>Assess</span>
            </button>

            <button
              onClick={() => handleNavigateToTab('report')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'report' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className={`text-[10px] uppercase font-mono font-bold tracking-widest`}>Vitals</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
