import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, Shield, Sparkles } from 'lucide-react';

interface FaceScanSimulatorProps {
  onCancel: () => void;
  onScanComplete: () => void;
}

export default function FaceScanSimulator({ onCancel, onScanComplete }: FaceScanSimulatorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'requesting' | 'active' | 'denied' | 'simulated'>('requesting');
  const [progress, setProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Positioning face wireframe...');

  // Start video stream if possible
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 400, height: 400, facingMode: 'user' }
        });
        setStream(mediaStream);
        setCameraState('active');
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable, using high-fidelity vector simulator', err);
        setCameraState('simulated');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulator Progress increments
  useEffect(() => {
    const statusMessages = [
      'Positioning face wireframe...',
      'Mapping face scan coordinate grid (480 control points)...',
      'Assessing blood micro-circulation (Photoplethysmography)...',
      'Measuring heart rate fluctuation...',
      'Analyzing skin oil & visual hydration depth...',
      'Evaluating fatigue markers from ocular motion...',
      'Synthesizing biometric outputs...',
      'Securing diagnostic report...'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        
        // Select message based on progress ratio
        const msgIndex = Math.min(
          statusMessages.length - 1,
          Math.floor((next / 100) * statusMessages.length)
        );
        setScanStatusText(statusMessages[msgIndex]);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onScanComplete();
          }, 800);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onScanComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col justify-between p-4 z-50 text-slate-100 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto pt-4 px-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-cyan-400 animate-pulse" size={18} />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">GOQii FaceScan AI™</span>
        </div>
        <button 
          onClick={onCancel}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Camera Stage */}
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center items-center px-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-slate-900 bg-slate-950 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex justify-center items-center group">
          {/* Neon scan scanning line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 opacity-85 shadow-[0_0_15px_#22d3ee] animate-[bounce_3s_infinite] z-20"></div>

          {/* Biometric overlay concentric circles */}
          <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite] z-10 pointer-events-none"></div>
          <div className="absolute inset-10 rounded-full border border-dashed border-emerald-400/20 animate-[spin_30s_linear_infinite_reverse] z-10 pointer-events-none"></div>

          {/* Central camera capture */}
          {cameraState === 'active' ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover grayscale-55"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            /* Vector simulation placeholder */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 p-6 text-center">
              <div className="relative w-40 h-40 border border-slate-700/60 rounded-full flex flex-col items-center justify-center">
                <Camera size={44} className="text-slate-600 animate-pulse mb-3" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-semibold px-2">Biometric simulator</span>
                
                {/* Simulated Wireframe overlay */}
                <div className="absolute inset-0 border-2 border-emerald-400/20 rounded-full animate-ping scale-95 opacity-40"></div>
              </div>
            </div>
          )}

          {/* Pulsing focal targets */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 z-20"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 z-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 z-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 z-20"></div>

          {/* Core Telemetry labels inside scanner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/20 pointer-events-none z-20">
            <span className="text-[9px] font-mono font-semibold text-cyan-400 tracking-wider">LIVE SPECTRAL ENG</span>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/20 pointer-events-none z-20 flex items-center space-x-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping inline-block"></span>
            <span className="text-[9px] font-mono font-semibold text-emerald-400 tracking-wider">BETA: PHOTOPL-PPG</span>
          </div>
        </div>

        {/* Scan Status Console */}
        <div className="mt-8 bg-slate-950/60 p-5 rounded-2xl border border-slate-900 w-full max-w-sm space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">Progress: {progress}%</span>
              <span className="text-slate-500 font-semibold tracking-tight">ANALYZER CH: 0x9F</span>
            </div>
            {/* Loading track bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-cyan-400 h-full transition-all duration-100 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900 min-h-[48px] flex items-center">
            <span className="text-cyan-300">✔</span>&nbsp;{scanStatusText}
          </div>
        </div>
      </div>

      {/* Bottom Legal Notification */}
      <div className="w-full max-w-md mx-auto pb-4 px-4 flex items-center space-x-2 text-slate-500 font-mono text-[9px] justify-center">
        <Shield size={12} className="text-slate-600" />
        <span>Strict HIPAA Privacy Compliant — FaceScan does not store physical recordings.</span>
      </div>
    </div>
  );
}
