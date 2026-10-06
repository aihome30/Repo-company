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
  'Boardroom Utama': { x: 0, z: -5.5 },
  'Command Center': { x: 5.5, z: -2 },
  'Ruang Arsitek & Dev': { x: -5.5, z: -2 },
  'Lab QA & Security': { x: -5.5, z: 3.5 },
  'Ruang Server SRE': { x: 5.5, z: 3.5 },
  'Pantry & Lounge': { x: 0, z: 6.5 },
  'Kamar Tidur Off-Duty': { x: 0, z: 9.5 },
};

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Satoru', role: 'Orchestrator', status: 'Active', currentTask: 'Memimpin briefing harian tim', avatar: '🧙', color: '#5e6ad2', room: 'Boardroom Utama', activity: 'Executive Briefing', x: 0, z: -5.5, targetX: 0, targetZ: -5.5, isMoving: false, speech: 'Fokus pada pencapaian Q4.' },
  { id: '2', name: 'Nagato', role: 'Product Strategy', status: 'Active', currentTask: 'Analisis roadmap & kebutuhan klien', avatar: '🟠', color: '#fb923c', room: 'Boardroom Utama', activity: 'Strategy Planning', x: 1, z: -5.5, targetX: 1, targetZ: -5.5, isMoving: false, speech: 'Roadmap Vercel siap.' },
  { id: '3', name: 'Itachi', role: 'System Architect', status: 'Coding', currentTask: 'Refactoring arsitektur NestJS backend', avatar: '🥷', color: '#a78bfa', room: 'Ruang Arsitek & Dev', activity: 'Backend Core', x: -5.5, z: -2, targetX: -5.5, targetZ: -2, isMoving: false, speech: 'Clean architecture.' },
  { id: '4', name: 'Kisame', role: 'Backend & SRE', status: 'Monitoring', currentTask: 'Memantau telemetry server 24/7', avatar: '🦈', color: '#60a5fa', room: 'Ruang Server SRE', activity: 'Uptime Sentinel', x: 5.5, z: 3.5, targetX: 5.5, targetZ: 3.5, isMoving: false, speech: 'Uptime 100% stabil.' },
  { id: '5', name: 'Sasori', role: 'Frontend UI/UX', status: 'Coding', currentTask: 'Desain UI glassmorphic agency', avatar: '🎭', color: '#f472b6', room: 'Ruang Arsitek & Dev', activity: 'UI/UX Design', x: -4.5, z: -2, targetX: -4.5, targetZ: -2, isMoving: false, speech: 'Tailwind UI polished.' },
  { id: '6', name: 'Deidara', role: 'QA & Security', status: 'Testing', currentTask: 'Menjalankan automated test suite', avatar: '💥', color: '#facc15', room: 'Lab QA & Security', activity: 'Stress Testing', x: -5.5, z: 3.5, targetX: -5.5, targetZ: 3.5, isMoving: false, speech: 'Zero bug detected.' },
  { id: '7', name: 'Konan', role: 'Documentation & HR', status: 'Syncing', currentTask: 'Menyusun laporan HRD & SOP', avatar: '📄', color: '#34d399', room: 'Boardroom Utama', activity: 'HR Compliance', x: -1, z: -5.5, targetX: -1, targetZ: -5.5, isMoving: false, speech: 'Absensi sesuai UU.' },
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

function RealisticOfficeWorker({ agent, isSelected, onSelect }: { agent: Agent; isSelected: boolean; onSelect: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = useRef<any>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dx = agent.targetX - g.position.x;
    const dz = agent.targetZ - g.position.z;
    const dist = Math.hypot(dx, dz);
    const speed = Math.min(1, delta * 3.0);
    g.position.x += dx * speed;
    g.position.z += dz * speed;

    const walking = dist > 0.1;
    g.position.y = walking ? Math.abs(Math.sin(state.clock.elapsedTime * 16)) * 0.15 : 0;
    if (walking) {
      g.rotation.y = Math.atan2(dx, dz);
    }
  });

  return (
    <group ref={group} position={[agent.x, 0, agent.z]}>
      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Kaki / Celana Formal */}
      <mesh position={[-0.09, 0.22, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[0.09, 0.22, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Jas / Badan Korporat */}
      <mesh position={[0, 0.65, 0]} onClick={onSelect} castShadow>
        <boxGeometry args={[0.38, 0.55, 0.2]} />
        <meshStandardMaterial color={agent.color} roughness={0.3} />
      </mesh>
      {/* Kemeja & Dasi */}
      <mesh position={[0, 0.68, 0.11]}>
        <boxGeometry args={[0.08, 0.4, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Lengan */}
      <mesh position={[-0.24, 0.65, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.12]} />
        <meshStandardMaterial color={agent.color} roughness={0.3} />
      </mesh>
      <mesh position={[0.24, 0.65, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.12]} />
        <meshStandardMaterial color={agent.color} roughness={0.3} />
      </mesh>

      {/* Kepala & Rambut */}
      <mesh position={[0, 1.1, 0]} onClick={onSelect} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.24, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Highlight Seleksi */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.6, 32]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Bubble Chat & Label Nama (Linear Style) */}
      <Html position={[0, 1.6, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {agent.speech && (
            <div style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', border: `1px solid ${agent.color}`, borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#f8fafc', whiteSpace: 'nowrap', fontWeight: 500, boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
              {agent.isMoving ? '🚶 ' : '💬 '}{agent.speech}
            </div>
          )}
          <div style={{ background: '#08090a', border: `2px solid ${agent.color}`, borderRadius: 999, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
            {agent.status === 'Off Duty' ? '😴' : agent.avatar}
          </div>
          <div style={{ background: '#0f1011', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#f7f8f8', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
            {agent.name} <span style={{ color: agent.color, fontWeight: 700 }}>({agent.role})</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function DetailedCorporateInterior() {
  return (
    <group>
      {/* Lantai Kantor Linear Dark Theme (#08090a) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[22, 0.1, 22]} />
        <meshStandardMaterial color="#08090a" roughness={0.9} />
      </mesh>
      <gridHelper args={[22, 22, '#23252a', '#141516']} position={[0, 0.01, 0]} />

      {/* Dinding Batas Kantor & Sekat Kaca Korporat Mewah */}
      <mesh position={[0, 1.8, -10.9]}>
        <boxGeometry args={[22, 3.6, 0.2]} />
        <meshStandardMaterial color="#191a1b" roughness={0.5} />
      </mesh>
      <mesh position={[-10.9, 1.8, 0]}>
        <boxGeometry args={[0.2, 3.6, 22]} />
        <meshStandardMaterial color="#191a1b" roughness={0.5} />
      </mesh>
      <mesh position={[10.9, 1.8, 0]}>
        <boxGeometry args={[0.2, 3.6, 22]} />
        <meshStandardMaterial color="#191a1b" roughness={0.5} />
      </mesh>

      {/* Sekat Kaca Antar Ruangan */}
      <mesh position={[0, 1.8, 2.5]}>
        <boxGeometry args={[12, 3.6, 0.08]} />
        <meshStandardMaterial color="#34343a" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      {/* 1. BOARDROOM UTAMA */}
      <group position={[0, 0, -5.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[4.2, 0.08, 2.2]} />
          <meshStandardMaterial color="#191a1b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#34343a" />
        </mesh>
        {/* Layar TV / Presentation Wall */}
        <mesh position={[0, 1.8, -1.1]}>
          <boxGeometry args={[2.8, 1.4, 0.06]} />
          <meshStandardMaterial color="#000" emissive="#5e6ad2" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 2. RUANG ARSITEK & DEV */}
      <group position={[-5.5, 0, -2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3.2, 0.08, 1.6]} />
          <meshStandardMaterial color="#0f1011" roughness={0.4} />
        </mesh>
        {/* Multiple Monitors */}
        {[-0.8, 0.8].map((mx, i) => (
          <mesh key={i} position={[mx, 0.9, -0.5]}>
            <boxGeometry args={[1.1, 0.6, 0.05]} />
            <meshStandardMaterial color="#000" emissive="#7170ff" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* 3. COMMAND CENTER */}
      <group position={[5.5, 0, -2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3.2, 0.08, 1.6]} />
          <meshStandardMaterial color="#0f1011" roughness={0.4} />
        </mesh>
        {/* Command Video Wall */}
        {[-0.9, 0.9].map((vx, i) => (
          <mesh key={i} position={[vx, 1.1, -0.7]}>
            <boxGeometry args={[1.2, 0.7, 0.05]} />
            <meshStandardMaterial color="#000" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* 4. LAB QA & SECURITY */}
      <group position={[-5.5, 0, 3.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.08, 1.5]} />
          <meshStandardMaterial color="#191a1b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, -0.5]}>
          <boxGeometry args={[1.4, 0.7, 0.05]} />
          <meshStandardMaterial color="#000" emissive="#fb923c" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 5. RUANG SERVER SRE */}
      <group position={[5.5, 0, 3.5]}>
        {[-0.7, 0, 0.7].map((sx, i) => (
          <mesh key={i} position={[sx, 1.1, 0]} castShadow>
            <boxGeometry args={[0.5, 2.2, 0.5]} />
            <meshStandardMaterial color="#022c22" emissive="#10b981" emissiveIntensity={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 6. PANTRY & LOUNGE */}
      <group position={[0, 0, 6.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.8, 1]} />
          <meshStandardMaterial color="#28282c" roughness={0.6} />
        </mesh>
        {/* Coffee Machine */}
        <mesh position={[-0.8, 1.0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#111827" emissive="#5e6ad2" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* 7. KAMAR TIDUR OFF-DUTY */}
      <group position={[0, 0, 9.5]}>
        {[-1.5, 0, 1.5].map((bx, i) => (
          <group key={i} position={[bx, 0, 0]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[1.2, 0.4, 2]} />
              <meshStandardMaterial color="#23252a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.46, -0.6]}>
              <boxGeometry args={[0.9, 0.1, 0.5]} />
              <meshStandardMaterial color="#d0d6e0" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function OfficeScene({ agents, selectedId, onSelect }: { agents: Agent[]; selectedId: string; onSelect: (a: Agent) => void }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[15, 25, 15]} intensity={2.0} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 10, 0]} intensity={30} color="#ffffff" distance={30} />

      <DetailedCorporateInterior />

      {agents.map((a) => (
        <RealisticOfficeWorker key={a.id} agent={a} isSelected={selectedId === a.id} onSelect={() => onSelect(a)} />
      ))}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={32} target={[0, 0, 2]} />
    </>
  );
}

export default function OfficeLinearCorporatePage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>([
    'PT. Indo Jaya Gram — Linear Enterprise Corporate Office HQ',
    'Arsitektur ruangan korporat 3D lengkap dengan boardroom, workstation, server rack, pantry, & sleeping quarters',
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
              return { ...ag, room: 'Ruang Server SRE', targetX: p.x, targetZ: p.z, currentTask: 'SRE 24/7 Uptime Watcher aktif', status: 'Monitoring', activity: 'Sentinel Watch', isMoving: true, speech: 'Menjaga server malam hari.' };
            }
            const bedPos = ROOM_POS['Kamar Tidur Off-Duty'];
            const bx = bedPos.x - 1.5 + (idx % 3) * 1.5;
            const bz = bedPos.z + (idx > 3 ? 0.5 : -0.5);
            return { ...ag, room: 'Kamar Tidur Off-Duty', targetX: bx, targetZ: bz, currentTask: 'Off Duty (Tidur di kamar istirahat)', status: 'Off Duty', activity: 'Resting', isMoving: true, speech: 'Tidur di kamar istirahat.' };
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
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col font-sans select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Linear Style Header Navbar */}
      <header className="h-14 border-b border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#5e6ad2] shadow-sm animate-pulse" />
          <span className="font-semibold text-sm tracking-tight text-[#f7f8f8]">PT. Indo Jaya Gram <span className="text-[#8a8f98] font-normal">• Corporate HQ Enterprise</span></span>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-md font-mono text-[#d0d6e0]">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>WIB: {currentTime || '--:--:--'}</span>
          </div>
          <div className="bg-[#5e6ad2] text-white px-3.5 py-1.5 rounded-md font-medium shadow hover:bg-[#7170ff] transition cursor-pointer">
            Linear UI 3D Active ⚡
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr_380px] min-h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar: Staff Directory */}
        <aside className="border-r border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider px-1 flex justify-between items-center">
            <span>Corporate Staff Directory</span>
            <span className="text-[10px] text-[#5e6ad2] font-mono">7 Active Agents</span>
          </div>
          {agents.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAgent(a)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${selectedAgent.id === a.id ? 'bg-[rgba(255,255,255,0.05)] border-[#5e6ad2]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border shadow-md ${a.isMoving ? 'animate-bounce' : ''}`} style={{ borderColor: a.color, background: '#08090a' }}>
                  {a.status === 'Off Duty' ? '😴' : a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate text-[#f7f8f8]">{a.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono ${a.isMoving ? 'bg-[#fb923c]/20 text-[#fb923c] border border-[#fb923c]/40 animate-pulse' : a.status === 'Off Duty' ? 'bg-slate-800 text-[#8a8f98]' : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'}`}>
                      {a.isMoving ? 'Walking' : a.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8a8f98] truncate mt-0.5">📍 {a.room}</div>
                </div>
              </div>
              <div className="mt-2.5 text-[11px] text-[#d0d6e0] bg-[rgba(0,0,0,0.3)] p-2 rounded border border-[rgba(255,255,255,0.05)] font-mono truncate">
                ⚡ {a.currentTask}
              </div>
            </div>
          ))}
          <div className="text-[10px] text-[#62666d] pt-4 px-1 text-center font-mono">
            PT. Indo Jaya Gram • Linear Design System
          </div>
        </aside>

        {/* Center: 3D Canvas */}
        <main className="bg-[#08090a] p-4 overflow-hidden flex items-center justify-center relative">
          <div className="relative rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl w-full h-full min-h-[640px]" style={{ background: '#07090e' }}>
            {mounted ? (
              <Canvas shadows camera={{ position: [0, 18, 18], fov: 48 }} dpr={[1, 2]}>
                <OfficeScene agents={agents} selectedId={selectedAgent.id} onSelect={setSelectedAgent} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8a8f98] font-mono text-sm">
                Memuat Enterprise 3D Office Environment…
              </div>
            )}
            <div className="absolute top-3 left-3 text-[11px] font-mono bg-[#0f1011]/90 backdrop-blur border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-[#d0d6e0] shadow-md pointer-events-none">
              🖱️ Drag: Putar Kamera • 🔍 Scroll: Zoom • 👤 Klik Karakter: Detail Karyawan
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-[11px] font-mono bg-[#0f1011]/90 backdrop-blur border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-2 text-[#f7f8f8] truncate pointer-events-none flex items-center justify-between">
              <span>🏢 <strong style={{ color: selectedAgent.color }}>{selectedAgent.name}</strong> ({selectedAgent.role}) di {selectedAgent.room}</span>
              <span className="text-[#8a8f98]">⚡ {selectedAgent.currentTask}</span>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Activity Feed */}
        <aside className="border-l border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-4 flex flex-col font-mono text-xs shadow-inner">
          <div className="text-[11px] font-semibold text-[#10b981] pb-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between uppercase tracking-wider">
            <span>Corporate Activity Stream</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          </div>
          <div className="flex-1 mt-3 bg-[#08090a] rounded-lg p-3.5 border border-[rgba(255,255,255,0.08)] overflow-y-auto space-y-2 text-[11px] leading-relaxed max-h-[calc(100vh-10rem)]">
            {logs.map((l, i) => (
              <div key={i} className="text-[#d0d6e0] border-b border-[rgba(255,255,255,0.04)] pb-1.5 font-mono">{l}</div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)] text-[10px] text-[#62666d] text-center">
            Zero Data Leak • Secure Telemetry
          </div>
        </aside>
      </div>
    </div>
  );
}
