'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Working' | 'Reviewing' | 'Idle' | 'Monitoring';
  room: string;
  avatar: string;
  color: string;
}

export default function PixelAgentOffice() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Maya', role: 'CS Executive', status: 'Working', room: 'Command Center', avatar: '👩‍💻', color: 'from-cyan-500 to-blue-600' },
    { id: '2', name: 'CodeAce', role: 'Lead Developer', status: 'Working', room: 'Open Workspace', avatar: '⚡', color: 'from-emerald-500 to-teal-600' },
    { id: '3', name: 'SRE Agent', role: 'DevOps / Uptime', status: 'Monitoring', room: 'Server Room', avatar: '🛡️', color: 'from-amber-500 to-orange-600' },
    { id: '4', name: 'HRD Agent', role: 'Compliance & HR', status: 'Reviewing', room: 'Meeting Room', avatar: '👔', color: 'from-purple-500 to-indigo-600' },
    { id: '5', name: 'QA Engineer', role: 'Testing & QA', status: 'Working', room: 'Open Workspace', avatar: '🔍', color: 'from-rose-500 to-pink-600' },
    { id: '6', name: 'FinJam', role: 'Finance Controller', status: 'Idle', room: 'Command Center', avatar: '📊', color: 'from-blue-500 to-cyan-600' },
  ]);

  const [logs, setLogs] = useState<string[]>([
    'PS C:\Project-AI-MemoryCore\agents> node runtime.js --init',
    '[INFO] Initializing PT. Indo Jaya Gram Autonomous AI Office...',
    '[SUCCESS] 6 Agent nodes connected via secure IPC mesh.',
    '[MONITOR] SRE Agent: Uptime 100% at wspend.vercel.app',
    '[AGENT-1] Maya handling customer consultation session...',
    '[AGENT-2] CodeAce compiling Next.js build successfully...'
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const actions = [
        'Executing automated test suites...',
        'Syncing secure metrics with Proxmox exporter...',
        'Processing Xendit webhook transaction...',
        'Reviewing AI chat conversation flow...'
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [`[${now}] ${randomAction}`, ...prev.slice(0, 15)]);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            PT. INDO JAYA GRAM — VIRTUAL AGENT OFFICE HQ
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">Status: Live & Secure</span>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">6 Agents Active</span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-3.5rem)]">
        
        {/* Left Column: Agent Sidebar (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-slate-950/40 p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
            Active Agents ({agents.length})
          </div>
          {agents.map((ag) => (
            <div 
              key={ag.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ag.color} flex items-center justify-center text-lg shadow-lg`}>
                  {ag.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-cyan-400 transition">{ag.name}</div>
                  <div className="text-[11px] text-slate-400">{ag.role}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">📍 {ag.room}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                ag.status === 'Working' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                ag.status === 'Reviewing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                ag.status === 'Monitoring' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-slate-800 text-slate-400'
              }`}>
                {ag.status}
              </span>
            </div>
          ))}
        </div>

        {/* Middle Column: 2D Top-Down Office Floor Plan (6 cols) */}
        <div className="lg:col-span-6 bg-[#0d1117] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          
          <div className="relative z-10 flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Office Floor Map (Top-Down View)</h2>
            <span className="text-xs font-mono text-cyan-400">Secure Network: 10.10.3.x</span>
          </div>

          {/* Floor Plan Grid */}
          <div className="relative z-10 grid grid-cols-2 grid-rows-2 gap-4 flex-1 my-2">
            
            {/* Command Center Room */}
            <div className="border-2 border-dashed border-slate-700/80 bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between relative backdrop-blur-sm group hover:border-cyan-500/50 transition">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>🖥️ Command Center</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <div className="flex gap-3 justify-center items-center my-auto">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-lg animate-bounce">
                  👩‍💻
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl shadow-lg">
                  📊
                </div>
              </div>
              <div className="text-[10px] text-slate-500 text-center">Maya & FinJam Station</div>
            </div>

            {/* Meeting Room */}
            <div className="border-2 border-dashed border-slate-700/80 bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between relative backdrop-blur-sm group hover:border-purple-500/50 transition">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                🤝 Executive Meeting Room
              </div>
              <div className="flex justify-center items-center my-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-lg">
                  👔
                </div>
              </div>
              <div className="text-[10px] text-slate-500 text-center">HRD Compliance Review</div>
            </div>

            {/* Open Workspace */}
            <div className="border-2 border-dashed border-slate-700/80 bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between relative backdrop-blur-sm group hover:border-emerald-500/50 transition">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                ⚡ Open Dev Workspace
              </div>
              <div className="flex gap-3 justify-center items-center my-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-lg">
                  ⚡
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shadow-lg">
                  🔍
                </div>
              </div>
              <div className="text-[10px] text-slate-500 text-center">CodeAce & QA Engineer</div>
            </div>

            {/* Server Room */}
            <div className="border-2 border-dashed border-slate-700/80 bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between relative backdrop-blur-sm group hover:border-amber-500/50 transition">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                🛡️ Datacenter Server Room
              </div>
              <div className="flex justify-center items-center my-auto">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg animate-pulse">
                  🛡️
                </div>
              </div>
              <div className="text-[10px] text-slate-500 text-center">SRE 24/7 Watcher Node</div>
            </div>

          </div>

          <div className="relative z-10 text-[11px] text-slate-500 text-center">
            Interactive Agent Floor Plan • Zero Data Leak Enforced
          </div>
        </div>

        {/* Right Column: PowerShell / Terminal Panel (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800/80 bg-slate-950 p-5 flex flex-col font-mono text-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-900">
            <span className="text-slate-400 font-bold">PowerShell Core</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          
          <div className="flex-1 bg-black/60 rounded-2xl p-4 border border-slate-900 overflow-y-auto space-y-2 text-[11px] text-cyan-400 shadow-inner">
            <div className="text-slate-500">PS C:\Project-AI-MemoryCore\agents></div>
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed">{log}</div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500 text-center">
            PT. Indo Jaya Gram Autonomous Runtime
          </div>
        </div>

      </div>
    </div>
  );
}
