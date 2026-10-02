'use client';

import { useState, useRef, useEffect } from 'react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['harga', 'biaya', 'paket', 'starter', 'pro', 'enterprise', 'murah', 'tarif'],
    answer: `wspend menyediakan 3 paket utama yang ramah untuk UMKM & Startup di Indonesia:
1. **Starter UMKM (Rp 2.5 Juta):** Cocok untuk landing page, profil bisnis, dan SEO dasar.
2. **Startup Pro (Rp 7.5 Juta):** Solusi lengkap multi-page, backend API, & database.
3. **Enterprise / Custom (Rp 15 Juta+):** Sistem skala besar, AI agents, & DevOps penuh.`
  },
  {
    keywords: ['layanan', 'jasa', 'produk', 'buat website', 'bikin web', 'api', 'devops', 'ai agent', 'solusi'],
    answer: `Layanan unggulan wspend meliputi:
- **Pembuatan Website & Landing Page** (Mulai Rp 2.5 Juta)
- **Pengembangan Sistem & API Backend** (Mulai Rp 5 Juta)
- **Automasi & AI Agent Bisnis** (Mulai Rp 7.5 Juta)
- **DevOps & Cloud Deployment** (Mulai Rp 4 Juta)`
  },
  {
    keywords: ['kontak', 'hubungi', 'whatsapp', 'email', 'pesan', 'order', 'pesan jasa', 'konsultasi'],
    answer: `Anda dapat langsung berkonsultasi secara gratis dengan tim kami melalui menu **Contact** di atas, atau mengirimkan detail kebutuhan proyek Anda ke email kami.`
  },
  {
    keywords: ['wspend', 'siapa', 'perusahaan', 'tentang', 'about'],
    answer: `**wspend** adalah agensi digital & software house profesional di Indonesia yang berfokus pada pengembangan web berkecepatan tinggi, integrasi API, dan automasi AI untuk mengakselerasi bisnis Anda.`
  }
];

const SUGGESTIONS = [
  "Berapa harga paket?",
  "Apa saja layanan wspend?",
  "Bagaimana cara konsultasi?",
  "Apa keunggulan wspend?"
];

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! 👋 Selamat datang di wspend. Saya Asisten AI produk kami. Ada yang ingin Anda ketahui seputar layanan atau harga kami?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      
      const forbidden = ['coding', 'python', 'javascript', 'html', 'css', 'resep', 'cuaca', 'politik', 'buatkan game', 'tulis kode', 'program', 'nyanyi'];
      if (forbidden.some(word => lower.includes(word))) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Maaf 🙏 Saya adalah Asisten AI wspend yang khusus membantu menjelaskan produk, layanan, dan informasi seputar wspend saja. Saya tidak dapat menulis kode atau membahas hal di luar produk kami.'
        }]);
        setLoading(false);
        return;
      }

      let reply = "Terima kasih atas pertanyaannya! wspend berfokus menyediakan solusi pembuatan website, sistem API, dan AI Agent untuk bisnis Anda. Ada hal spesifik tentang produk kami yang ingin Anda tanyakan?";

      for (const kb of KNOWLEDGE_BASE) {
        if (kb.keywords.some(kw => lower.includes(kw))) {
          reply = kb.answer;
          break;
        }
      }

      if (lower.includes('keunggulan') || lower.includes('kenapa')) {
        reply = `Keunggulan wspend:
1. Harga transparan & ramah UMKM Indonesia
2. Pengerjaan cepat & tepat
3. Didukung teknologi modern & AI agents
4. Bergaransi & berfokus pada hasil bisnis.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 font-bold border border-blue-400/30 animate-bounce hover:animate-none"
          aria-label="Chat with AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
          💬 Tanya AI wspend
        </button>
      )}

      {isOpen && (
        <div className="w-85 sm:w-96 h-[540px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Asisten Produk wspend</h4>
                <p className="text-[11px] text-slate-400">Interaktif • Tanya apa saja soal produk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              &#10005;
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                      : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.2s]"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.4s]"></span>
                  Asisten sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((sug, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Tanya seputar produk wspend..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/30"
            >
              Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
