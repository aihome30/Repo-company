'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya asisten AI PT. Indo Jaya Gram. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const iceBreakers = [
    'Saya mau bikin website baru',
    'Ingin tanya soal otomatisasi AI',
    'Kerjasama sistem pembayaran',
    'Konsultasi infrastruktur cloud'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    const userMsg = text;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Menarik sekali! ' + userMsg + '. Saya akan bantu siapkan perencanaannya. Boleh saya tahu kontak WhatsApp atau email Anda agar tim kami bisa mengirimkan proposal ringkasnya?' 
      }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-4 bg-cyan-500 rounded-full shadow-2xl hover:scale-105 transition hover:bg-cyan-400 flex items-center space-x-2"
        >
          <span className="text-xl">💬</span>
          <span className="text-slate-950 font-bold text-xs pr-1">Konsultasi AI</span>
        </button>
      )}
      
      {isOpen && (
        <div className="w-[350px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <span className="font-bold text-sm text-cyan-400">Asisten AI Indo Jaya Gram</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {/* Ice Breaker Buttons */}
            {messages.length === 1 && (
              <div className="grid grid-cols-1 gap-2 mt-4">
                {iceBreakers.map((b, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(b)}
                    className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 p-3 rounded-xl border border-slate-700 transition"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex space-x-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Atau tulis pesan sendiri..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button onClick={() => handleSend()} className="bg-cyan-500 text-slate-950 px-4 rounded-lg font-bold text-sm">Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
