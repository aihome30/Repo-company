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
  'Boardroom Utama': { x: 0, z: -6 },
  'Command Center': { x: 6, z: -2 },
  'Ruang Arsitek & Dev': { x: -6, z: -2 },
  'Lab QA & Security': { x: -6, z: 4 },
  'Ruang Server SRE': { x: 6, z: 4 },
  'Pantry & Lounge': { x: 0, z: 7 },
  'Kamar Tidur Off-Duty': { x: 0, z: 10 },
};

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'Active', currentTask: 'Memimpin briefing harian tim', avatar: '🧙', color: '#22d3ee', room: 'Boardroom Utama', activity: 'Executive Briefing', x: 0, z: -6, targetX: 0, targetZ: -6, isMoving: false, speech: 'Mari kita mulai sprint hari ini.' },
  { id: '2', name: 'Nagato', role: 'Product Strategy', status: 'Active', currentTask: 'Analisis roadmap & kebutuhan klien', avatar: '🟠', color: '#fb923c', room: 'Boardroom Utama', activity: 'Strategy Planning', x: 1, z: -6, targetX: 1, targetZ: -6, isMoving: false, speech: 'Roadmap Q4 sesuai target.' },
  { id: '3', name: 'Itachi', role: 'System Architect', status: 'Coding', currentTask: 'Refactoring arsitektur NestJS backend', avatar: '🥷', color: '#a78bfa', room: 'Ruang Arsitek & Dev', activity: 'Backend Core', x: -6, z: -2, targetX: -6, targetZ: -2, isMoving: false, speech: 'Clean architecture diterapkan.' },
  { id: '4', name: 'Kisame', role: 'Backend & SRE', status: 'Monitoring', currentTask: 'Memantau telemetry server 24/7', avatar: '🦈', color: '#60a5fa', room: 'Ruang Server SRE', activity: 'Uptime Sentinel', x: 6, z: 4, targetX: 6, targetZ: 4, isMoving: false, speech: 'Uptime 100% stabil.' },
  { id: '5', name: 'Sasori', role: 'Frontend UI/UX', status: 'Coding', currentTask: 'Desain UI glassmorphic agency', avatar: '🎭', color: '#f472b6', room: 'Ruang Arsitek & Dev', activity: 'UI/UX Design', x: -5, z: -2, targetX: -5, targetZ: -2, isMoving: false, speech: 'Animasi Tailwind halus.' },
  { id: '6', name: 'Deidara', role: 'QA & Security', status: 'Testing', currentTask: 'Menjalankan automated test suite', avatar: '💥', color: '#facc15', room: 'Lab QA & Security', activity: 'Stress Testing', x: -6, z: 4, targetX: -6, targetZ: 4, isMoving: false, speech: 'Zero bug terdeteksi.' },
  { id: '7', name: 'Konan', role: 'Documentation & HR', status: 'Syncing', currentTask: 'Menyusun laporan HRD & SOP', avatar: '📄', color: '#34d399', room: 'Boardroom Utama', activity: 'HR Compliance', x: -1, z: -6, targetX: -1, targetZ: -6, isMoving: false, speech: 'Absensi & shift sesuai UU.' },
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
  { agentId: '3', targetRoom: 'Command Center', task: 'Diskusi arsitektur cloud dengan Satoru', activity: 'System Sync', status: 'Moving', speech: 'Koordinasi deployment.' },
  { agentId: '3', targetRoom: 'Ruang Server SRE', task: 'Audit koneksi database PostgreSQL', activity: 'DB Audit', status: 'Moving', speech: 'Memeriksa index query.' },
  { agentId: '3', targetRoom: 'Ruang Arsitek & Dev', task: 'Coding backend API & enkripsi data', activity: 'Coding', status: 'Coding', speech: 'Menulis secure endpoint.' },
  { agentId: '5', targetRoom: 'Boardroom Utama', task: 'Presentasi mockup UI ke Product Manager', activity: 'Design Review', status: 'Moving', speech: 'Memaparkan layout baru.' },
  { agentId: '5', targetRoom: 'Pantry & Lounge', task: 'Istirahat minum kopi di pantry', activity: 'Coffee Break', status: 'Resting', speech: 'Ngopi sebentar ☕' },
  { agentId: '5', targetRoom: 'Ruang Arsitek & Dev', task: 'Implementasi komponen React', activity: 'Frontend Dev', status: 'Coding', speech: 'Polish styling component.' },
  { agentId: '6', targetRoom: 'Ruang Server SRE', task: 'Uji penetrasi & firewall security check', activity: 'Security Audit', status: 'Moving', speech: 'Scan port & firewall.' },
  { agentId: '6', targetRoom: 'Command Center', task: 'Laporan hasil QA build 0-fail', activity: 'QA Reporting', status: 'Moving', speech: 'Build 100% lulus.' },
  { agentId: '6', targetRoom: 'Lab QA & Security', task: 'Menjalankan automated test cases', activity: 'Testing', status: 'Testing', speech: 'Semua test suite hijau.' },
  { agentId: '2', targetRoom: 'Command Center', task: 'Evaluasi metrik performa & klien', activity: 'Metric Review', status: 'Moving', speech: 'Analisis trafik Vercel.' },
  { agentId: '2', targetRoom: 'Pantry & Lounge', task: 'Diskusi santai di lounge kantor', activity: 'Discussion', status: 'Resting', speech: 'Diskusi santai.' },
  { agentId: '2', targetRoom: 'Boardroom Utama', task: 'Memimpin rapat strategi bulanan', activity: 'Board Meeting', status: 'Active', speech: 'Menyusun target Q4.' },
  { agentId: '7', targetRoom: 'Command Center', task: 'Verifikasi laporan absensi shift', activity: 'HR Check', status: 'Moving', speech: 'Pengecekan presensi.' },
  { agentId: '7', targetRoom: 'Boardroom Utama', task: 'Pengarsipan dokumen legal perusahaan', activity: 'Archiving', status: 'Active', speech: 'SOP & kontrak tersimpan.' },
  { agentId: '1', targetRoom: 'Ruang Server SRE', task: 'Inspeksi resource klaster Proxmox', activity: 'Infra Check', status: 'Moving', speech: 'Kapasitas server optimal.' },
  { agentId: '1', targetRoom: 'Boardroom Utama', task: 'Memimpin rapat koordinasi harian', activity: 'Orchestration', status: 'Active', speech: 'Semua divisi berjalan lancar.' },
  { agentId: '4', targetRoom: 'Ruang Server SRE', task: 'SRE 24/7 Uptime Watcher aktif', activity: 'Sentinel', status: 'Monitoring', speech: 'Menjaga server tetap aman.' },
];

function DetailedAgentMesh({ agent, isSelected, onSelect }: { agent: Agent; isSelected: boolean; onSelect: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = useRef<any>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dx = agent.targetX - g.position.x;
    const dz = agent.targetZ - g.position.z;
    const dist = Math.hypot(dx, dz);
    const speed = Math.min(1, delta * 2.2);
    g.position.x += dx * speed;
    g.position.z += dz * speed;

    const walking = dist > 0.15;
    g.position.y = walking ? Math.abs(Math.sin(state.clock.elapsedTime * 12)) * 0.15 : 0;
    if (walking) {
      g.rotation.y = Math.atan2(dx, dz);
    }
  });

  return (
    <group ref={group} position={[agent.x, 0, agent.z]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
      <mesh position={[-0.1, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, 0]} onClick={onSelect} castShadow>
        <boxGeometry args={[0.38, 0.6, 0.22]} />
        <meshStandardMaterial color={agent.color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.15, 0]} onClick={onSelect} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fde047" roughness={0.5} />
      </mesh>
      {isSelected && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.58, 32]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.9} />
        </mesh>
      )}
      <Html position={[0, 1.65, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {agent.speech && (
            <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#38bdf8', whiteSpace: 'nowrap', fontFamily: 'monospace', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {agent.isMoving ? '🚶 ' : '💬 '}{agent.speech}
            </div>
          )}
          <div style={{ background: '#0f172a', border: `2px solid ${agent.color}`, borderRadius: 999, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>
            {agent.status === 'Off Duty' ? '😴' : agent.avatar}
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #475569', borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>
            {agent.name} <span style={{ color: agent.color }}>({agent.role})</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function RealOfficeBuilding() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[24, 0.2, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <gridHelper args={[24, 24, '#334155', '#1e293b']} position={[0, 0, 0]} />

      <mesh position={[0, 1.5, -11.9]}>
        <boxGeometry args={[24, 3, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[-11.9, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[11.9, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      <mesh position={[-4, 1.5, -2]}>
        <boxGeometry args={[6, 3, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[4, 1.5, -2]}>
        <boxGeometry args={[6, 3, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[-4, 1.5, 2]}>
        <boxGeometry args={[6, 3, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[4, 1.5, 2]}>
        <boxGeometry args={[6, 3, 0.15]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Boardroom */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[4.5, 0.08, 2.2]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.8, -1.05]}>
          <boxGeometry args={[3.2, 1.6, 0.1]} />
          <meshStandardMaterial color="#000" emissive="#38bdf8" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Arsitek & Dev */}
      <group position={[-6, 0, -2]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[3.5, 0.06, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[-0.8, 0.9, -0.5]}>
          <boxGeometry args={[1.1, 0.7, 0.08]} />
          <meshStandardMaterial color="#000" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.8, 0.9, -0.5]}>
          <boxGeometry args={[1.1, 0.7, 0.08]} />
          <meshStandardMaterial color="#000" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Command Center */}
      <group position={[6, 0, -2]}>
        <mesh position={[0, 1.2, -1.5]}>
          <boxGeometry args={[4.5, 2.2, 0.2]} />
          <meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Lab QA & Security */}
      <group position={[-6, 0, 4]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[3.2, 0.06, 1.6]} />
          <meshStandardMaterial color="#292524" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#000" emissive="#facc15" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Ruang Server SRE */}
      <group position={[6, 0, 4]}>
        {[-1.2, 0, 1.2].map((rx, i) => (
          <mesh key={i} position={[rx, 1, 0]} castShadow>
            <boxGeometry args={[0.9, 2, 0.8]} />
            <meshStandardMaterial color="#022c22" emissive="#10b981" emissiveIntensity={0.45} />
          </mesh>
        ))}
      </group>

      {/* Pantry & Lounge */}
      <group position={[0, 0, 7]}>
        <mesh position={[-2, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.8, 1]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        <mesh position={[2, 0.3, 0]} castShadow>
          <boxGeometry args={[2.5, 0.6, 1.2]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
      </group>

      {/* Kamar Tidur Off-Duty */}
      <group position={[0, 0, 10]}>
        {[-1.5, 0, 1.5].map((bx, i) => (
          <mesh key={i} position={[bx, 0.25, 0]} castShadow>
            <boxGeometry args={[1.2, 0.5, 2]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OfficeScene({ agents, selectedId, onSelect }: { agents: Agent[]; selectedId: string; onSelect: (a: Agent) => void }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 8, 0]} intensity={25} color="#38bdf8" distance={20} />
      <pointLight position={[6, 6, 4]} intensity={15} color="#10b981" distance={15} />

      <RealOfficeBuilding />

      {agents.map((a) => (
        <DetailedAgentMesh key={a.id} agent={a} isSelected={selectedId === a.id} onSelect={() => onSelect(a)} />
      ))}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={35} target={[0, 0, 0]} />
    </>
  );
}

export default function Office3DRealPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — Professional 3D Corporate Office HQ Initialized',
    'Realtime Corporate Activity & Walking Engine Active',
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
              const p = ROOM_POS['Ruang Server SRE'];
              return { ...ag, room: 'Ruang Server SRE', targetX: p.x, targetZ: p.z, currentTask: 'SRE 24/7 Uptime Watcher aktif', status: 'Monitoring', activity: 'Sentinel Watch', isMoving: true, speech: 'Menjaga server saat malam.' };
            }
            const bedPos = ROOM_POS['Kamar Tidur Off-Duty'];
            const bx = bedPos.x - 1.2 + (idx % 3) * 1.2;
            const bz = bedPos.z + (idx > 3 ? 0.6 : -0.6);
            return { ...ag, room: 'Kamar Tidur Off-Duty', targetX: bx, targetZ: bz, currentTask: 'Off Duty (Tidur & Istirahat)', status: 'Off Duty', activity: 'Resting', isMoving: true, speech: 'Sedang tidur di kamar istirahat.' };
          })
        );
        return;
      }

      const event = ACTIVITY_POOL[activityIndexRef.current % ACTIVITY_POOL.length];
      activityIndexRef.current += 1;
      const dest = ROOM_POS[event.targetRoom];
      const jitterX = (Number(event.agentId) % 3) * 0.4 - 0.4;
      const jitterZ = (Number(event.agentId) % 2) * 0.4 - 0.2;

      setAgents((prev) =>
        prev.map((ag) =>
          ag.id === event.agentId
            ? { ...ag, room: event.targetRoom, targetX: dest.x + jitterX, targetZ: dest.z + jitterZ, currentTask: `Menuju ${event.targetRoom}: ${event.task}`, activity: event.activity, status: 'Moving', isMoving: true, speech: event.speech }
            : ag
        )
      );

      const timestamp = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
      const chosen = INITIAL_AGENTS.find((a) => a.id === event.agentId);
      if (chosen) setLogs((p) => [`[${timestamp}] 🚶 ${chosen.name} berjalan ke ${event.targetRoom} — ${event.task}`, ...p.slice(0, 49)]);

      setTimeout(() => {
        setAgents((prev) =>
          prev.map((ag) => (ag.id === event.agentId ? { ...ag, isMoving: false, status: event.status === 'Moving' ? 'Active' : event.status, currentTask: event.task } : ag))
        );
      }, 2500);
    }, 4500);

    return () => {
      clearInterval(clockTimer);
      clearInterval(motionTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col font-sans select-none">
      <div className="h-12 border-b border-slate-800 bg-[#12151d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">PT. Indo Jaya Gram — Professional 3D Corporate Office HQ</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE CORPORATE 3D TELEMETRY</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-slate-400 font-mono text-[10px]">WAKTU OPERASIONAL (WIB)</span>
            <span className="text-cyan-400 font-bold font-mono text-sm tracking-widest">{currentTime || '--:--:--'}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
            <span>3D Corporate Building Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] min-h-[calc(100vh-3rem)]">
        <div className="border-r border-slate-800 bg-[#10131a] p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">
            <span>Corporate Agent Directory</span>
            <span className="text-[10px] text-cyan-400 font-mono">7 Agen Aktif</span>
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
          <div className="text-[10px] text-slate-500 pt-2 px-1 text-center">PT. Indo Jaya Gram • Professional HQ</div>
        </div>

        <div className="bg-[#14161c] p-4 overflow-auto flex items-center justify-center">
          <div className="relative rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl shrink-0 w-full" style={{ height: 640, background: '#090d16' }}>
            {mounted ? (
              <Canvas shadows camera={{ position: [0, 16, 16], fov: 50 }} dpr={[1, 2]}>
                <OfficeScene agents={agents} selectedId={selectedAgent.id} onSelect={setSelectedAgent} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-sm">Memuat Gedung Kantor 3D…</div>
            )}
            <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 border border-slate-700 rounded px-2 py-1 text-slate-300 pointer-events-none">
              Drag: Putar Kamera • Scroll: Zoom • Klik Karakter: Detail Agen
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono bg-black/70 border border-cyan-900/50 rounded px-2 py-1 text-cyan-200 truncate pointer-events-none">
              🏢 {selectedAgent.name} ({selectedAgent.role}) di {selectedAgent.room} — ⚡ {selectedAgent.currentTask}
            </div>
          </div>
        </div>

        <div className="border-l border-slate-800 bg-[#0d1017] p-3 flex flex-col font-mono text-xs">
          <div className="text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>CORPORATE TELEMETRY STREAM</span>
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
