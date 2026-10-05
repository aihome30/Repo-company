'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'working' | 'idle' | 'reviewing';
  room: string;
  avatar: string;
}

export default function ExactAgentOffice() {
  const [agents] = useState<Agent[]>([
    { id: '1', name: 'Satoru', role: 'Chief AI Architect', status: 'working', room: 'Command Center', avatar: '🧙‍♂️' },
    { id: '2', name: 'Nagato', role: 'System Orchestrator', status: 'working', room: 'Command Center', avatar: '👁️' },
    { id: '3', name: 'Itachi', role: 'Lead Code Developer', status: 'working', room: 'Workspace', avatar: '⚡' },
    { id: '4', name: 'Kisame', role: 'Database & Security', status: 'idle', room: 'Server Room', avatar: '🦈' },
    { id: '5', name: 'Sasori', role: 'Automation Engineer', status: 'working', room: 'Workspace', avatar: '傀' },
    { id: '6', name: 'Deidara', role: 'QA & Testing Lead', status: 'reviewing', room: 'Meeting Room', avatar: '💥' },
    { id: '7', name: 'Konan', role: 'HRD & Compliance', status: 'idle', room: 'Private Office', avatar: '📄' },
  ]);

  const [logs, setLogs] = useState<string[]>([
    'Windows PowerShell',
    'Copyright (C) Microsoft Corporation. All rights reserved.',
    '',
    'PS C:\Users\Administrator\Project-AI-MemoryCore> node runtime.js',
    '[OK] Initialized 7 Agent nodes successfully.',
    '[SATORU] Monitoring Mission Control grid...',
    '[ITACHI] Optimizing Next.js build pipeline...',
    '[KISAME] Zero Data Leak DLP firewall active.'
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const acts = [
        '[SUCCESS] Automated test suite passed (10,000 tests)',
        '[SECURE] Proxmox exporter synced via bearer token',
        '[AGENT] Satoru deployed update to Vercel production',
        '[FINANCE] Xendit webhook processed invoice'
      ];
      setLogs(p => [`[${now}] ${acts[Math.floor(Math.random() * acts.length)]}`, ...p.slice(0, 20)]);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#111318] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="h-14 border-b border-slate-800 bg-[#161920] px-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-cyan-400">AGENCY HQ</span>
            <span className="text-sm font-semibold text-slate-300">Agent Office</span>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE — Working on Mission Control
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition">
            Stop Demo
          </button>
          <div className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-mono text-slate-300">
            v2.4.0-PROD
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* Left Sidebar: Agent List (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-[#14171f] p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold px-1">
            Active Agents ({agents.length})
          </div>
          
          {agents.map(ag => (
            <div key={ag.id} className="bg-[#1a1e29] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-3.5 flex items-center justify-between transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow">
                  {ag.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-cyan-400 transition">{ag.name}</div>
                  <div className="text-[11px] text-slate-400">{ag.role}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">📍 {ag.room}</div>
                </div>
              </div>
              
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                ag.status === 'working' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                ag.status === 'reviewing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {ag.status}
              </span>
            </div>
          ))}
        </div>

        {/* Center: Office Floor Map (6 cols) */}
        <div className="lg:col-span-6 bg-[#0d1017] p-5 flex flex-col justify-between relative overflow-y-auto">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>

          <div className="relative z-10 flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Office Floor Plan — Isometric View</span>
            <span className="text-xs font-mono text-cyan-400">Secure Network Active</span>
          </div>

          {/* Floor Plan Zones */}
          <div className="relative z-10 grid grid-cols-3 gap-3 my-auto">
            
            {/* Briefing Room */}
            <div className="border border-slate-800 bg-[#161b22]/80 rounded-2xl p-4 flex flex-col justify-between h-36">
              <span className="text-[11px] font-bold text-slate-400">📽️ Briefing Room</span>
              <div className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🪑</div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🪑</div>
              </div>
              <span className="text-[10px] text-slate-500 text-center">Presentation Screen</span>
            </div>

            {/* Meeting Room */}
            <div className="border border-purple-500/30 bg-[#161b22]/80 rounded-2xl p-4 flex flex-col justify-between h-36">
              <span className="text-[11px] font-bold text-purple-400">🤝 Meeting Room</span>
              <div className="flex justify-center items-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl animate-pulse">
                  💥
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center">Deidara (Reviewing)</span>
            </div>

            {/* Private Office */}
            <div className="border border-slate-800 bg-[#161b22]/80 rounded-2xl p-4 flex flex-col justify-between h-36">
              <span className="text-[11px] font-bold text-slate-400">👔 Private Office</span>
              <div className="flex justify-center items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                  📄
                </div>
              </div>
              <span className="text-[10px] text-slate-500 text-center">Konan (HRD)</span>
            </div>

            {/* Workspace */}
            <div className="col-span-2 border border-cyan-500/30 bg-[#161b22]/80 rounded-2xl p-4 flex flex-col justify-between h-36">
              <span className="text-[11px] font-bold text-cyan-400">⚡ Open Workspace</span>
              <div className="flex justify-around items-center">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-lg">⚡</span>
                  <span className="text-xs text-slate-300">Itachi</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-lg">傀</span>
                  <span className="text-xs text-slate-300">Sasori</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center">Active Coding & Automation</span>
            </div>

            {/* Command Center */}
            <div className="col-span-3 border-2 border-cyan-500/40 bg-gradient-to-br from-[#161b22] to-[#121824] rounded-2xl p-4 flex flex-col justify-between h-40">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-400">🖥️ Command Center (Mission Control)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <div className="flex justify-center gap-6 items-center my-2">
                <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-2xl">
                  <span className="text-2xl">🧙‍♂️</span>
                  <div>
                    <div className="text-xs font-bold text-white">Satoru</div>
                    <div className="text-[10px] text-cyan-300">Chief AI Architect</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-2xl">
                  <span className="text-2xl">👁️</span>
                  <div>
                    <div className="text-xs font-bold text-white">Nagato</div>
                    <div className="text-[10px] text-blue-300">Orchestrator</div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center">Global Datacenter Monitoring & Telemetry Mesh</span>
            </div>

          </div>

          <div className="relative z-10 text-[11px] text-slate-500 text-center mt-3">
            PT. Indo Jaya Gram • AI Autonomous Workforce Matrix
          </div>
        </div>

        {/* Right Column: PowerShell Terminal (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800 bg-[#0d1017] p-4 flex flex-col font-mono text-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-bold">Windows PowerShell</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex-1 bg-black/80 rounded-2xl p-4 border border-slate-800/80 overflow-y-auto space-y-2 text-[11px] text-cyan-400 shadow-inner">
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed">{log}</div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Session active • Zero Leak DLP Enabled
          </div>
        </div>

      </div>
    </div>
  );
}
