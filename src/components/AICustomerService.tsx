'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] + useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya asisten virtual PT. Indo Jaya Gram. Ceritakan sedikit tentang proyek atau kebutuhan Anda, dan saya akan bantu arahkan solusinya.' }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0); // 0: initial, 1: discussed project, 2: asked contact
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const iceBreakers = [
    'Pembuatan Website & Web App',
    'Automasi AI & Agent Systems',
    'Payment Gateway Integration',
    'Infrastruktur Cloud & DevOps'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text || !text.trim()) return;
    
    const userText = text.trim();
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      let reply = "";
      if (step === 0) {
        reply = `Pilihan yang sangat tepat! Untuk ${userText}, tim expert kami di Indo Jaya Gram siap mengeksekusinya dengan standar performa tertinggi. Apakah ada skala timeline atau target khusus untuk proyek ini?`;
        setStep(1);
      } else if (step === 1) {
        reply = "Baik, catatan untuk timeline sudah saya simpan. Agar tim senior kami bisa mengirimkan proposal teknis dan estimasi anggaran yang akurat, boleh saya minta nomor WhatsApp atau email Bapak/Ibu?";
        setStep(2);
      } else {
        reply = "Terima kasih banyak! Kontak Anda sudah kami terima dan masuk ke prioritas antrean. Tim kami akan segera menghubungi Anda dalam waktu kurang dari 1 jam. Ada hal lain yang ingin didiskusikan?";
        setStep(3);
      }

      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-2xl hover:border-cyan-500 transition-all cursor-pointer"
        >
          <span className="text-xl mr-2.5">💬</span>
          <span className="text-slate-200 text-sm font-medium mr-2.5">Konsultasi AI</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </button>
      ) : (
        <div className="w-[380px] h-[560px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/40">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-semibold text-white tracking-wide">Konsultan AI Indo Jaya Gram</span>
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
            
            {messages.length === 1 && (
              <div className="grid grid-cols-1 gap-2 pt-2">
                {iceBreakers.map((b, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(b)} 
                    className="text-left text-xs bg-slate-900/90 border border-slate-800 text-cyan-300 p-3 rounded-xl hover:border-cyan-500 hover:bg-slate-900 transition cursor-pointer font-medium"
                  >
                    ⚡ {b}
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
                placeholder="Ketik balasan atau kebutuhan Anda..."
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-4 pr-12 py-3 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
              />
              <button 
                onClick={() => handleSend(input)} 
                className="absolute right-1.5 p-2 bg-cyan-500 rounded-full hover:bg-cyan-400 transition cursor-pointer"
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
