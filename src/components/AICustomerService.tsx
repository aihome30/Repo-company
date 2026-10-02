'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  suggestions?: string[];
}

export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Halo kak! 👋 Selamat datang di wspend. Mau cari tahu info seputar layanan atau harga pembuatan web kami?',
      suggestions: ['Daftar Harga Paket', 'Layanan wspend', 'Konsultasi Gratis']
    }
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
    setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMsg }]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase().trim();
      
      const forbidden = ['coding', 'python', 'javascript', 'html', 'css', 'resep', 'cuaca', 'politik', 'buatkan game', 'tulis kode', 'program', 'nyanyi', 'matematika', 'fisika'];
      if (forbidden.some(word => lower.includes(word))) {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: 'Wah, kalau itu di luar keahlian saya kak! 😅 Saya khusus bertugas sebagai Asisten Produk wspend untuk membantu menjelaskan layanan, harga, dan solusi digital kami. Ada info produk wspend yang ingin kakak tanyakan?',
          suggestions: ['Lihat Harga Paket', 'Layanan wspend', 'Hubungi Tim Kami']
        }]);
        setLoading(false);
        return;
      }

      let reply = "";
      let nextSuggestions = ['Lihat Harga Paket', 'Layanan wspend', 'Hubungi Tim Kami'];

      if (['hai', 'hallo', 'halo', 'pagi', 'siang', 'sore', 'malam', 'permisi', 'p'].some(greeting => lower.includes(greeting))) {
        reply = `Halo juga kak! 😊 Ada yang bisa saya bantu seputar layanan pembuatan website atau sistem digital di wspend?`;
        nextSuggestions = ['Daftar Harga Paket', 'Layanan wspend', 'Cara Order'];
      } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('paket') || lower.includes('starter') || lower.includes('pro')) {
        reply = `Tentu kak! wspend punya 3 pilihan paket terbaik yang sangat ramah untuk UMKM & Startup di Indonesia:\n\n1️⃣ **Starter UMKM (Rp 2.5 Juta)**\n• Landing page & profil bisnis\n\n2️⃣ **Startup Pro (Rp 7.5 Juta)**\n• Multi-page website & Backend API\n\n3️⃣ **Enterprise / Custom (Rp 15 Juta+)**\n• Sistem skala besar & AI Agent integration\n\nMau pilih paket yang mana nih kak?`;
        nextSuggestions = ['Pilih Starter UMKM', 'Pilih Startup Pro', 'Konsultasi Custom'];
      } else if (lower.includes('layanan') || lower.includes('jasa') || lower.includes('produk') || lower.includes('buat website') || lower.includes('bikin')) {
        reply = `Kami siap bantu percepat bisnis kakak dengan layanan profesional:\n\n🌐 **Pembuatan Website & Landing Page** (Mulai Rp 2.5 Juta)\n⚙️ **Pengembangan Sistem & API** (Mulai Rp 5 Juta)\n🤖 **Automasi & AI Agent Bisnis** (Mulai Rp 7.5 Juta)\n🚀 **DevOps & Cloud Deployment** (Mulai Rp 4 Juta)\n\nAda layanan yang menarik perhatian kakak?`;
        nextSuggestions = ['Berapa estimasi waktu?', 'Cara order layanan', 'Lihat Harga Paket'];
      } else if (lower.includes('konsultasi') || lower.includes('kontak') || lower.includes('hubungi') || lower.includes('order') || lower.includes('cara')) {
        reply = `Gampang banget kak! Kakak bisa langsung klik menu **Contact** di atas untuk mengisi formulir konsultasi gratis, atau ceritakan kebutuhan proyek kakak di sini nanti saya sampaikan langsung ke tim expert kami! 😊`;
        nextSuggestions = ['Lihat Layanan', 'Cek Daftar Harga'];
      } else {
        reply = `Menarik sekali kak! Saya selalu siap bantu jelaskan detail layanan atau harga wspend. Kakak ingin tahu info apa nih hari ini?`;
        nextSuggestions = ['Daftar Harga Paket', 'Layanan wspend', 'Hubungi Tim Kami'];
      }

      setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: reply, suggestions: nextSuggestions }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 font-bold border border-blue-400/40 animate-bounce hover:animate-none"
        >
          💬 Tanya AI wspend
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[580px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex justify-between items-center">
            <h4 className="font-bold text-white text-sm">Asisten Produk wspend</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">&#10005;</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/70">
            {messages.map((m, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'}`}>
                    {m.content}
                  </div>
                </div>
                {m.suggestions && m.suggestions.length > 0 && m.role === 'assistant' && (
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {m.suggestions.map((sug, sIdx) => (
                      <button key={sIdx} onClick={() => handleSend(sug)} className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all">✨ {sug}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400 pl-4 animate-pulse">Mengetik...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Tanya sesuatu..." className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">Kirim</button>
          </form>
        </div>
      )}
    </div>
  );
}