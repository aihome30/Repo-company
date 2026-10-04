'use client';

import { useState, useEffect } from 'react';

interface Ticket {
  id: string;
  clientName: string;
  service: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  time: string;
}

export default function CustomerServicePortal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('indojaya_tickets');
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch {
        setTickets([]);
      }
    } else {
      setTickets([]);
      localStorage.setItem('indojaya_tickets', JSON.stringify([]));
    }
  }, []);

  const updateStatus = (id: string, newStatus: 'New' | 'In Progress' | 'Resolved') => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTickets(updated);
    localStorage.setItem('indojaya_tickets', JSON.stringify(updated));
  };

  const clearAllTickets = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua tiket?')) {
      setTickets([]);
      localStorage.setItem('indojaya_tickets', JSON.stringify([]));
    }
  };

  const addTestTicket = () => {
    const newT: Ticket = {
      id: `TICK-00${tickets.length + 1}`,
      clientName: 'Klien Baru (Web)',
      service: 'Custom Web / AI',
      message: 'Halo Maya, saya butuh konsultasi pembuatan sistem web perusahaan.',
      status: 'New',
      time: 'Baru saja'
    };
    const updated = [newT, ...tickets];
    setTickets(updated);
    localStorage.setItem('indojaya_tickets', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              HRD & Customer Service Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Pusat monitoring dan manajemen tiket konsultasi klien dari Maya (AI CS Agent).
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={addTestTicket}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              + Simulasi Tiket Masuk
            </button>
            <button 
              onClick={clearAllTickets}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Hapus Semua Tiket
            </button>
            <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-cyan-400">
              Total Tiket: {tickets.length}
            </span>
          </div>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/30 border border-slate-800/80 rounded-3xl">
            <p className="text-slate-400 text-sm">Belum ada tiket konsultasi yang masuk.</p>
            <p className="text-slate-600 text-xs mt-1">Tiket akan muncul otomatis saat klien mengirim pesan melalui chat AI atau form kontak.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-cyan-500/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-cyan-400 font-mono">{t.id}</span>
                    <span className="text-sm font-semibold text-white">{t.clientName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">{t.service}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{t.message}</p>
                  <span className="text-xs text-slate-500 block pt-1">Masuk: {t.time}</span>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    t.status === 'New' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {t.status}
                  </span>
                  
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
