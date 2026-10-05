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
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'briefing', avatar: '🧙', color: '#22d3ee' },
  { id: '2', name: 'Nagato', role: 'Product', status: 'briefing', avatar: '🟠', color: '#fb923c' },
  { id: '3', name: 'Itachi', role: 'Architect', status: 'briefing', avatar: '🥷', color: '#a78bfa' },
  { id: '4', name: 'Kisame', role: 'Backend & OS', status: 'briefing', avatar: '🦈', color: '#60a5fa' },
  { id: '5', name: 'Sasori', role: 'Frontend', status: 'briefing', avatar: '🎭', color: '#f472b6' },
  { id: '6', name: 'Deidara', role: 'QA', status: 'briefing', avatar: '💥', color: '#facc15' },
  { id: '7', name: 'Konan', role: 'Docs', status: 'briefing', avatar: '📄', color: '#34d399' },
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

export default function AgentOfficeDemo() {
  const [demoRunning, setDemoRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    'Windows PowerShell',
    'Copyright (C) Microsoft Corporation. All rights reserved.',
    'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows',
    '',
    'PS C:\\Users\\muhan\\Desktop\\project\\ClaudeCodeMemoryCore\\Project-AI-MemoryCore>',
  ]);

  useEffect(() => {
    if (!demoRunning) return;
    const t = setInterval(() => {
      const lines = [
        '[Satoru] dispatching task to Itachi ...',
        '[Itachi] architect plan ready',
        '[Nagato] product spec synced ...',
        '[Kisame] backend job running ...',
        '[Deidara] QA check passed',
      ];
      setLogs((p) => [...p.slice(-30), lines[Math.floor(Math.random() * lines.length)]]);
    }, 2500);
    return () => clearInterval(t);
  }, [demoRunning]);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Agent Office</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE - working on Mission Control</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-300 border border-yellow-500/40 font-bold">
            DEMO — not real state
          </span>
        </div>
        <button
          onClick={() => setDemoRunning(!demoRunning)}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-400 text-black transition cursor-pointer"
        >
          {demoRunning ? 'Stop demo' : 'Start demo'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[250px_1fr_350px] min-h-[calc(100vh-3rem)]">
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2">
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
              <span className="flex items-center gap-1.5 text-[11px] text-sky-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                {a.status}
              </span>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 pt-2 px-1">PT. Indo Jaya Gram • AI workforce matrix</div>
        </div>

        <div className="bg-[#14161c] p-4 overflow-auto">
          <div
            className="relative mx-auto rounded-xl border-2 border-slate-700 overflow-hidden"
            style={{ width: 760, height: 640, background: '#23262e', imageRendering: 'pixelated' }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(#2b2f3a 1px, transparent 1px), linear-gradient(90deg, #2b2f3a 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm" style={{ left: 8, top: 8, width: 220, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 px-1.5 pt-1">BRIEFING ROOM A</div>
              <div className="mx-2 mt-1 h-8 bg-[#e8e8e8] border-2 border-slate-500 rounded-[2px] flex items-center justify-center text-[8px] text-slate-500">PROJECTOR SCREEN</div>
              <div className="flex justify-center gap-3 mt-2">
                <AvatarChip emoji="🥷" label="Itachi briefing" color="#a78bfa" />
                <AvatarChip emoji="💥" label="Deidara" color="#facc15" />
                <AvatarChip emoji="📄" label="Konan" color="#34d399" />
                <AvatarChip emoji="🎭" label="Sasori" color="#f472b6" />
              </div>
              <div className="flex justify-center gap-1.5 mt-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-3.5 bg-[#4a3220] border border-[#2c1e10] rounded-[2px]" />
                ))}
              </div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm" style={{ left: 236, top: 8, width: 330, height: 150 }}>
              <div className="flex justify-between px-1.5 pt-1">
                <span className="text-[9px] font-bold text-slate-300">BOARDROOM</span>
                <span className="text-[9px]">🌱</span>
              </div>
              <div className="mx-auto mt-1 w-56 h-9 bg-[#7a5230] border-2 border-[#4c3016] rounded flex items-center justify-center">
                <div className="w-40 h-4 bg-[#9a6a3e] rounded-[2px]" />
              </div>
              <div className="flex justify-center gap-1.5 mt-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-black border border-slate-500" />
                ))}
              </div>
              <div className="flex justify-center gap-1.5 mt-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-black border border-slate-500" />
                ))}
              </div>
              <div className="absolute top-8 left-2 flex flex-col gap-1">
                <div className="w-8 h-5 bg-[#0ea5e9] border border-cyan-900 rounded-[2px]" />
                <div className="w-8 h-5 bg-[#0ea5e9] border border-cyan-900 rounded-[2px]" />
              </div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm" style={{ left: 574, top: 8, width: 178, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 px-1.5 pt-1">PRIVATE OFFICE</div>
              <div className="mx-2 mt-1.5 w-24 h-10 bg-[#7a5230] border-2 border-[#4c3016] rounded-[2px] relative">
                <div className="absolute -top-2 left-2 w-6 h-4 bg-[#0ea5e9] border border-cyan-900 rounded-[2px]" />
              </div>
              <div className="flex gap-1.5 px-2 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-black border border-slate-500" />
                <div className="w-4 h-4 rounded-full bg-black border border-slate-500" />
              </div>
              <div className="absolute bottom-1 right-2 text-sm">🌱</div>
            </div>

            <div className="absolute flex gap-4" style={{ left: 120, top: 168 }}>
              <AvatarChip emoji="🟠" label="Nagato" color="#fb923c" />
              <AvatarChip emoji="🥷" label="Itachi" color="#a78bfa" />
              <AvatarChip emoji="🦈" label="Kisame" color="#60a5fa" />
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 8, top: 210, width: 420, height: 190 }}>
              <div className="text-[9px] font-bold text-slate-300">OPEN WORKSPACE</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2 px-2">
                <DeskSet /><DeskSet /><DeskSet /><DeskSet />
              </div>
              <div className="absolute bottom-1.5 left-2 text-[8px] text-slate-400">bookshelf</div>
              <div className="absolute bottom-1.5 right-2 text-sm">🌱</div>
            </div>

            <div className="absolute border-[3px] border-purple-500 bg-[#1d2230]/95 rounded-sm p-2 shadow-[0_0_20px_#a855f766]" style={{ left: 436, top: 210, width: 316, height: 190 }}>
              <div className="text-[9px] font-bold text-purple-300">COMMAND CENTER</div>
              <div className="mt-1 h-14 rounded-[3px] border border-cyan-800 bg-gradient-to-r from-[#062033] via-[#0a3a5c] to-[#062033] relative overflow-hidden flex">
                <div className="flex-1 flex items-center justify-center text-lg">🗺️</div>
                <div className="flex-1 border-l border-cyan-800/60 flex items-center justify-center gap-1 text-[10px]">📊📈📉</div>
                <div className="flex-1 border-l border-cyan-800/60 flex items-center justify-center text-[10px]">🖥️🖥️🖥️</div>
              </div>
              <div className="flex justify-center gap-2 mt-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-20 h-7 bg-[#0b1526] border border-cyan-800 rounded-[2px] flex items-center justify-center gap-0.5">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="w-4 h-3 bg-[#0ea5e9] border border-cyan-900 rounded-[1px]" />
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute left-1 top-16 w-3 h-16 bg-black border border-cyan-800 rounded-[2px] flex flex-col items-center py-1 gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                ))}
              </div>
              <div className="absolute" style={{ left: 140, top: 118 }}>
                <AvatarChip emoji="🧙" label="Satoru" color="#22d3ee" />
              </div>
              <div className="absolute bottom-1 right-2 text-xs">🌱</div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 8, top: 408, width: 220, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">LOUNGE</div>
              <div className="flex gap-1.5 mt-2">
                <div className="w-14 h-10 bg-[#111] border border-slate-600 rounded-[3px]" />
                <div className="w-14 h-10 bg-[#111] border border-slate-600 rounded-[3px]" />
              </div>
              <div className="mx-auto mt-1.5 w-20 h-6 bg-[#7a5230] border border-[#4c3016] rounded-[2px]" />
              <div className="flex justify-between mt-2 text-xs"><span>💡</span><span>🌱</span><span>💡</span></div>
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
              <div className="absolute bottom-1 right-2 text-xs">🌱</div>
            </div>

            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2" style={{ left: 514, top: 408, width: 238, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300">SERVER / OPS ROOM</div>
              <div className="flex gap-2 mt-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-10 h-24 bg-black border border-slate-600 rounded-[3px] flex flex-col items-center py-1.5 gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className={`w-5 h-1.5 rounded-[1px] ${j % 2 ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-2">
                <div className="w-16 h-6 bg-[#3a3f4b] border border-slate-600 rounded-[2px]" />
                <div className="w-16 h-6 bg-[#3a3f4b] border border-slate-600 rounded-[2px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-slate-300 pb-2 border-b border-slate-800">
            TERMINAL <span className="text-emerald-400">OPEN: RUN CLAUDE TO START SATORU</span>
          </div>
          <div className="flex-1 mt-2 bg-black rounded-lg p-3 border border-slate-800 overflow-y-auto space-y-1 text-[11px] leading-relaxed min-h-[480px]">
            {logs.map((l, i) => (
              <div key={i} className={l.startsWith('PS') ? 'text-slate-100' : l.startsWith('[') ? 'text-cyan-300' : 'text-slate-400'}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
