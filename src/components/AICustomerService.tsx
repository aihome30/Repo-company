'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya AI Konsultan Indo Jaya Gram. Ada yang ingin kita bangun atau otomasi hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const iceBreakers = [
    'Bikin website agency',
    'Automasi AI Enterprise',
    'Integrasi Payment Gateway',
    'Setup Cloud Datacenter'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAssistantResponse = (userText: string) => {
    const text = userText.toLowerCase();
    if (text.includes('website')) return 'Web modern dengan performa tinggi? Siap, kami ahli di Next.js & AI-integration. Mari kita rencanakan. Boleh saya tahu email/WA Anda?';
    if (text.includes('ai') || text.includes('otomasi')) return 'Otomasi AI adalah spesialisasi kami. Kami bisa buat sistem agen AI yang bekerja 24/7. Ada detail khusus yang ingin ditanyakan?';
    if (text.includes('payment')) return 'Integrasi Payment Gateway (Xendit/Midtrans) akan kami buat aman & seamless. Mari kita bahas integrasinya lebih detail.';
    return 'Terima kasih informasinya. Apakah ada detail lain, atau boleh saya minta kontak (email/WA) agar tim kami bisa mengirimkan draf rencana proyeknya?';
  };

  const handleSend = useCallback((text: string) => {
    if (!text || text.trim() === '') return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: getAssistantResponse(text)
      }]);
    }, 600);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl hover:border-cyan-500 transition-all cursor-pointer"
        >
          <span className="text-xl mr-3">⚡</span>
          <span className="text-slate-200 text-sm font-medium mr-3">Tanya AI</span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        </button>
      ) : (
        <div className="w-[360px] h-[550px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-5 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-sm font-semibold text-white tracking-wide">Konsultasi Indo Jaya</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition">✕</button>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] max-w-[85%] ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-medium' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {iceBreakers.map((b, i) => (
                  <button key={i} onClick={() => handleSend(b)} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 p-3 rounded-xl hover:border-cyan-500 hover:text-cyan-400 transition cursor-pointer">
                    {b}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-900 bg-slate-950">
            <div className="relative flex items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Tulis pesan..."
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-5 pr-12 py-3 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
              />
              <button onClick={() => handleSend(input)} className="absolute right-2 p-1.5 bg-cyan-500 rounded-full hover:bg-cyan-400 transition cursor-pointer">
                <span className="text-[10px] text-slate-950 font-bold">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
