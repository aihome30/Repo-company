'use client';

import { useState, useEffect } from 'react';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  room: string;
  status: 'working' | 'reviewing' | 'idle';
  avatar: string;
  deskPos: { x: number; y: number };
  activity: string;
}

export default function PixelOfficeCanvas() {
  const [agents, setAgents] = useState<AgentNode[]>([
    { id: '1', name: 'Satoru', role: 'Chief Architect', room: 'Command Center', status: 'working', avatar: '🧙‍♂️', deskPos: { x: 350, y: 320 }, activity: 'Analyzing Global Metrics' },
    { id: '2', name: 'Nagato', role: 'Orchestrator', room: 'Command Center', status: 'working', avatar: '👁️', deskPos: { x: 450, y: 320 }, activity: 'Syncing Mesh Nodes' },
    { id: '3', name: 'Itachi', role: 'Lead Dev', room: 'Workspace', status: 'working', avatar: '⚡', deskPos: { x: 120, y: 150 }, activity: 'Coding Next.js' },
    { id: '4', name: 'Sasori', role: 'Automation', room: 'Workspace', status: 'working', avatar: '傀', deskPos: { x: 220, y: 150 }, activity: 'Running CI/CD' },
    { id: '5', name: 'Deidara', role: 'QA Lead', room: 'Meeting Room', status: 'reviewing', avatar: '💥', deskPos: { x: 620, y: 150 }, activity: 'Reviewing Test Case' },
    { id: '6', name: 'Konan', role: 'HRD Compliance', room: 'Private Office', status: 'idle', avatar: '📄', deskPos: { x: 620, y: 320 }, activity: 'Auditing Policies' },
    { id: '7', name: 'Kisame', role: 'Security / Server', room: 'Server Room', status: 'working', avatar: '🦈', deskPos: { x: 380, y: 520 }, activity: 'DLP Firewall active' },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AgentNode>(agents[0]);
  const [logs, setLogs] = useState<string[]>([
    'Windows PowerShell [Version 10.0.22621.3447]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'PS C:\Project-AI-MemoryCore> node runtime.js --visual-canvas',
    '[OK] Loaded 2D Isometric Office Canvas Renderer.',
    '[INFO] Satoru is active at Command Center desk.',
    '[INFO] Itachi & Sasori active at Open Workspace.'
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const actions = [
        '[NET] Proxmox metrics synced to 10.10.3.231',
        '[AI] Satoru processed telemetry packet',
        '[DEV] Itachi committed patch to master',
        '[QA] Deidara verified 10,000 test cases'
      ];
      setLogs(p => [`[${now}] ${actions[Math.floor(Math.random() * actions.length)]}`, ...p.slice(0, 25)]);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="h-14 border-b border-slate-800 bg-[#121620] px-6 flex justify-between items-center z-20 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-base font-black tracking-wider text-cyan-400">AGENCY HQ</span>
          <span className="text-sm font-semibold text-slate-300">Virtual Office Floor — Interactive 2D Studio</span>
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE 2D WORKSPACE
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition cursor-pointer">
            Stop Demo
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* Left Sidebar: Agent List */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-[#10141d] p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold px-1">
            Office Staff ({agents.length} Agents)
          </div>
          
          {agents.map(ag => (
            <div 
              key={ag.id} 
              onClick={() => setSelectedAgent(ag)}
              className={`border rounded-2xl p-3.5 flex items-center justify-between transition cursor-pointer ${
                selectedAgent.id === ag.id ? 'bg-slate-800/80 border-cyan-500 shadow-md' : 'bg-[#161b26] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow">
                  {ag.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{ag.name}</div>
                  <div className="text-[11px] text-slate-400">{ag.role}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">📍 {ag.room}</div>
                </div>
              </div>
              
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                ag.status === 'working' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                ag.status === 'reviewing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                'bg-slate-800 text-slate-400'
              }`}>
                {ag.status}
              </span>
            </div>
          ))}

          {/* Selected Agent Details Card */}
          <div className="mt-auto bg-[#161b26] border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Agent Telemetry</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{selectedAgent.avatar}</span>
              <div>
                <div className="text-sm font-bold text-white">{selectedAgent.name}</div>
                <div className="text-xs text-cyan-400">{selectedAgent.activity}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Location: {selectedAgent.room}</div>
          </div>
        </div>

        {/* Center: Detailed 2D Office Floor Canvas with Desks, Computers & Avatars */}
        <div className="lg:col-span-6 bg-[#0c0f16] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

          {/* Office Floor Plan Container */}
          <div className="relative w-full max-w-3xl h-[560px] bg-[#111520] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Top Row Rooms: Workspace & Meeting Room */}
            <div className="grid grid-cols-2 gap-4 h-[45%]">
              
              {/* Open Workspace Room */}
              <div className="border border-cyan-500/30 bg-[#161c2b]/80 rounded-2xl p-4 relative flex flex-col justify-between">
                <div className="absolute top-3 left-4 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">⚡ Open Workspace</div>
                
                {/* Desks & Computers */}
                <div className="flex justify-around items-center h-full pt-6">
                  {/* Itachi Desk */}
                  <div className="flex flex-col items-center group cursor-pointer" onClick={() => setSelectedAgent(agents[2])}>
                    <div className="w-12 h-8 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-xs shadow mb-1">💻</div>
                    <div className="w-10 h-6 bg-amber-900/60 border border-amber-700/50 rounded-sm flex items-center justify-center text-lg animate-bounce">⚡</div>
                    <span className="text-[10px] text-slate-300 font-bold mt-1">Itachi</span>
                  </div>
                  {/* Sasori Desk */}
                  <div className="flex flex-col items-center group cursor-pointer" onClick={() => setSelectedAgent(agents[3])}>
                    <div className="w-12 h-8 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-xs shadow mb-1">🖥️</div>
                    <div className="w-10 h-6 bg-purple-900/60 border border-purple-700/50 rounded-sm flex items-center justify-center text-lg">傀</div>
                    <span className="text-[10px] text-slate-300 font-bold mt-1">Sasori</span>
                  </div>
                </div>
              </div>

              {/* Meeting Room */}
              <div className="border border-purple-500/30 bg-[#161c2b]/80 rounded-2xl p-4 relative flex flex-col justify-between">
                <div className="absolute top-3 left-4 text-[11px] font-bold text-purple-400 uppercase tracking-wider">🤝 Meeting Room</div>
                
                <div className="flex justify-center items-center h-full pt-6">
                  {/* Conference Table + Deidara */}
                  <div className="w-36 h-14 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-3 relative shadow-inner">
                    <span className="text-xs text-slate-400 font-mono">Table</span>
                    <div className="w-10 h-8 bg-rose-900/60 border border-rose-700/50 rounded-lg flex items-center justify-center text-lg absolute -top-4 cursor-pointer animate-pulse" onClick={() => setSelectedAgent(agents[4])}>
                      💥
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-purple-300 text-center">Deidara (QA Review)</span>
              </div>

            </div>

            {/* Bottom Row Rooms: Command Center, Server Room & Private Office */}
            <div className="grid grid-cols-3 gap-4 h-[48%]">
              
              {/* Command Center */}
              <div className="col-span-1 border-2 border-cyan-500/50 bg-[#161c2b]/90 rounded-2xl p-4 relative flex flex-col justify-between">
                <div className="absolute top-3 left-4 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">🖥️ Command Center</div>
                
                <div className="flex justify-around items-center h-full pt-6">
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedAgent(agents[0])}>
                    <div className="w-10 h-6 bg-cyan-900/60 border border-cyan-700/50 rounded-sm flex items-center justify-center text-lg">🧙‍♂️</div>
                    <span className="text-[10px] text-cyan-300 font-bold mt-1">Satoru</span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedAgent(agents[1])}>
                    <div className="w-10 h-6 bg-blue-900/60 border border-blue-700/50 rounded-sm flex items-center justify-center text-lg">👁️</div>
                    <span className="text-[10px] text-blue-300 font-bold mt-1">Nagato</span>
                  </div>
                </div>
              </div>

              {/* Server Room */}
              <div className="col-span-1 border border-amber-500/30 bg-[#161c2b]/80 rounded-2xl p-4 relative flex flex-col justify-between">
                <div className="absolute top-3 left-4 text-[11px] font-bold text-amber-400 uppercase tracking-wider">🛡️ Server Room</div>
                
                <div className="flex justify-center items-center h-full pt-6">
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedAgent(agents[6])}>
                    <div className="w-12 h-10 bg-black/80 border border-amber-500/50 rounded-md flex items-center justify-center text-lg shadow-inner animate-pulse">🗄️</div>
                    <div className="w-8 h-6 bg-amber-900/60 rounded-sm flex items-center justify-center text-sm mt-1">🦈</div>
                    <span className="text-[10px] text-amber-300 font-bold mt-0.5">Kisame</span>
                  </div>
                </div>
              </div>

              {/* Private Office */}
              <div className="col-span-1 border border-indigo-500/30 bg-[#161c2b]/80 rounded-2xl p-4 relative flex flex-col justify-between">
                <div className="absolute top-3 left-4 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">👔 Private Office</div>
                
                <div className="flex justify-center items-center h-full pt-6">
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedAgent(agents[5])}>
                    <div className="w-14 h-8 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-xs shadow mb-1">🪑</div>
                    <div className="w-8 h-6 bg-indigo-900/60 rounded-sm flex items-center justify-center text-sm">📄</div>
                    <span className="text-[10px] text-indigo-300 font-bold mt-1">Konan</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: PowerShell Terminal */}
        <div className="lg:col-span-3 border-l border-slate-800 bg-[#10141d] p-4 flex flex-col font-mono text-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-bold">Windows PowerShell</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex-1 bg-black/90 rounded-2xl p-4 border border-slate-800 overflow-y-auto space-y-2 text-[11px] text-cyan-400 shadow-inner">
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed">{log}</div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            PT. Indo Jaya Gram Autonomous Office Matrix
          </div>
        </div>

      </div>
    </div>
  );
}
