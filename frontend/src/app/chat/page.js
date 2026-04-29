'use client';
import Chatbot from '@/components/Chatbot';

export default function ChatPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto h-screen flex flex-col">
      <header className="mb-12 shrink-0">
        <div className="text-[10px] font-bold text-[#8b5e34] uppercase tracking-[0.3em] mb-3">Communication</div>
        <h1 className="text-4xl font-bold text-[#2d2d2d] font-heading tracking-tight">AI Assistant</h1>
        <p className="text-[#737373] text-base font-medium mt-2">
          Collaborate with our intelligence engine to refine your professional narrative
        </p>
      </header>

      <div className="flex-1 flex items-center justify-center pb-12">
        <Chatbot />
      </div>
    </div>
  );
}
