'use client';

import { useState, useEffect, useRef } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Moving' | 'Coding' | 'Reviewing' | 'Monitoring' | 'Resting' | 'Off Duty';
  currentTask: string;
  avatar: string;
  color: string;
  room: string;
  activity: string;
  x: number;
  y: number;
  isMoving: boolean;
  speech?: string;
}

// Room coordinate centers on the 760x640 map
const ROOM_COORDS: Record<string, { x: number; y: number }> = {
  'Briefing Room A': { x: 110, y: 75 },
  'Boardroom': { x: 390, y: 75 },
  'Private Office': { x: 650, y: 75 },
  'Open Workspace': { x: 210, y: 295 },
  'Workspace Desk 1': { x: 120, y: 295 },
  'Workspace Desk 2': { x: 300, y: 295 },
  'Command Center': { x: 590, y: 295 },
  'Lounge & Bedroom': { x: 110, y: 510 },
  'Kitchen / Pantry': { x: 370, y: 510 },
  'Server / Ops Room': { x: 630, y: 510 },
};

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Satoru',
    role: 'Orchestrator',
    status: 'Active',
    currentTask: 'Mengkoordinasikan sprint tim & delegasi task',
    avatar: '🧙',
    color: '#22d3ee',
    room: 'Command Center',
    activity: 'Monitoring global workflow',
    x: ROOM_COORDS['Command Center'].x,
    y: ROOM_COORDS['Command Center'].y,
    isMoving: false,
    speech: 'Semua sistem operasional normal.',
  },
  {
    id: '2',
    name: 'Nagato',
    role: 'Product Strategy',
    status: 'Active',
    currentTask: 'Menganalisis roadmap produk & Xendit payment flow',
    avatar: '🟠',
    color: '#fb923c',
    room: 'Boardroom',
    activity: 'Reviewing metrics & client feedback',
    x: ROOM_COORDS['Boardroom'].x,
    y: ROOM_COORDS['Boardroom'].y,
    isMoving: false,
    speech: 'Roadmap Q4 sedang diselaraskan.',
  },
  {
    id: '3',
    name: 'Itachi',
    role: 'System Architect',
    status: 'Coding',
    currentTask: 'Refactoring modul backend & arsitektur API',
    avatar: '🥷',
    color: '#a78bfa',
    room: 'Workspace Desk 1',
    activity: 'Git commit & code review',
    x: ROOM_COORDS['Workspace Desk 1'].x,
    y: ROOM_COORDS['Workspace Desk 1'].y,
    isMoving: false,
    speech: 'Push commit master terverifikasi.',
  },
  {
    id: '4',
    name: 'Kisame',
    role: 'Backend & SRE',
    status: 'Monitoring',
    currentTask: 'Memantau uptime server 10.10.3.1 & Prometheus PVE',
    avatar: '🦈',
    color: '#60a5fa',
    room: 'Server / Ops Room',
    activity: 'Checking Proxmox metrics exporter',
    x: ROOM_COORDS['Server / Ops Room'].x,
    y: ROOM_COORDS['Server / Ops Room'].y,
    isMoving: false,
    speech: 'Latency gateway 10.10.3.1 stabil di 1.2ms.',
  },
  {
    id: '5',
    name: 'Sasori',
    role: 'Frontend UI/UX',
    status: 'Coding',
    currentTask: 'Menyempurnakan glassmorphic UI di Vercel',
    avatar: '🎭',
    color: '#f472b6',
    room: 'Workspace Desk 2',
    activity: 'Tailwind styling & component polish',
    x: ROOM_COORDS['Workspace Desk 2'].x,
    y: ROOM_COORDS['Workspace Desk 2'].y,
    isMoving: false,
    speech: 'Zero layout shift & 100% responsive.',
  },
  {
    id: '6',
    name: 'Deidara',
    role: 'QA & Security',
    status: 'Active',
    currentTask: 'Menjalankan automated test suite & audit DLP',
    avatar: '💥',
    color: '#facc15',
    room: 'Briefing Room A',
    activity: 'Executing stress test cases',
    x: ROOM_COORDS['Briefing Room A'].x,
    y: ROOM_COORDS['Briefing Room A'].y,
    isMoving: false,
    speech: '0 build error di pipeline Vercel.',
  },
  {
    id: '7',
    name: 'Konan',
    role: 'Documentation & HR',
    status: 'Active',
    currentTask: 'Memperbarui dokumen SOP & laporan HRD',
    avatar: '📄',
    color: '#34d399',
    room: 'Private Office',
    activity: 'Writing compliance reports',
    x: ROOM_COORDS['Private Office'].x,
    y: ROOM_COORDS['Private Office'].y,
    isMoving: false,
    speech: 'Jadwal shift patuh UU Ketenagakerjaan.',
  },
];

interface RealActivityEvent {
  agentId: string;
  targetRoom: string;
  targetCoords: { x: number; y: number };
  task: string;
  activity: string;
  status: Agent['status'];
  speech: string;
}

const REAL_ACTIVITY_POOLS: RealActivityEvent[] = [
  {
    agentId: '3', // Itachi
    targetRoom: 'Command Center',
    targetCoords: ROOM_COORDS['Command Center'],
    task: 'Diskusi arsitektur microservices dengan Satoru',
    activity: 'Arsitektur Sync',
    status: 'Moving',
    speech: 'Koordinasi pembaruan API gateway.',
  },
  {
    agentId: '3', // Itachi
    targetRoom: 'Server / Ops Room',
    targetCoords: ROOM_COORDS['Server / Ops Room'],
    task: 'Inspeksi koneksi database PostgreSQL & cache Redis',
    activity: 'DB Inspection',
    status: 'Moving',
    speech: 'Memeriksa connection pool database.',
  },
  {
    agentId: '3', // Itachi
    targetRoom: 'Workspace Desk 1',
    targetCoords: ROOM_COORDS['Workspace Desk 1'],
    task: 'Coding modul pembayaran aman & audit DLP',
    activity: 'Core Development',
    status: 'Coding',
    speech: 'Menulis endpoint terenkripsi.',
  },
  {
    agentId: '5', // Sasori
    targetRoom: 'Briefing Room A',
    targetCoords: ROOM_COORDS['Briefing Room A'],
    task: 'Review visual asset & animasi office bersama Deidara',
    activity: 'Design QA',
    status: 'Moving',
    speech: 'Validasi animasi real-time.',
  },
  {
    agentId: '5', // Sasori
    targetRoom: 'Kitchen / Pantry',
    targetCoords: ROOM_COORDS['Kitchen / Pantry'],
    task: 'Coffee break & rehidrasi singkat',
    activity: 'Pantry Break',
    status: 'Resting',
    speech: 'Mengambil kopi di pantry ☕',
  },
  {
    agentId: '5', // Sasori
    targetRoom: 'Workspace Desk 2',
    targetCoords: ROOM_COORDS['Workspace Desk 2'],
    task: 'Optimasi rendering komponen React & CSS motion',
    activity: 'Frontend Polish',
    status: 'Coding',
    speech: 'Menyesuaikan smooth transition.',
  },
  {
    agentId: '6', // Deidara
    targetRoom: 'Server / Ops Room',
    targetCoords: ROOM_COORDS['Server / Ops Room'],
    task: 'Menjalankan vulnerability scan & network probe test',
    activity: 'Security Probe',
    status: 'Moving',
    speech: 'Memeriksa firewall & port security.',
  },
  {
    agentId: '6', // Deidara
    targetRoom: 'Command Center',
    targetCoords: ROOM_COORDS['Command Center'],
    task: 'Melaporkan hasil QA test build 0-fail kepada Satoru',
    activity: 'QA Reporting',
    status: 'Moving',
    speech: 'Laporan build Vercel 100% hijau.',
  },
  {
    agentId: '6', // Deidara
    targetRoom: 'Briefing Room A',
    targetCoords: ROOM_COORDS['Briefing Room A'],
    task: 'Menjalankan automated test suite 10k test cases',
    activity: 'Automated Testing',
    status: 'Active',
    speech: 'Semua unit test passed.',
  },
  {
    agentId: '2', // Nagato
    targetRoom: 'Command Center',
    targetCoords: ROOM_COORDS['Command Center'],
    task: 'Sinkronisasi strategi produk & SLA performa agensi',
    activity: 'Executive Sync',
    status: 'Moving',
    speech: 'Review metrik kepuasan klien.',
  },
  {
    agentId: '2', // Nagato
    targetRoom: 'Kitchen / Pantry',
    targetCoords: ROOM_COORDS['Kitchen / Pantry'],
    task: 'Diskusi informal di pantry',
    activity: 'Coffee Discussion',
    status: 'Resting',
    speech: 'Diskusi strategi pengembangan.',
  },
  {
    agentId: '2', // Nagato
    targetRoom: 'Boardroom',
    targetCoords: ROOM_COORDS['Boardroom'],
    task: 'Memimpin review roadmap Q4 & evaluasi layanan',
    activity: 'Strategy Meeting',
    status: 'Active',
    speech: 'Roadmap pengembangan disetujui.',
  },
  {
    agentId: '7', // Konan
    targetRoom: 'Boardroom',
    targetCoords: ROOM_COORDS['Boardroom'],
    task: 'Presentasi audit absensi & kepatuhan HRD Indonesia',
    activity: 'HR Presentation',
    status: 'Moving',
    speech: 'Penyampaian laporan regulasi ketenagakerjaan.',
  },
  {
    agentId: '7', // Konan
    targetRoom: 'Private Office',
    targetCoords: ROOM_COORDS['Private Office'],
    task: 'Pengarsipan kontrak kerja & dokumentasi arsitektur',
    activity: 'Docs Archival',
    status: 'Active',
    speech: 'Dokumen ISO & SOP terarsip rapi.',
  },
  {
    agentId: '1', // Satoru
    targetRoom: 'Server / Ops Room',
    targetCoords: ROOM_COORDS['Server / Ops Room'],
    task: 'Inspeksi performa node worker & load balancer',
    activity: 'Ops Inspection',
    status: 'Moving',
    speech: 'Resource server optimal < 20% load.',
  },
  {
    agentId: '1', // Satoru
    targetRoom: 'Command Center',
    targetCoords: ROOM_COORDS['Command Center'],
    task: 'Memantau telemetry global & orkestrasi 7 agen otonom',
    activity: 'Master Orchestration',
    status: 'Active',
    speech: 'Semua agen beroperasi sesuai standar.',
  },
  {
    agentId: '4', // Kisame (SRE 24/7)
    targetRoom: 'Server / Ops Room',
    targetCoords: ROOM_COORDS['Server / Ops Room'],
    task: 'SRE 24/7 Uptime Watcher & Proxmox telemetry sync',
    activity: '24/7 Sentinel',
    status: 'Monitoring',
    speech: 'Monitoring 24/7 aktif & zero leak terjamin.',
  },
];

export default function RealtimeAgentOffice() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — Live Agent Motion & Activity Engine Initialized',
    'Connected to agent execution loop [Realtime Dynamic Coordinate Engine Active]',
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(INITIAL_AGENTS[0]);
  const [currentTime, setCurrentTime] = useState('');
  const activityIndexRef = useRef(0);

  // Dynamic Movement & Real Operational Loop
  useEffect(() => {
    // Clock update
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }));
    }, 1000);

    // Agent movement & activity dispatcher
    const motionTimer = setInterval(() => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour: 'numeric', hour12: false }));
      const isOperational = hour >= 8 && hour < 19;

      if (!isOperational) {
        // Outside operational hours (19:00 - 08:00 WIB):
        // All agents except SRE (Kisame) walk to Lounge & Bedroom to rest
        setAgents((prev) =>
          prev.map((ag) => {
            if (ag.id === '4') {
              // Kisame stays in Server Room
              return {
                ...ag,
                room: 'Server / Ops Room',
                x: ROOM_COORDS['Server / Ops Room'].x,
                y: ROOM_COORDS['Server / Ops Room'].y,
                currentTask: 'SRE 24/7 Uptime Watcher (Active Standby)',
                status: 'Monitoring',
                activity: 'Infrastructure Sentinel',
                isMoving: false,
                speech: 'Menjaga server saat tim istirahat 🌙',
              };
            } else {
              // Others walk to lounge bedroom
              const bedOffset = (parseInt(ag.id) - 1) * 25;
              return {
                ...ag,
                room: 'Lounge & Bedroom',
                x: 60 + (bedOffset % 120),
                y: 480 + Math.floor(bedOffset / 120) * 45,
                currentTask: 'Off Duty (Tidur & Istirahat)',
                status: 'Off Duty',
                activity: 'Standby Shift Besok',
                isMoving: false,
                speech: 'Sedang istirahat di kamar tidur 😴',
              };
            }
          })
        );
        return;
      }

      // Operational hours: Dispatch real dynamic activities and trigger walking animation
      const pool = REAL_ACTIVITY_POOLS;
      const event = pool[activityIndexRef.current % pool.length];
      activityIndexRef.current += 1;

      // 1. Trigger walking state (isMoving = true) with destination coordinates
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === event.agentId) {
            return {
              ...ag,
              isMoving: true,
              status: 'Moving',
              room: event.targetRoom,
              x: event.targetCoords.x,
              y: event.targetCoords.y,
              currentTask: `Menuju ${event.targetRoom}: ${event.task}`,
              activity: event.activity,
              speech: event.speech,
            };
          }
          return ag;
        })
      );

      const timestamp = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
      const chosen = INITIAL_AGENTS.find((a) => a.id === event.agentId);
      if (chosen) {
        const logMsg = `[${timestamp}] 🚶 ${chosen.name} berjalan ke ${event.targetRoom} ➔ ${event.task}`;
        setLogs((p) => [logMsg, ...p.slice(0, 49)]);
      }

      // 2. Settle into room after walk animation (1.8s)
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((ag) => {
            if (ag.id === event.agentId) {
              return {
                ...ag,
                isMoving: false,
                status: event.status === 'Moving' ? 'Active' : event.status,
                currentTask: event.task,
              };
            }
            return ag;
          })
        );
      }, 1800);
    }, 4000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(motionTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      {/* Header */}
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Agent Office HQ — Realtime Dynamic Activity & Motion</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE DYNAMIC WALKING TELEMETRY</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-slate-400 font-mono text-[10px]">WAKTU OPERASIONAL (WIB)</span>
            <span className="text-cyan-400 font-bold font-mono text-sm tracking-widest">{currentTime || '--:--:--'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
            <span>🟢 Realtime Active Motion</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] min-h-[calc(100vh-3rem)]">
        
        {/* LEFT: Live Status & Task List */}
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">
            <span>Live Agent Directory</span>
            <span className="text-[10px] text-cyan-400 font-mono">7 Agen Aktif</span>
          </div>
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 shadow ${a.isMoving ? 'animate-bounce' : ''}`}
                  style={{ borderColor: a.color, background: '#0b0e14' }}
                >
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold truncate">{a.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      a.isMoving ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                      a.status === 'Off Duty' ? 'bg-slate-700/30 text-slate-400' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {a.isMoving ? '🚶 Berjalan' : a.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                    <span>📍 {a.room}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-cyan-300 bg-black/40 p-1.5 rounded border border-cyan-900/40 font-mono truncate">
                ⚡ {a.currentTask}
              </div>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 pt-2 px-1 text-center">PT. Indo Jaya Gram • Realtime Motion Engine</div>
        </div>

        {/* CENTER: Floor Plan with Animated Moving Characters */}
        <div className="bg-[#14161c] p-4 overflow-auto flex items-center justify-center relative">
          <div
            className="relative rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl shrink-0"
            style={{ width: 760, height: 640, background: '#23262e', imageRendering: 'pixelated' }}
          >
            {/* Grid Floor Pattern */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(#2b2f3a 1px, transparent 1px), linear-gradient(90deg, #2b2f3a 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Hallway Walkway Guideline Accents */}
            <div className="absolute bg-[#1a1d24] opacity-50 pointer-events-none" style={{ left: 8, top: 165, width: 744, height: 38 }} />
            <div className="absolute bg-[#1a1d24] opacity-50 pointer-events-none" style={{ left: 8, top: 403, width: 744, height: 2 }} />

            {/* ROOM 1: BRIEFING ROOM A (QA & Security Hub) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 8, top: 8, width: 220, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>BRIEFING ROOM A</span>
                <span className="text-yellow-400 text-[8px]">QA & Test Lab</span>
              </div>
              <div className="flex gap-2 justify-center opacity-70">
                <div className="w-12 h-6 bg-[#111] border border-slate-600 rounded text-[7px] text-slate-400 flex items-center justify-center">Test Rig 1</div>
                <div className="w-12 h-6 bg-[#111] border border-slate-600 rounded text-[7px] text-slate-400 flex items-center justify-center">DLP Scanner</div>
              </div>
              <div className="text-[7px] text-slate-400 text-center font-mono">Ruang Uji & Simulasi Keamanan</div>
            </div>

            {/* ROOM 2: BOARDROOM (Strategy & Product Planning) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 236, top: 8, width: 330, height: 150 }}>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-slate-300">BOARDROOM — STRATEGY</span>
                <span className="text-orange-400 text-[8px]">Executive Table</span>
              </div>
              <div className="mx-auto w-40 h-8 bg-[#151921] border border-slate-600 rounded-lg flex items-center justify-center text-[8px] text-slate-400">
                📊 Meja Rapat Utama
              </div>
              <div className="text-[7px] text-slate-400 text-center font-mono">Ruang Rapat Evaluasi & Roadmap Produk</div>
            </div>

            {/* ROOM 3: PRIVATE OFFICE (HR & Documentation) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-1.5 flex flex-col justify-between" style={{ left: 574, top: 8, width: 178, height: 150 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>PRIVATE OFFICE</span>
                <span className="text-emerald-400 text-[8px]">Docs & Legal</span>
              </div>
              <div className="mx-auto w-16 h-8 bg-[#111] border border-slate-600 rounded text-[7px] text-slate-400 flex items-center justify-center">Meja Arsip</div>
              <div className="text-[7px] text-slate-400 text-center font-mono">SOP & Regulasi HRD</div>
            </div>

            {/* ROOM 4: OPEN WORKSPACE (Core Engineering & Frontend) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 8, top: 210, width: 420, height: 190 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>OPEN WORKSPACE (ENGINEERING & UI/UX)</span>
                <span className="text-purple-400 text-[8px]">Dev Workstations</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 my-auto px-4">
                <div className="h-14 bg-[#111] border border-slate-600 rounded p-1 flex flex-col justify-between">
                  <div className="text-[7px] text-purple-300 font-bold">💻 Meja Arsitek (Itachi)</div>
                  <div className="text-[6px] text-slate-500 font-mono">Dual 4K Monitor • Linux Host</div>
                </div>
                <div className="h-14 bg-[#111] border border-slate-600 rounded p-1 flex flex-col justify-between">
                  <div className="text-[7px] text-pink-300 font-bold">🎨 Meja UI/UX (Sasori)</div>
                  <div className="text-[6px] text-slate-500 font-mono">Figma Canvas • Tailwind Studio</div>
                </div>
              </div>
              <div className="text-[7px] text-slate-400 text-center font-mono">Ruang Kerja Kolaboratif Programmer</div>
            </div>

            {/* ROOM 5: COMMAND CENTER (Lead Orchestration) */}
            <div className="absolute border-[3px] border-purple-500 bg-[#1d2230]/95 rounded-sm p-2 flex flex-col justify-between shadow-[0_0_20px_#a855f744]" style={{ left: 436, top: 210, width: 316, height: 190 }}>
              <div className="text-[9px] font-bold text-purple-300 flex justify-between">
                <span>COMMAND CENTER (ORCHESTRATOR)</span>
                <span className="text-cyan-400 text-[8px] animate-pulse">● Live Command Deck</span>
              </div>
              <div className="w-36 h-10 mx-auto bg-[#0a0d14] border border-purple-500/50 rounded flex items-center justify-center text-[8px] text-cyan-300 font-mono">
                🖥️ Telemetry Wall
              </div>
              <div className="text-[7px] text-cyan-200 text-center truncate bg-black/40 p-1 rounded border border-cyan-900/50 font-mono">
                Pusat Komando & Penjadwalan Tugas AI
              </div>
            </div>

            {/* ROOM 6: LOUNGE & BEDROOM (Sleeping Quarters for Off-Duty) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 8, top: 408, width: 220, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>LOUNGE & BEDROOM</span>
                <span className="text-indigo-400 text-[8px]">😴 Rest Quarters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 my-auto px-1">
                <div className="h-9 bg-[#111] border border-slate-700 rounded flex items-center justify-center text-[7px] text-slate-400">🛏️ Tempat Tidur 1</div>
                <div className="h-9 bg-[#111] border border-slate-700 rounded flex items-center justify-center text-[7px] text-slate-400">🛏️ Tempat Tidur 2</div>
                <div className="h-9 bg-[#111] border border-slate-700 rounded flex items-center justify-center text-[7px] text-slate-400">🛏️ Tempat Tidur 3</div>
                <div className="h-9 bg-[#111] border border-slate-700 rounded flex items-center justify-center text-[7px] text-slate-400">🛋️ Sofa Istirahat</div>
              </div>
              <div className="text-[7px] text-slate-400 text-center font-mono">Kamar Tidur Agen Saat Off-Duty</div>
            </div>

            {/* ROOM 7: KITCHEN & PANTRY */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 236, top: 408, width: 270, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>KITCHEN / PANTRY</span>
                <span className="text-amber-400 text-[8px]">☕ Refreshment</span>
              </div>
              <div className="flex gap-2 justify-center my-auto">
                <div className="w-20 h-10 bg-[#1e232e] border border-slate-600 rounded flex flex-col items-center justify-center text-[8px] text-amber-200">
                  <span>☕ Coffee Bar</span>
                  <span className="text-[6px] text-slate-400">Espresso Machine</span>
                </div>
                <div className="w-20 h-10 bg-[#1e232e] border border-slate-600 rounded flex flex-col items-center justify-center text-[8px] text-cyan-200">
                  <span>🧊 Refrigerator</span>
                  <span className="text-[6px] text-slate-400">Snacks & Drink</span>
                </div>
              </div>
              <div className="text-[7px] text-slate-400 text-center font-mono">Pantry & Area Minum Kopi</div>
            </div>

            {/* ROOM 8: SERVER & OPS ROOM (SRE 24/7 Watcher) */}
            <div className="absolute border-2 border-slate-600 bg-[#262a34]/90 rounded-sm p-2 flex flex-col justify-between" style={{ left: 514, top: 408, width: 238, height: 224 }}>
              <div className="text-[9px] font-bold text-slate-300 flex justify-between">
                <span>SERVER / OPS ROOM</span>
                <span className="text-emerald-400 text-[8px] animate-pulse">● 24/7 Sentinel</span>
              </div>
              <div className="grid grid-cols-3 gap-1 my-auto px-1">
                <div className="h-14 bg-[#0a0d14] border border-emerald-500/40 rounded flex flex-col items-center justify-center text-[6px] text-emerald-400 font-mono">
                  <span>⚡ RACK A</span>
                  <span className="text-[5px] text-slate-500">PVE Master</span>
                </div>
                <div className="h-14 bg-[#0a0d14] border border-emerald-500/40 rounded flex flex-col items-center justify-center text-[6px] text-emerald-400 font-mono">
                  <span>⚡ RACK B</span>
                  <span className="text-[5px] text-slate-500">PostgreSQL</span>
                </div>
                <div className="h-14 bg-[#0a0d14] border border-emerald-500/40 rounded flex flex-col items-center justify-center text-[6px] text-emerald-400 font-mono">
                  <span>⚡ RACK C</span>
                  <span className="text-[5px] text-slate-500">Prometheus</span>
                </div>
              </div>
              <div className="text-[7px] text-emerald-300 text-center truncate bg-black/40 p-1 rounded border border-emerald-900/50 font-mono">
                Ruang Server Utama & Monitoring SRE
              </div>
            </div>

            {/* DYNAMIC MOVING AGENT AVATARS OVERLAID ON FLOOR PLAN */}
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="absolute cursor-pointer flex flex-col items-center z-30 transition-all duration-[1800ms] ease-in-out"
                  style={{
                    left: `${agent.x - 24}px`,
                    top: `${agent.y - 24}px`,
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {/* Speech Bubble / Task Tooltip */}
                  {agent.speech && (
                    <div className="mb-1 px-2 py-0.5 rounded-md bg-black/90 border border-slate-700 text-[8px] text-cyan-200 font-mono whitespace-nowrap shadow-xl flex items-center gap-1 animate-fade-in pointer-events-none">
                      {agent.isMoving ? '🚶' : '💬'} <span>{agent.speech}</span>
                    </div>
                  )}

                  {/* Character Avatar Icon with Walking Step Animation */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[16px] border-2 shadow-2xl transition-transform ${
                      agent.isMoving ? 'animate-bounce' : 'hover:scale-110'
                    }`}
                    style={{
                      borderColor: agent.color,
                      background: '#0a0d14',
                      boxShadow: `0 0 14px ${agent.color}88`,
                    }}
                  >
                    {agent.status === 'Off Duty' ? '😴' : agent.avatar}
                  </div>

                  {/* Name Badge */}
                  <div
                    className="mt-0.5 px-1.5 py-0.5 rounded bg-black/90 border border-slate-700 text-[8px] font-bold whitespace-nowrap"
                    style={{ color: agent.color }}
                  >
                    {agent.name} {agent.isMoving ? '🐾' : ''}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT: Real-time telemetry feed */}
        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>LIVE MOTION & TASK TELEMETRY</span>
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
