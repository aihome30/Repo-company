'use client';

import { useState, useRef, useEffect } from 'react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['harga', 'biaya', 'paket', 'starter', 'pro', 'enterprise', 'murah'],
    answer: `wspend menyediakan 3 paket utama untuk pasar Indonesia:
1. Starter UMKM: Rp 2.5 Juta (Landing page & profil bisnis)
2. Startup Pro: Rp 7.5 Juta (Multi-page & Custom Backend API)
3. Enterprise/Custom: Rp 15 Juta+ (Sistem skala besar & AI Agents).`
  },
  {
    keywords: ['layanan', 'jasa', 'produk', 'buat website', 'bikin web', 'api', 'devops', 'ai agent'],
    answer: `Layanan utama wspend meliputi:
- Pembuatan Website & Landing Page (Mulai Rp 2.5 Juta)
- Pengembangan Sistem & API Backend (Mulai Rp 5 Juta)
- Automasi & AI Agent Bisnis (Mulai Rp 7.5 Juta)
- DevOps & Cloud Deployment (Mulai Rp 4 Juta)`
  },
  {
    keywords: ['kontak', 'hubungi', 'whatsapp', 'email', 'pesan', 'order', 'pesan jasa'],
    answer: `Anda dapat menghubungi tim wspend melalui halaman Kontak di website ini atau langsung konsultasi gratis dengan mengisi formulir penawaran di menu Contact.`
  },
  {
    keywords: ['wspend', 'siapa', 'perusahaan', 'tentang'],
    answer: `wspend adalah agensi digital dan pengembang solusi software serta AI agent profesional di Indonesia yang berfokus pada efisiensi dan pertumbuhan bisnis UMKM hingga startup.`
  }
];

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI wspend. Ada yang ingin Anda tanyakan seputar produk, layanan, atau harga kami?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      
      // Strict guardrail: only answer questions about wspend products/services/pricing.
      // Reject coding, homework, general chat, weather, politics, etc.
      const forbidden = ['coding', 'python', 'javascript', 'html', 'css', 'resep', 'cuaca', 'politik', 'buatkan game', 'tulis kode', 'program'];
      if (forbidden.some(word => lower.includes(word))) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Maaf, saya adalah Asisten AI wspend yang khusus membantu menjelaskan produk, layanan, dan informasi seputar wspend saja. Saya tidak dapat menulis kode, membuat program, atau membahas hal di luar produk kami.'
        }]);
        setLoading(false);
        return;
      }

      let reply = "Terima kasih atas pertanyaannya! wspend berfokus menyediakan solusi pembuatan website, sistem API, dan AI Agent untuk bisnis Anda. Untuk informasi lebih detail mengenai produk kami, silakan cek menu Layanan atau hubungi tim kami via halaman Kontak.";

      for (const kb of KNOWLEDGE_BASE) {
        if (kb.keywords.some(kw => lower.includes(kw))) {
          reply = kb.answer;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 font-semibold border border-blue-400/30"
          aria-label="Chat with AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          💬 Tanya AI wspend
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div>
                <h4 className="font-bold text-white text-sm">Asisten Produk wspend</h4>
                <p className="text-[10px] text-slate-400">Online • Khusus Info Produk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              &#10005;
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-sm">
                  Mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tanya seputar produk wspend..."
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
