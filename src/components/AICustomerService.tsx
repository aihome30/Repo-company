'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya Maya, CS Executive PT. Indo Jaya Gram. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const iceBreakers = [
    'Konsultasi pembuatan website',
    'Automasi sistem & AI',
    'Integrasi pembayaran Xendit',
    'Tanya estimasi harga'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text || !text.trim() || loading) return;
    
    const userText = text.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages })
      });
      const data = await res.json();
      
      if (data.success) {
        const assistantMsg: Message = { role: 'assistant', content: data.reply };
        setMessages([...newMessages, assistantMsg]);
        try {
          const newTicket = {
            id: `TICK-${Date.now().toString().slice(-3)}`,
            clientName: 'Konsultasi Chat AI',
            service: 'Konsultasi AI',
            message: userText,
            status: 'New',
            time: 'Baru saja'
          };
          const saved = localStorage.getItem('indojaya_tickets');
          const tickets = saved ? JSON.parse(saved) : [];
          localStorage.setItem('indojaya_tickets', JSON.stringify([newTicket, ...tickets]));
        } catch { /* abaikan bila storage penuh */ }
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Maaf, terjadi kendala koneksi. Silakan coba lagi.' }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Mohon maaf, sistem sedang sibuk. Silakan hubungi kami via halaman Contact.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-2xl hover:border-cyan-500 transition-all cursor-pointer"
        >
          <span className="text-xl mr-2.5">👩‍💻</span>
          <div className="text-left mr-2.5">
            <div className="text-xs font-bold text-white">Maya (CS AI)</div>
            <div className="text-[10px] text-emerald-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span> Online 24/7</div>
          </div>
        </button>
      ) : (
        <div className="w-[380px] h-[580px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                M
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Maya — CS Executive</div>
                <div className="text-[10px] text-emerald-400">PT. Indo Jaya Gram AI Employee</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-semibold rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 text-slate-400 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs animate-pulse">
                  Maya sedang mengetik...
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="grid grid-cols-1 gap-2 pt-2">
                {iceBreakers.map((b, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(b)} 
                    className="text-left text-xs bg-slate-900/90 border border-slate-800 text-cyan-300 p-3 rounded-xl hover:border-cyan-500 hover:bg-slate-900 transition cursor-pointer font-medium"
                  >
                    💬 {b}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-900 bg-slate-950">
            <div className="relative flex items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ketik pesan untuk Maya..."
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-4 pr-12 py-3 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
              />
              <button 
                onClick={() => handleSend(input)} 
                disabled={loading}
                className="absolute right-1.5 p-2 bg-cyan-500 rounded-full hover:bg-cyan-400 transition cursor-pointer disabled:opacity-50"
              >
                <span className="text-[10px] text-slate-950 font-bold">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
