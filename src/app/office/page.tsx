'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

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
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  isMoving: boolean;
  speech?: string;
}

const ROOM_POS: Record<string, { x: number; z: number }> = {
  'Briefing Room A': { x: -8, z: -5.5 },
  'Boardroom': { x: -0.5, z: -5.5 },
  'Private Office': { x: 7.5, z: -5.5 },
  'Workspace Desk 1': { x: -7, z: 0.5 },
  'Workspace Desk 2': { x: -3, z: 0.5 },
  'Command Center': { x: 5.5, z: 0.5 },
  'Lounge & Bedroom': { x: -8, z: 5.5 },
  'Kitchen / Pantry': { x: -0.5, z: 5.5 },
  'Server / Ops Room': { x: 7.5, z: 5.5 },
};

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'Active', currentTask: 'Mengkoordinasikan sprint tim', avatar: '🧙', color: '#22d3ee', room: 'Command Center', activity: 'Monitoring workflow', x: 5.5, z: 0.5, targetX: 5.5, targetZ: 0.5, isMoving: false, speech: 'Semua sistem operasional normal.' },
  { id: '2', name: 'Nagato', role: 'Product Strategy', status: 'Active', currentTask: 'Menganalisis roadmap produk', avatar: '🟠', color: '#fb923c', room: 'Boardroom', activity: 'Review metrics', x: -0.5, z: -5.5, targetX: -0.5, targetZ: -5.5, isMoving: false, speech: 'Roadmap Q4 diselaraskan.' },
  { id: '3', name: 'Itachi', role: 'System Architect', status: 'Coding', currentTask: 'Refactoring modul backend', avatar: '🥷', color: '#a78bfa', room: 'Workspace Desk 1', activity: 'Code review', x: -7, z: 0.5, targetX: -7, targetZ: 0.5, isMoving: false, speech: 'Commit terverifikasi.' },
  { id: '4', name: 'Kisame', role: 'Backend & SRE', status: 'Monitoring', currentTask: 'Memantau uptime server utama', avatar: '🦈', color: '#60a5fa', room: 'Server / Ops Room', activity: 'Infrastruktur watch', x: 7.5, z: 5.5, targetX: 7.5, targetZ: 5.5, isMoving: false, speech: 'Latency stabil, zero leak terjaga.' },
  { id: '5', name: 'Sasori', role: 'Frontend UI/UX', status: 'Coding', currentTask: 'Menyempurnakan UI glassmorphic', avatar: '🎭', color: '#f472b6', room: 'Workspace Desk 2', activity: 'Styling polish', x: -3, z: 0.5, targetX: -3, targetZ: 0.5, isMoving: false, speech: '100% responsif.' },
  { id: '6', name: 'Deidara', role: 'QA & Security', status: 'Testing', currentTask: 'Automated test & audit DLP', avatar: '💥', color: '#facc15', room: 'Briefing Room A', activity: 'Stress test', x: -8, z: -5.5, targetX: -8, targetZ: -5.5, isMoving: false, speech: '0 build error di pipeline.' },
  { id: '7', name: 'Konan', role: 'Documentation & HR', status: 'Syncing', currentTask: 'Dokumen SOP & laporan HRD', avatar: '📄', color: '#34d399', room: 'Private Office', activity: 'Compliance report', x: 7.5, z: -5.5, targetX: 7.5, targetZ: -5.5, isMoving: false, speech: 'Shift patuh regulasi.' },
];

interface ActivityEvent {
  agentId: string;
  targetRoom: keyof typeof ROOM_POS;
  task: string;
  activity: string;
  status: string;
  speech: string;
}

const ACTIVITY_POOL: ActivityEvent[] = [
  { agentId: '3', targetRoom: 'Command Center', task: 'Diskusi arsitektur layanan dengan Satoru', activity: 'Arsitektur Sync', status: 'Moving', speech: 'Koordinasi pembaruan API.' },
  { agentId: '3', targetRoom: 'Server / Ops Room', task: 'Inspeksi koneksi database & cache', activity: 'DB Inspection', status: 'Moving', speech: 'Cek connection pool.' },
  { agentId: '3', targetRoom: 'Workspace Desk 1', task: 'Coding modul pembayaran & audit DLP', activity: 'Core Development', status: 'Coding', speech: 'Menulis endpoint aman.' },
  { agentId: '5', targetRoom: 'Briefing Room A', task: 'Review visual & animasi dengan Deidara', activity: 'Design QA', status: 'Moving', speech: 'Validasi animasi real-time.' },
  { agentId: '5', targetRoom: 'Kitchen / Pantry', task: 'Coffee break singkat di pantry', activity: 'Pantry Break', status: 'Resting', speech: 'Ambil kopi dulu.' },
  { agentId: '5', targetRoom: 'Workspace Desk 2', task: 'Optimasi rendering komponen & motion', activity: 'Frontend Polish', status: 'Coding', speech: 'Smooth transition.' },
  { agentId: '6', targetRoom: 'Server / Ops Room', task: 'Vulnerability scan & probe keamanan', activity: 'Security Probe', status: 'Moving', speech: 'Cek firewall & port.' },
  { agentId: '6', targetRoom: 'Command Center', task: 'Lapor hasil QA 0-fail ke Satoru', activity: 'QA Reporting', status: 'Moving', speech: 'Build 100% hijau.' },
  { agentId: '6', targetRoom: 'Briefing Room A', task: 'Automated test suite ribuan kasus', activity: 'Automated Testing', status: 'Testing', speech: 'Semua test passed.' },
  { agentId: '2', targetRoom: 'Command Center', task: 'Sinkronisasi strategi produk & SLA', activity: 'Executive Sync', status: 'Moving', speech: 'Review kepuasan klien.' },
  { agentId: '2', targetRoom: 'Kitchen / Pantry', task: 'Diskusi informal di pantry', activity: 'Coffee Discussion', status: 'Resting', speech: 'Diskusi strategi.' },
  { agentId: '2', targetRoom: 'Boardroom', task: 'Pimpin review roadmap & layanan', activity: 'Strategy Meeting', status: 'Active', speech: 'Roadmap disetujui.' },
  { agentId: '7', targetRoom: 'Boardroom', task: 'Presentasi audit absensi HRD', activity: 'HR Presentation', status: 'Moving', speech: 'Laporan regulasi.' },
  { agentId: '7', targetRoom: 'Private Office', task: 'Arsip kontrak & dokumentasi', activity: 'Docs Archival', status: 'Active', speech: 'Dokumen terarsip rapi.' },
  { agentId: '1', targetRoom: 'Server / Ops Room', task: 'Inspeksi performa worker & balancer', activity: 'Ops Inspection', status: 'Moving', speech: 'Load server optimal.' },
  { agentId: '1', targetRoom: 'Command Center', task: 'Orkestrasi 7 agen otonom', activity: 'Master Orchestration', status: 'Active', speech: 'Semua agen sesuai standar.' },
  { agentId: '4', targetRoom: 'Server / Ops Room', task: 'SRE 24/7 uptime watcher aktif', activity: '24/7 Sentinel', status: 'Monitoring', speech: 'Monitoring 24/7 aktif.' },
];

function AgentMesh({ agent, isSelected, onSelect }: { agent: Agent; isSelected: boolean; onSelect: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = useRef<any>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dx = agent.targetX - g.position.x;
    const dz = agent.targetZ - g.position.z;
    const dist = Math.hypot(dx, dz);
    const speed = Math.min(1, delta * 1.8);
    g.position.x += dx * speed;
    g.position.z += dz * speed;
    const walking = dist > 0.2;
    g.position.y = walking ? Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.28 : Math.sin(state.clock.elapsedTime * 2 + Number(agent.id)) * 0.04;
    if (walking) g.rotation.y = Math.atan2(dx, dz);
  });

  return (
    <group ref={group} position={[agent.x, 0, agent.z]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.55, 0]} onClick={onSelect}>
        <cylinderGeometry args={[0.28, 0.34, 0.85, 20]} />
        <meshStandardMaterial color={agent.color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0]} onClick={onSelect}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 32]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.9} />
        </mesh>
      )}
      <Html position={[0, 1.85, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {agent.speech && (
            <div style={{ background: 'rgba(0,0,0,0.88)', border: '1px solid #334155', borderRadius: 6, padding: '2px 6px', fontSize: 9, color: '#a5f3fc', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
              {agent.isMoving ? 'Berjalan ' : ''}{agent.speech}
            </div>
          )}
          <div style={{ background: 'rgba(0,0,0,0.9)', border: `2px solid ${agent.color}`, borderRadius: 999, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {agent.status === 'Off Duty' ? '😴' : agent.avatar}
          </div>
          <div style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #475569', borderRadius: 4, padding: '0 5px', fontSize: 9, fontWeight: 700, color: agent.color, whiteSpace: 'nowrap' }}>
            {agent.name}{agent.isMoving ? ' ...' : ''}
          </div>
        </div>
      </Html>
    </group>
  );
}

function RoomPlate({ x, z, w, d, color, label }: { x: number; z: number; w: number; d: number; color: string; label: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <Html position={[0, 0.05, -d / 2 + 0.35]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: '#e2e8f0', background: 'rgba(0,0,0,0.55)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{label}</div>
      </Html>
    </group>
  );
}

function Furniture() {
  return (
    <group>
      <mesh position={[-0.5, 0.3, -5.5]}>
        <boxGeometry args={[3.4, 0.6, 1.2]} />
        <meshStandardMaterial color="#3b4256" roughness={0.6} />
      </mesh>
      <mesh position={[-7, 0.3, 0.5]}>
        <boxGeometry args={[2.2, 0.6, 1.1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
      <mesh position={[-3, 0.3, 0.5]}>
        <boxGeometry args={[2.2, 0.6, 1.1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
      <mesh position={[5.5, 0.9, -0.6]}>
        <boxGeometry args={[3, 1.6, 0.25]} />
        <meshStandardMaterial color="#0a0d14" emissive="#22d3ee" emissiveIntensity={0.25} />
      </mesh>
      {[[-8.9, 5.2], [-7.9, 5.2], [-8.9, 6.2]].map(([bx, bz], i) => (
        <mesh key={i} position={[bx, 0.2, bz]}>
          <boxGeometry args={[0.9, 0.4, 1.4]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-7.2, 0.25, 6.1]}>
        <boxGeometry args={[1.6, 0.5, 0.7]} />
        <meshStandardMaterial color="#6366f1" roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.35, 5.9]}>
        <boxGeometry args={[2.6, 0.7, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {[6.6, 7.5, 8.4].map((rx, i) => (
        <mesh key={i} position={[rx, 0.7, 6.3]}>
          <boxGeometry args={[0.8, 1.4, 0.6]} />
          <meshStandardMaterial color="#052e16" emissive="#10b981" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <mesh position={[-8, 0.35, -4.6]}>
        <boxGeometry args={[2.4, 0.7, 0.8]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>
      <mesh position={[7.5, 0.35, -5.5]}>
        <boxGeometry args={[1.8, 0.7, 1]} />
        <meshStandardMaterial color="#134e4a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.6, -3.4]}>
        <boxGeometry args={[20, 1.2, 0.15]} />
        <meshStandardMaterial color="#2b3245" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.6, 2.9]}>
        <boxGeometry args={[20, 1.2, 0.15]} />
        <meshStandardMaterial color="#2b3245" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[2.6, 0.6, 0]}>
        <boxGeometry args={[0.15, 1.2, 12]} />
        <meshStandardMaterial color="#2b3245" roughness={0.9} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function OfficeScene({ agents, selectedId, onSelect }: { agents: Agent[]; selectedId: string; onSelect: (a: Agent) => void }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} />
      <pointLight position={[5.5, 4, 0.5]} intensity={12} color="#a855f7" distance={12} />
      <pointLight position={[7.5, 4, 5.5]} intensity={10} color="#10b981" distance={10} />
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[21, 0.15, 15]} />
        <meshStandardMaterial color="#171b25" roughness={1} />
      </mesh>
      <gridHelper args={[21, 21, '#334155', '#232a3b']} position={[0, -0.06, 0]} />
      <RoomPlate x={-8} z={-5.5} w={4.6} d={3.6} color="#2a2417" label="BRIEFING ROOM A" />
      <RoomPlate x={-0.5} z={-5.5} w={6.4} d={3.6} color="#262a34" label="BOARDROOM" />
      <RoomPlate x={7.5} z={-5.5} w={4.4} d={3.6} color="#1d2b26" label="PRIVATE OFFICE" />
      <RoomPlate x={-5} z={0.5} w={8.6} d={4.2} color="#232838" label="OPEN WORKSPACE" />
      <RoomPlate x={5.5} z={0.5} w={6.4} d={4.2} color="#241f38" label="COMMAND CENTER" />
      <RoomPlate x={-8} z={5.5} w={4.6} d={3.8} color="#232540" label="LOUNGE & BEDROOM" />
      <RoomPlate x={-0.5} z={5.5} w={6.4} d={3.8} color="#2e2517" label="KITCHEN / PANTRY" />
      <RoomPlate x={7.5} z={5.5} w={4.4} d={3.8} color="#14291f" label="SERVER / OPS ROOM" />
      <Furniture />
      {agents.map((a) => (
        <AgentMesh key={a.id} agent={a} isSelected={selectedId === a.id} onSelect={() => onSelect(a)} />
      ))}
      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.15} minDistance={6} maxDistance={30} target={[0, 0, 0]} />
    </>
  );
}

export default function Office3DPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — 3D Office Engine Initialized',
    'Realtime walking telemetry aktif [koordinat & aktivitas sinkron]',
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(INITIAL_AGENTS[0]);
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const activityIndexRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }));
    }, 1000);

    const motionTimer = setInterval(() => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour: 'numeric', hour12: false }));
      const isOperational = hour >= 8 && hour < 19;

      if (!isOperational) {
        setAgents((prev) =>
          prev.map((ag, idx) => {
            if (ag.id === '4') {
              const p = ROOM_POS['Server / Ops Room'];
              return { ...ag, room: 'Server / Ops Room', targetX: p.x, targetZ: p.z, currentTask: 'SRE 24/7 Uptime Watcher aktif', status: 'Monitoring', activity: 'Infrastructure Sentinel', isMoving: true, speech: 'Menjaga server saat tim istirahat.' };
            }
            const bx = -8.9 + (idx % 2) * 1.1;
            const bz = 5.1 + Math.floor(idx / 2) * 0.7;
            return { ...ag, room: 'Lounge & Bedroom', targetX: bx, targetZ: bz, currentTask: 'Off Duty (Tidur & Istirahat)', status: 'Off Duty', activity: 'Standby Shift Besok', isMoving: true, speech: 'Istirahat di kamar tidur.' };
          })
        );
        return;
      }

      const event = ACTIVITY_POOL[activityIndexRef.current % ACTIVITY_POOL.length];
      activityIndexRef.current += 1;
      const dest = ROOM_POS[event.targetRoom];
      const jitterX = (Number(event.agentId) % 3) * 0.55;

      setAgents((prev) =>
        prev.map((ag) =>
          ag.id === event.agentId
            ? { ...ag, room: event.targetRoom, targetX: dest.x + jitterX, targetZ: dest.z, currentTask: `Menuju ${event.targetRoom}: ${event.task}`, activity: event.activity, status: 'Moving', isMoving: true, speech: event.speech }
            : ag
        )
      );

      const timestamp = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
      const chosen = INITIAL_AGENTS.find((a) => a.id === event.agentId);
      if (chosen) setLogs((p) => [`[${timestamp}] ${chosen.name} berjalan ke ${event.targetRoom} — ${event.task}`, ...p.slice(0, 49)]);

      setTimeout(() => {
        setAgents((prev) =>
          prev.map((ag) => (ag.id === event.agentId ? { ...ag, isMoving: false, status: event.status === 'Moving' ? 'Active' : event.status, currentTask: event.task } : ag))
        );
      }, 2200);
    }, 4000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(motionTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Agent Office HQ — 3D Realtime Walk</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE 3D WALKING TELEMETRY</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-slate-400 font-mono text-[10px]">WAKTU OPERASIONAL (WIB)</span>
            <span className="text-cyan-400 font-bold font-mono text-sm tracking-widest">{currentTime || '--:--:--'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
            <span>3D Realtime Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] min-h-[calc(100vh-3rem)]">
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">
            <span>Live Agent Directory</span>
            <span className="text-[10px] text-cyan-400 font-mono">7 Agen • 3D</span>
          </div>
          {agents.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAgent(a)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedAgent.id === a.id ? 'bg-[#1e2535] border-cyan-500/60 shadow-lg' : 'bg-[#171c26] border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 shadow ${a.isMoving ? 'animate-bounce' : ''}`} style={{ borderColor: a.color, background: '#0b0e14' }}>
                  {a.status === 'Off Duty' ? '😴' : a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold truncate">{a.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${a.isMoving ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : a.status === 'Off Duty' ? 'bg-slate-700/30 text-slate-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                      {a.isMoving ? 'Berjalan' : a.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">📍 {a.room}</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-cyan-300 bg-black/40 p-1.5 rounded border border-cyan-900/40 font-mono truncate">⚡ {a.currentTask}</div>
            </div>
          ))}
          <div className="text-[10px] text-slate-500 pt-2 px-1 text-center">PT. Indo Jaya Gram • 3D Motion Engine</div>
        </div>

        <div className="bg-[#14161c] p-4 overflow-auto flex items-center justify-center">
          <div className="relative rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl shrink-0 w-full" style={{ height: 640, background: '#0d1017' }}>
            {mounted ? (
              <Canvas shadows camera={{ position: [0, 14, 14], fov: 48 }} dpr={[1, 2]}>
                <OfficeScene agents={agents} selectedId={selectedAgent.id} onSelect={setSelectedAgent} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-sm">Memuat 3D office…</div>
            )}
            <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 border border-slate-700 rounded px-2 py-1 text-slate-300 pointer-events-none">
              Drag: putar • Scroll: zoom • Klik avatar: detail agen
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono bg-black/70 border border-cyan-900/50 rounded px-2 py-1 text-cyan-200 truncate pointer-events-none">
              🎯 {selectedAgent.name} ({selectedAgent.role}) — 📍 {selectedAgent.room} — ⚡ {selectedAgent.currentTask}
            </div>
          </div>
        </div>

        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>LIVE 3D MOTION TELEMETRY</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex-1 mt-2 bg-black rounded-lg p-3 border border-slate-800 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed min-h-[480px]">
            {logs.map((l, i) => (
              <div key={i} className="text-emerald-400 border-b border-slate-900/50 pb-1">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
