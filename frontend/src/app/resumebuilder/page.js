'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';

export default function ResumeBuilder() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the Intelligence Era of Career Growth. I am your Gemini-powered architect. Shall we begin by defining your target role?' }
  ]);
  const [input, setInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    // Simulate AI extraction logic
    setTimeout(() => {
      const mockData = {
        name: "Pro Candidate",
        title: "Senior AI Engineer",
        summary: "Extracted from your chat: Expert in neural synthesis and career architecture.",
        experience: "Lead Architect · ResumeX (2024-Present)\n• Orchestrated real-time career data flows.",
        projects: "Neural Resume Builder — Built during this chat.",
        skills: "Gemini, React, Next.js, Strategic Narrative"
      };
      localStorage.setItem('compiled_resume', JSON.stringify(mockData));
      setIsSynthesizing(false);
      setIsComplete(true);
    }, 2000);
  };

  return (
    <div className="w-full h-full p-10 flex flex-col min-h-screen">
        <header className="mb-12 shrink-0">
          <div className="text-[10px] font-black text-[#8b5e34] uppercase tracking-[0.4em] mb-3">Module — AI Architect</div>
          <h1 className="text-5xl font-bold text-[#2d2d2d] font-heading tracking-tighter leading-none">Resume Builder</h1>
          <p className="text-[#737373] text-lg font-medium mt-3">Synthesize your professional narrative via intelligent dialogue</p>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-12 gap-10">
          {/* Chat Interface */}
          <div className="col-span-12 lg:col-span-7 flex flex-col bg-white border border-[#e5e0d8] rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#1a1a18] p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#e8c547] shadow-[0_0_8px_#e8c547]" />
                <span className="text-[#f0ede6] text-[10px] font-black uppercase tracking-widest">Gemini Neural Interface</span>
              </div>
              <div className="text-[8px] font-black text-[#737373] uppercase tracking-widest">Latency: 24ms</div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-[#f5f2ed]">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-6 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#8b5e34] text-white rounded-tr-none' 
                      : 'bg-[#fdfbf9] border border-[#e5e0d8] text-[#2d2d2d] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-[#fdfbf9] border-t border-[#e5e0d8] shrink-0">
              <div className="relative">
                <input 
                  className="w-full bg-white border border-[#e5e0d8] rounded-xl h-14 pl-6 pr-32 text-sm font-medium focus:ring-2 focus:ring-[#8b5e34]/20 focus:border-[#8b5e34] outline-none transition-all shadow-inner"
                  placeholder="Describe your career milestones..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: 'I am analyzing that milestone now. Let\'s integrate it into your profile.' }]);
                      setInput('');
                    }
                  }}
                />
                <button 
                  onClick={handleSynthesize}
                  disabled={isSynthesizing}
                  className="absolute right-2 top-2 h-10 px-6 bg-[#2d2d2d] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSynthesizing ? 'Analyzing...' : 'Synthesize'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions / Stats */}
          <div className="col-span-12 lg:col-span-5 space-y-8 h-full overflow-y-auto pb-10">
            <GlassCard className="bg-white/80 border-[#e5e0d8]">
              <div className="text-[9px] font-black text-[#8b5e34] uppercase tracking-widest mb-6">Execution Path</div>
              <div className="space-y-4">
                {[
                  { label: 'Role Definition', status: 'active' },
                  { label: 'Asset Synchronization', status: 'pending' },
                  { label: 'Semantic Generation', status: 'pending' },
                  { label: 'High-Fidelity Preview', status: 'pending' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'active' ? 'bg-[#8b5e34]' : 'bg-[#e5e0d8]'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'active' ? 'text-[#2d2d2d]' : 'text-[#a3a3a3]'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="bg-[#1a1a18] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold font-heading mb-4 leading-tight">Switch to Pro Editor</h4>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">Prefer manual control? Use our precision-engineered layout studio.</p>
                <Link 
                  href="/resumecompiler" 
                  className={`inline-block px-10 py-4 bg-[#8b5e34] text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-xl shadow-[#8b5e34]/20 ${!isComplete ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isComplete ? 'Open Compiler' : 'Synthesize First'}
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5e34] opacity-20 blur-[60px] group-hover:opacity-40 transition-opacity" />
            </div>
          </div>
        </div>
    </div>
  );
}
