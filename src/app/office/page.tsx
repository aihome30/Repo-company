'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Processing' | 'Idle';
  currentTask: string;
  uptime: string;
  avatar: string;
  metrics: string;
}

export default function VirtualAIOffice() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'ag-1', name: 'Maya', role: 'Customer Service Executive', status: 'Active', currentTask: 'Menangani konsultasi klien via AI chat widget', uptime: '99.9%', avatar: '👩‍💻', metrics: '142 Sesi / Hari' },
    { id: 'ag-2', name: 'HRD Agent', role: 'Human Resources & Compliance', status: 'Active', currentTask: 'Memantau kepatuhan dan SOP agen AI perusahaan', uptime: '100%', avatar: '👔', metrics: '10 Disiplin ISTQB' },
    { id: 'ag-3', name: 'Finance (FinJam)', role: 'Financial & Payment Controller', status: 'Processing', currentTask: 'Sinkronisasi transaksi Xendit & laporan kas', uptime: '99.8%', avatar: '📊', metrics: 'Zero Leak DLP' },
    { id: 'ag-4', name: 'CodeAce', role: 'Lead Software Engineer', status: 'Active', currentTask: 'Optimasi Next.js & keamanan backend NestJS', uptime: '99.9%', avatar: '⚡', metrics: 'Zero Build Error' },
    { id: 'ag-5', name: 'QA Engineer', role: 'Quality Assurance Master', status: 'Idle', currentTask: 'Menunggu siklus pengujian test case berikutnya', uptime: '100%', avatar: '🛡️', metrics: '10,000 Test Cases' },
    { id: 'ag-6', name: 'SRE Agent', role: '24/7 Infrastructure Watcher', status: 'Active', currentTask: 'Monitoring latensi Vercel & firewall DNS AdGuard', uptime: '100%', avatar: '🌐', metrics: '< 45ms Latency' },
  ]);

  const [activeTab, setActiveTab] = useState<'office' | 'logs'>('office');
  const [logs, setLogs] = useState<string[]>([
    '[03:55:12] SRE Agent: Uptime checked for wspend.vercel.app -> 200 OK',
    '[03:54:30] Maya: Successfully captured client lead & created support ticket',
    '[03:52:10] FinJam: Xendit payment gateway webhook verified successfully',
    '[03:50:00] CodeAce: Production deployment pushed to master branch successfully'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const newLog = `[${now}] ${randomAgent.name}: Melakukan sinkronisasi tugas "${randomAgent.currentTask}"`;
      setLogs(prev => [newLog, ...prev.slice(0, 15)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Virtual AI Office HQ
              </span>
              <span className="text-xs text-slate-400">PT. Indo Jaya Gram Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
              Kantor Otonom Karyawan AI
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Visualisasi real-time aktivitas tim agen AI otonom yang bekerja 24/7 mengelola perusahaan.
            </p>
          </div>
          
          <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('office')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'office' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              🏢 Ruang Kerja Agen
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'logs' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              📡 Live Activity Feed
            </button>
          </div>
        </div>

        {activeTab === 'office' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((ag) => (
              <div 
                key={ag.id} 
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 backdrop-blur-xl transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                        {ag.avatar}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">{ag.name}</h3>
                        <p className="text-xs text-slate-400">{ag.role}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      ag.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ag.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {ag.status}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 mb-4 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Aktivitas Saat Ini:</div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{ag.currentTask}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">Uptime: <strong className="text-emerald-400">{ag.uptime}</strong></span>
                  <span className="px-2.5 py-1 bg-slate-800 text-cyan-300 rounded-lg font-semibold">{ag.metrics}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl font-mono text-xs space-y-3">
            <div className="text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Live Autonomous Agent Logs & Telemetry
            </div>
            {logs.map((log, index) => (
              <div key={index} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl text-cyan-300 flex items-center justify-between">
                <span>{log}</span>
                <span className="text-[10px] text-slate-600">Secure IPC</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
