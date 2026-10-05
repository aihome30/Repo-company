'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  currentTask: string;
  avatar: string;
  color: string;
  room: string;
  activity: string;
}

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'Active', currentTask: 'Mengkoordinasikan sprint tim & delegasi task', avatar: '🧙', color: '#22d3ee', room: 'Command Center', activity: 'Monitoring global workflow' },
  { id: '2', name: 'Nagato', role: 'Product Strategy', status: 'Active', currentTask: 'Menganalisis roadmap produk & Xendit payment flow', avatar: '🟠', color: '#fb923c', room: 'Boardroom', activity: 'Reviewing metrics & client feedback' },
  { id: '3', name: 'Itachi', role: 'System Architect', status: 'Coding', currentTask: 'Refactoring modul backend & arsitektur API', avatar: '🥷', color: '#a78bfa', room: 'Open Workspace', activity: 'Git commit & code review' },
  { id: '4', name: 'Kisame', role: 'Backend & SRE', status: 'Monitoring', currentTask: 'Memantau uptime server 10.10.3.1 & Prometheus PVE', avatar: '🦈', color: '#60a5fa', room: 'Server / Ops Room', activity: 'Checking Proxmox metrics exporter' },
  { id: '5', name: 'Sasori', role: 'Frontend UI/UX', status: 'Designing', currentTask: 'Menyempurnakan glassmorphic UI di Vercel', avatar: '🎭', color: '#f472b6', room: 'Open Workspace', activity: 'Tailwind styling & component polish' },
  { id: '6', name: 'Deidara', role: 'QA & Security', status: 'Testing', currentTask: 'Menjalankan automated test suite & audit DLP', avatar: '💥', color: '#facc15', room: 'Briefing Room A', activity: 'Executing stress test cases' },
  { id: '7', name: 'Konan', role: 'Documentation & HR', status: 'Syncing', currentTask: 'Memperbarui dokumen SOP & laporan HRD', avatar: '📄', color: '#34d399', room: 'Private Office', activity: 'Writing compliance reports' },
];

function AvatarChip({ emoji, label, color, isMoving }: { emoji: string; label: string; color: string; isMoving?: boolean }) {
  return (
    <div className={`flex flex-col items-center leading-none transition-transform duration-1000 ${isMoving ? 'scale-110 translate-y-[-2px]' : ''}`}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[15px] border-2 shadow-lg animate-pulse"
        style={{ borderColor: color, background: '#0b0e14', boxShadow: `0 0 12px ${color}aa` }}
      >
        {emoji}
      </div>
      <span className="text-[8px] mt-0.5 px-1.5 py-0.5 rounded bg-black/90 border border-slate-700 text-slate-100 whitespace-nowrap font-bold">
        {label}
      </span>
    </div>
  );
}

export default function RealtimeAgentOffice() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — Live Dynamic Telemetry Stream Initialized',
    'Connected to agent execution loop [Realtime WebSocket / Polling Active]',
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(INITIAL_AGENTS[0]);

  const [currentTime, setCurrentTime] = useState('');

  // Dynamic status rotation to reflect real agent activities during operational hours (08:00 - 19:00 WIB)
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }));
    }, 1000);

    const tasksPool = [
      { task: 'Meninjau log error & exception handling', activity: 'Debugging runtime' },
      { task: 'Sinkronisasi data transaksi & database', activity: 'API integration check' },
      { task: 'Melakukan audit keamanan data (DLP Guardrails)', activity: 'Security scanning' },
      { task: 'Optimasi query PostgreSQL & indexing tabel', activity: 'DB tuning' },
      { task: 'Menyusun laporan kinerja mingguan untuk CEO', activity: 'Reporting to management' },
      { task: 'Memeriksa kestabilan server Vercel & Node PVE', activity: 'Infrastructure watch' },
    ];

    const timer = setInterval(() => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour: 'numeric', hour12: false }));
      const isOperational = hour >= 8 && hour < 19;

      if (!isOperational) {
        // Outside operational hours: regular agents sleep in lounge, only SRE watcher active
        setAgents((prev) =>
          prev.map((ag) =>
            ag.id === '4'
              ? { ...ag, room: 'Server / Ops Room', currentTask: 'SRE 24/7 Uptime Watcher (Active)', status: 'Standby 24/7', activity: 'Monitoring Infrastructure' }
              : { ...ag, room: 'Lounge (Sleep)', currentTask: 'Off Duty (Tidur)', status: 'Off Duty', activity: 'Standby Besok Pagi' }
          )
        );
        return;
      }

      const timestamp = new Date().toLocaleTimeString();
      const randomAgentIndex = Math.floor(Math.random() * INITIAL_AGENTS.length);
      const chosenAgent = INITIAL_AGENTS[randomAgentIndex];
      const randomTaskObj = tasksPool[Math.floor(Math.random() * tasksPool.length)];

      setAgents((prev) =>
        prev.map((ag) =>
          ag.id === chosenAgent.id
            ? { ...ag, room: chosenAgent.room, currentTask: randomTaskObj.task, activity: randomTaskObj.activity, status: 'Active' }
            : ag
        )
      );

      const logMsg = `[${timestamp}] ${chosenAgent.name} (${chosenAgent.role}): ${randomTaskObj.task} [${randomTaskObj.activity}]`;
      setLogs((p) => [logMsg, ...p.slice(0, 49)]);
    }, 3500);

    return () => {
      clearInterval(clockTimer);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      {/* Header */}
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Agent Office HQ — Realtime Dynamic Activity</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE AGENT TELEMETRY STREAM</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-slate-400 font-mono text-[10px]">WAKTU OPERASIONAL (WIB)</span>
            <span className="text-cyan-400 font-bold font-mono text-sm tracking-widest">{currentTime || '--:--:--'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
            <span>🟢 Realtime Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] min-h-[calc(100vh-3rem)]">
        
        {/* LEFT: Live Status & Task List */}
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1">Live Agent Activities</div>
          {agents.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAgent(a)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedAgent.id === a.id ? 'bg-[#1e2535] border-cyan-500/60 shadow-lg' : 'bg-[#171c26] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 shadow"
                  style={{ borderColor: a.color }}
                >
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{a.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{a.role}</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-cyan-300 bg-black/40 p-1.5 rounded border border-cyan-900/40 font-mono truncate">
                ⚡ {a.currentTask}
              </div>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 pt-2 px-1 text-center">PT. Indo Jaya Gram • Live Execution Loop</div>
        </div>

        {/* CENTER: Floor Plan with Real-time indicators */}
        <div className="bg-[#14161c] p-4 overflow-auto flex items-center justify-center">
          <div
            className="relative rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl shrink-0"
            style={{ width: 760, height: 640, background: '#23262e', imageRendering: 'pixelated' }}
          >
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(#2b2f3a 1px, transparent 1px), linear-gradient(90deg, #2b2f3a 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* 1. BRIEFING ROOM A (Deidara - QA) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 8, top: 8, width: 220, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>BRIEFING ROOM A</span>
                <span className="text-yellow-400 text-[8px] animate-pulse">● {agents[5].activity}</span>
              </div>
              <div className="flex justify-center my-auto">
                <AvatarChip emoji={agents[5].avatar} label={`${agents[5].name} (QA)`} color={agents[5].color} isMoving={true} />
              </div>
              <div className="text-[7px] text-slate-300 text-center truncate bg-black/40 p-1 rounded font-mono">
                {agents[5].currentTask}
              </div>
            </div>

            {/* 2. BOARDROOM (Nagato - Product) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 236, top: 8, width: 330, height: 150 }}>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-slate-300">BOARDROOM — STRATEGY</span>
                <span className="text-orange-400 text-[8px] animate-pulse">● {agents[1].activity}</span>
              </div>
              <div className="flex justify-center my-auto">
                <AvatarChip emoji={agents[1].avatar} label={`${agents[1].name} (Product)`} color={agents[1].color} isMoving={true} />
              </div>
              <div className="text-[7px] text-slate-300 text-center truncate bg-black/40 p-1 rounded font-mono">
                {agents[1].currentTask}
              </div>
            </div>

            {/* 3. PRIVATE OFFICE (Konan - Docs) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 574, top: 8, width: 178, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>PRIVATE OFFICE</span>
                <span className="text-emerald-400 text-[8px]">● {agents[6].activity}</span>
              </div>
              <div className="flex justify-center my-auto">
                <AvatarChip emoji={agents[6].avatar} label={`${agents[6].name} (Docs)`} color={agents[6].color} isMoving={true} />
              </div>
              <div className="text-[7px] text-slate-300 text-center truncate bg-black/40 p-1 rounded font-mono">
                {agents[6].currentTask}
              </div>
            </div>

            {/* 4. OPEN WORKSPACE (Itachi & Sasori) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 8, top: 210, width: 420, height: 190 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>OPEN WORKSPACE (DEV & UI)</span>
                <span className="text-purple-400 text-[8px] animate-pulse">● Live Coding</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 my-auto px-4">
                <div className="flex flex-col items-center">
                  <AvatarChip emoji={agents[2].avatar} label={`${agents[2].name} (Architect)`} color={agents[2].color} isMoving={true} />
                  <span className="text-[7px] text-purple-200 mt-1 text-center truncate w-full font-mono bg-black/40 p-0.5 rounded">{agents[2].currentTask}</span>
                </div>
                <div className="flex flex-col items-center">
                  <AvatarChip emoji={agents[4].avatar} label={`${agents[4].name} (Frontend)`} color={agents[4].color} isMoving={true} />
                  <span className="text-[7px] text-pink-200 mt-1 text-center truncate w-full font-mono bg-black/40 p-0.5 rounded">{agents[4].currentTask}</span>
                </div>
              </div>
            </div>

            {/* 5. COMMAND CENTER (Satoru - Orchestrator) */}
            <div className="absolute border-[3px] border-purple-500 bg-[#1d2230]/95 rounded-sm p-2 flex flex-col justify-between shadow-[0_0_20px_#a855f766]" style={{ left: 436, top: 210, width: 316, height: 190 }}>
              <div className="text-[9px] font-bold text-purple-300 flex justify-between">
                <span>COMMAND CENTER</span>
                <span className="text-cyan-400 text-[8px] animate-pulse">● {agents[0].activity}</span>
              </div>
              <div className="flex justify-center my-auto">
                <AvatarChip emoji={agents[0].avatar} label={`${agents[0].name} (Lead Orchestrator)`} color={agents[0].color} isMoving={true} />
              </div>
              <div className="text-[7px] text-cyan-200 text-center truncate bg-black/40 p-1 rounded border border-cyan-900/50 font-mono">
                {agents[0].currentTask}
              </div>
            </div>

            {/* 6. LOUNGE / REST & SLEEPING QUARTERS */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 8, top: 408, width: 220, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>LOUNGE & BEDROOM</span>
                <span className="text-indigo-400 text-[8px]">😴 Rest Area</span>
              </div>
              <div className="flex flex-wrap gap-1.5 my-auto justify-center">
                {agents.filter(a => a.room.includes('Lounge') || a.status === 'Off Duty').map(a => (
                  <AvatarChip key={a.id} emoji="😴" label={`${a.name} (Off Duty)`} color="#64748b" />
                ))}
              </div>
              <div className="text-[7px] text-slate-400 text-center">Ruang Istirahat / Rest Quarters</div>
            </div>

            {/* 7. KITCHEN */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 236, top: 408, width: 270, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">KITCHEN / PANTRY</div>
              <div className="flex gap-2 mt-4 justify-center">
                <div className="w-20 h-10 bg-[#3a3f4b] border border-slate-600 rounded-[2px] flex items-center justify-center text-[9px]">☕ Water Station</div>
              </div>
            </div>

            {/* 8. SERVER / OPS ROOM (Kisame - Backend & SRE) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 514, top: 408, width: 238, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>SERVER / OPS ROOM</span>
                <span className="text-emerald-400 text-[8px] animate-pulse">● {agents[3].activity}</span>
              </div>
              <div className="flex justify-center my-auto">
                <AvatarChip emoji={agents[3].avatar} label={`${agents[3].name} (SRE Watcher)`} color={agents[3].color} isMoving={true} />
              </div>
              <div className="text-[7px] text-emerald-300 text-center truncate bg-black/40 p-1 rounded border border-emerald-900/50 font-mono">
                {agents[3].currentTask}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: Real-time telemetry feed */}
        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>LIVE EXECUTION TELEMETRY</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex-1 mt-2 bg-black rounded-lg p-3 border border-slate-800 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed min-h-[480px]">
            {logs.map((l, i) => (
              <div key={i} className="text-emerald-400 border-b border-slate-900/50 pb-1">
                {l}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
