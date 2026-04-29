'use client';
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI Resume Assistant. How can I help you refine your resume today?' }
  ]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/chat/sessions');
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions');
    }
  };

  const switchSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      const { data } = await api.get(`/chat/${sessionId}`);
      setMessages(data.map(m => ({ role: m.role === 'user' ? 'user' : 'bot', text: m.content })));
    } catch (error) {
      toast.error('Failed to load history');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: input, sessionId: currentSessionId });
      const botMessage = { role: 'bot', text: response.data.result };
      setMessages(prev => [...prev, botMessage]);
      
      if (!currentSessionId) {
        setCurrentSessionId(response.data.sessionId);
        fetchSessions();
      }
    } catch (error) {
      const errorMessage = { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[650px] max-w-5xl mx-auto w-full bg-[#ffffff] border border-[#e5e0d8] rounded-2xl overflow-hidden shadow-xl">
      {/* Sessions Sidebar */}
      <div className="w-64 border-r border-[#f5f2ed] bg-[#fdfbf9] flex flex-col">
        <div className="p-4 border-b border-[#f5f2ed] font-bold text-[10px] uppercase tracking-widest text-[#8b5e34]">
          History
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button 
            onClick={() => { setMessages([{ role: 'bot', text: 'New session started.' }]); setCurrentSessionId(null); }}
            className="w-full text-left p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[#8b5e34]/10 text-[#8b5e34]"
          >
            + New Chat
          </button>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => switchSession(s.id)}
              className={`w-full text-left p-3 rounded-lg text-[10px] font-medium truncate border ${
                currentSessionId === s.id ? 'border-[#8b5e34] bg-[#8b5e34]/5 text-[#8b5e34]' : 'border-transparent text-[#737373] hover:bg-slate-50'
              }`}
            >
              {s.title || 'Untitled Session'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#f5f2ed] flex items-center justify-between bg-[#fdfbf9]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#8b5e34] flex items-center justify-center font-bold text-white shadow-md text-sm">
            AI
          </div>
          <div>
            <h3 className="font-bold text-[#2d2d2d] font-heading">Assistant</h3>
            <div className="flex items-center gap-2 text-[10px] text-[#8b5e34] uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5e34]" />
              System Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#e5e0d8] bg-[#fdfbf9]/30"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#8b5e34] text-white rounded-tr-none font-medium' 
                : 'bg-white text-[#2d2d2d] border border-[#e5e0d8] rounded-tl-none'
            }`}>
              <div className={`text-[10px] font-bold uppercase opacity-60 mb-2 tracking-widest ${msg.role === 'user' ? 'text-white/80' : 'text-[#8b5e34]'}`}>
                {msg.role === 'user' ? 'Client' : 'Assistant'}
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#e5e0d8] text-[#8b5e34] px-5 py-4 rounded-2xl text-[10px] font-bold animate-pulse uppercase tracking-widest rounded-tl-none">
              Analyzing query...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-[#f5f2ed] bg-white">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your instruction..."
            className="flex-1 bg-[#fdfbf9] border border-[#e5e0d8] rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#8b5e34] transition-colors text-[#2d2d2d] placeholder-[#a3a3a3]"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-8 rounded-xl bg-[#8b5e34] text-white font-bold text-xs hover:bg-[#7a522d] disabled:opacity-50 transition-all uppercase tracking-widest shadow-md"
          >
            Send
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
