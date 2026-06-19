import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface CoachChatProps {
  onBack: () => void;
  vitalsContext?: {
    riskScore: number;
    riskCategory: string;
    metricsSummary: string;
  };
}

export default function CoachChat({ onBack, vitalsContext }: CoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'coach',
      text: "Hi Ashit! I'm your dedicated GOQii Health Coach. I have reviewed your overall Health Risk Score (72/100) and your recent Face Scan biometrics showing Moderate stress levels.\n\nMy priority is helping you address your Sleep Quality (78%) and Glucose Management to optimal levels. What can I help guide you on today? E.g., nutritional plans, stress reduction routines, or sleep targets?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send user message to Express API proxy running on server-side
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          vitals: vitalsContext || {
            riskScore: 72,
            riskCategory: 'MODERATE RISK',
            metricsSummary: 'Steps: 4,443/5,000, sleep quality: 78%, fatigue risk: low, cardio risk: moderate'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve chat response from advisor proxy');
      }

      const data = await response.json();
      const coachText = data.text || "I've reviewed your request. Let's start with a customized menu plan of rich fiber proteins today.";

      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: coachText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      // Fallback response if network or API key is not established in local environment
      const fallbackMsgs = [
        "That's a very good question, Ashit. Given your sleep is currently 7h 24m (target: 8h), prioritizing a consistent wind-down routine 45 mins before sleep can immediately decrease your Cardio stress markers.",
        "For glucose control, let's look at adding high-fiber additions to your daily Nutrition (e.g. oats, spinach, lentils) and getting in a quiet 15-minute post-meal walk.",
        "Your recent fatigue index is low, which is excellent! We can capitalize on this by slowly raising your workout loads to 1 hour daily."
      ];
      const randomFallback = fallbackMsgs[Math.floor(Math.random() * fallbackMsgs.length)];

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `coach-fallback-${Date.now()}`,
            sender: 'coach',
            text: randomFallback,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header bar matching the styling */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 border border-slate-900 bg-slate-900/40 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-emerald-400 overflow-hidden bg-slate-800">
              <img 
                src="/src/assets/images/coach_portrait_1781860051703.jpg" 
                alt="Coach Portrait" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-slate-950 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-xs font-bold text-white">Ananya Deshmukh</h3>
              <span className="bg-emerald-400/20 text-emerald-400 text-[8px] font-mono font-bold px-1 rounded">HEALTH COACH</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Replies in less than 1 min</span>
          </div>
        </div>

        {/* Vital status readout badge */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-900/50 border border-slate-850 px-2.5 py-1 rounded-xl">
          <Heart size={12} className="text-rose-400 fill-rose-500/20 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-300">Score: {vitalsContext?.riskScore || 72}/100</span>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start max-w-[85%] ${isCoach ? 'mr-auto space-x-2.5' : 'ml-auto space-x-reverse space-x-2.5 flex-row-reverse'}`}
            >
              {/* Avatar left/right */}
              {isCoach ? (
                <div className="w-7 h-7 rounded-full border border-emerald-500/30 overflow-hidden shrink-0">
                  <img 
                    src="/src/assets/images/coach_portrait_1781860051703.jpg" 
                    alt="Coach bubble avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border border-cyan-400/30 overflow-hidden bg-slate-900 shrink-0 flex">
                  <span className="text-[9.5px] uppercase font-mono font-bold m-auto text-cyan-300">AJ</span>
                </div>
              )}

              <div className="space-y-1">
                <div 
                  className={`px-4 py-3 text-xs leading-relaxed rounded-2xl whitespace-pre-wrap ${
                    isCoach 
                      ? 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none' 
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-[9px] font-mono text-slate-500 ${isCoach ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Loading Bubble */}
        {isLoading && (
          <div className="flex items-start space-x-2.5 mr-auto max-w-[85%]">
            <div className="w-7 h-7 rounded-full border border-emerald-500/30 overflow-hidden shrink-0">
              <img 
                src="/src/assets/images/coach_portrait_1781860051703.jpg" 
                alt="Coach bubble avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-md">
              <Sparkles size={11} className="text-emerald-400 animate-spin" />
              <span className="text-[10px] font-mono text-slate-400">Coach Ananya is typing...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/80 sticky bottom-0 z-10 w-full max-w-lg mx-auto">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Ask anything about your wellness plan..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 disabled:bg-slate-900 disabled:text-slate-600 transition-all cursor-pointer shadow-md"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
