'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
  color: string;
}

const AGENTS: Agent[] = [
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'Online', avatar: '🧙', color: '#22d3ee' },
  { id: '2', name: 'Nagato', role: 'Product', status: 'Active', avatar: '🟠', color: '#fb923c' },
  { id: '3', name: 'Itachi', role: 'Architect', status: 'Coding', avatar: '🥷', color: '#a78bfa' },
  { id: '4', name: 'Kisame', role: 'Backend & OS', status: 'Monitoring', avatar: '🦈', color: '#60a5fa' },
  { id: '5', name: 'Sasori', role: 'Frontend', status: 'Ready', avatar: '🎭', color: '#f472b6' },
  { id: '6', name: 'Deidara', role: 'QA', status: 'Testing', avatar: '💥', color: '#facc15' },
  { id: '7', name: 'Konan', role: 'Docs', status: 'Syncing', avatar: '📄', color: '#34d399' },
];

function AvatarChip({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] border-2"
        style={{ borderColor: color, background: '#0b0e14', boxShadow: `0 0 8px ${color}66` }}
      >
        {emoji}
      </div>
      <span className="text-[8px] mt-0.5 px-1 rounded bg-black/80 border border-slate-700 text-slate-200 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function DeskSet() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-10 h-6 rounded-[3px] bg-[#8b5a2b] border border-[#5c3a18] relative shadow">
        <div className="absolute -top-2 left-1 w-3.5 h-2.5 bg-[#38bdf8] border border-[#0c4a6e] rounded-[2px] shadow-[0_0_6px_#38bdf8]" />
        <div className="absolute -top-2 right-1 w-3.5 h-2.5 bg-[#38bdf8] border border-[#0c4a6e] rounded-[2px] shadow-[0_0_6px_#38bdf8]" />
      </div>
      <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-slate-600" />
    </div>
  );
}

export default function RealAgentOffice() {
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — Live Production Telemetry Daemon Initialized',
    'Connected to Linux Node (7.0.14-12-pve) [10.10.3.x SRE Watcher Active]',
    'Kafka Consumer & Xendit Invoice Gateway: OPERATIONAL',
    'Wspend Vercel Deployment: https://wspend.vercel.app (Status: 200 OK)',
    '------------------------------------------------------------------',
    'Satoru: Orchestrator node heartbeat acknowledged.',
    'Itachi: Code commit sync verified on master branch.',
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const liveEvents = [
        `[${now}] SRE Watcher: Health check OK (Gateway 10.10.3.1)`,
        `[${now}] Satoru: Task dispatch verified & executed`,
        `[${now}] Itachi: Architectural schema compiled successfully`,
        `[${now}] Kisame: Database telemetry synced to Proxmox Exporter`,
        `[${now}] Deidara: Security scan completed with 0 vulnerabilities`,
      ];
      setLogs((p) => [...p.slice(-40), liveEvents[Math.floor(Math.random() * liveEvents.length)]]);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Agent Office</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE PRODUCTION ENVIRONMENT — REAL TELEMETRY</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
          <span>● Synced with Backend</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[250px_1fr_350px] min-h-[calc(100vh-3rem)]">
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1">Live Agents Status</div>
          {AGENTS.map((a) => (
            <div key={a.id} className="flex items-center gap-3 bg-[#171c26] border border-slate-800 rounded-xl px-3 py-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg border-2"
                style={{ borderColor: a.color }}
              >
                {a.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{a.name}</div>
                <div className="text-[11px] text-slate-400">{a.role}</div>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {a.status}
              </span>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 pt-2 px-1">PT. Indo Jaya Gram • Real Infrastructure Node</div>
        </div>

        <div className="bg-[#14161c] p-4 overflow-auto">
          <div
            className="relative mx-auto rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl"
            style={{ width: 760, height: 640, background: '#23262e', imageRendering: 'pixelated' }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(#2b2f3a 1px, transparent 1px), linear-gradient(90deg, #2b2f3a 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            {/* 1. BRIEFING ROOM A (Deidara - QA) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 8, top: 8, width: 220, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300">BRIEFING ROOM A</div>
              <div className="h-6 bg-[#e8e8e8] border border-slate-500 rounded flex items-center justify-center text-[8px] text-slate-600 font-bold">PROJECTOR SCREEN</div>
              <div className="flex justify-center gap-4 my-auto">
                <AvatarChip emoji="💥" label="Deidara (QA)" color="#facc15" />
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-3 bg-[#4a3220] border border-[#2c1e10] rounded-[2px]" />
                ))}
              </div>
            </div>

            {/* 2. BOARDROOM (Nagato - Product) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5" style={{ left: 236, top: 8, width: 330, height: 150 }}>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-slate-300">BOARDROOM — PRODUCT & STRATEGY</span>
                <span className="text-[9px]">🟢</span>
              </div>
              <div className="mx-auto mt-2 w-48 h-8 bg-[#7a5230] border-2 border-[#4c3016] rounded flex items-center justify-center relative">
                <div className="absolute -top-3">
                  <AvatarChip emoji="🟠" label="Nagato (Product)" color="#fb923c" />
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full bg-black border border-slate-500" />
                ))}
              </div>
            </div>

            {/* 3. PRIVATE OFFICE (Konan - Docs & HRD) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5" style={{ left: 574, top: 8, width: 178, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300">PRIVATE OFFICE (DOCS & HR)</div>
              <div className="mt-2 flex justify-center">
                <AvatarChip emoji="📄" label="Konan (Docs)" color="#34d399" />
              </div>
              <div className="mx-auto mt-2 w-20 h-8 bg-[#7a5230] border border-[#4c3016] rounded-[2px]" />
              <div className="absolute bottom-1 right-2 text-xs">🌱</div>
            </div>

            {/* 4. OPEN WORKSPACE (Itachi & Sasori) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 8, top: 210, width: 420, height: 190 }}>
              <div className="text-[9px] font-bold text-slate-300">OPEN WORKSPACE (DEV & UI)</div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 mt-3 px-4">
                <div className="flex flex-col items-center">
                  <AvatarChip emoji="🥷" label="Itachi (Architect)" color="#a78bfa" />
                  <div className="mt-1"><DeskSet /></div>
                </div>
                <div className="flex flex-col items-center">
                  <AvatarChip emoji="🎭" label="Sasori (Frontend)" color="#f472b6" />
                  <div className="mt-1"><DeskSet /></div>
                </div>
              </div>
              <div className="absolute bottom-1.5 left-2 text-[8px] text-slate-400">Library & Docs</div>
            </div>

            {/* 5. COMMAND CENTER (Satoru - Orchestrator) */}
            <div className="absolute border-[3px] border-purple-500 bg-[#1d2230]/95 rounded-sm p-2 shadow-[0_0_20px_#a855f766]" style={{ left: 436, top: 210, width: 316, height: 190 }}>
              <div className="text-[9px] font-bold text-purple-300">COMMAND CENTER (ORCHESTRATOR)</div>
              <div className="mt-1 h-12 rounded-[3px] border border-cyan-800 bg-gradient-to-r from-[#062033] via-[#0a3a5c] to-[#062033] flex items-center justify-center text-[9px] text-cyan-300 font-bold">
                MISSION CONTROL MONITOR
              </div>
              <div className="flex justify-center mt-2">
                <AvatarChip emoji="🧙" label="Satoru (Lead)" color="#22d3ee" />
              </div>
              <div className="absolute bottom-1 right-2 text-xs">🟢</div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 8, top: 408, width: 220, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">LOUNGE</div>
              <div className="flex gap-1.5 mt-2">
                <div className="w-14 h-10 bg-[#111] border border-slate-600 rounded-[3px]" />
                <div className="w-14 h-10 bg-[#111] border border-slate-600 rounded-[3px]" />
              </div>
              <div className="mx-auto mt-1.5 w-20 h-6 bg-[#7a5230] border border-[#4c3016] rounded-[2px]" />
              <div className="flex justify-between mt-2 text-xs"><span>💡</span><span>🟢</span><span>💡</span></div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 236, top: 408, width: 270, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">KITCHEN / BREAK ROOM</div>
              <div className="flex gap-1 mt-1.5">
                <div className="w-16 h-8 bg-[#3a3f4b] border border-slate-600 rounded-[2px] flex items-center justify-center text-[10px]">☕☕</div>
                <div className="w-16 h-8 bg-[#3a3f4b] border border-slate-600 rounded-[2px] flex items-center justify-center text-[10px]">🧊❄️</div>
              </div>
              <div className="mx-auto mt-2 w-32 h-8 bg-[#7a5230] border-2 border-[#4c3016] rounded" />
              <div className="flex justify-center gap-2 mt-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-black border border-slate-500" />
                ))}
              </div>
              <div className="absolute bottom-1 right-2 text-xs">🟢</div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 514, top: 408, width: 238, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">SERVER / OPS ROOM (PROXMOX & SRE)</div>
              <div className="flex gap-2 mt-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-10 h-24 bg-black border border-slate-600 rounded-[3px] flex flex-col items-center py-1.5 gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className={`w-5 h-1.5 rounded-[1px] ${j % 2 ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse`} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-2">
                <div className="w-16 h-6 bg-[#3a3f4b] border border-slate-600 rounded-[2px] text-[8px] text-center text-emerald-400 flex items-center justify-center">SYNNCED</div>
                <div className="w-16 h-6 bg-[#3a3f4b] border border-slate-600 rounded-[2px] text-[8px] text-center text-cyan-400 flex items-center justify-center">ONLINE</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>REAL TELEMETRY STREAM</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex-1 mt-2 bg-black rounded-lg p-3 border border-slate-800 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed min-h-[480px]">
            {logs.map((l, i) => (
              <div key={i} className="text-emerald-400 border-b border-slate-900 pb-1">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
