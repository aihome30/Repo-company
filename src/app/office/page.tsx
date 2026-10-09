'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  status: string;
  task: string;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  speed: number;
}

interface Dept {
  id: string;
  name: string;
  x: number;
  z: number;
  w: number;
  d: number;
  color: string;
  label: string;
}

interface WS {
  id: string;
  room: string;
  x: number;
  z: number;
  on: boolean;
}

const DEPARTMENTS: Dept[] = [
  { id: 'lobby', name: 'Lobby', x: 2, z: 2, w: 3, d: 3, color: '#3b82f6', label: 'Lobby Resepsionis' },
  { id: 'command', name: 'Command Center', x: 6, z: 2, w: 4, d: 3, color: '#10b981', label: 'Command Center' },
  { id: 'dev', name: 'IT / Development', x: 2, z: 6, w: 4, d: 4, color: '#8b5cf6', label: 'IT Development' },
  { id: 'meetingA', name: 'Meeting A', x: 7, z: 6, w: 3, d: 3, color: '#f59e0b', label: 'Meeting Room A' },
  { id: 'meetingB', name: 'Meeting B', x: 11, z: 6, w: 3, d: 3, color: '#ec4899', label: 'Meeting Room B' },
  { id: 'manager', name: 'Manager Room', x: 11, z: 2, w: 3, d: 3, color: '#6366f1', label: 'Manager Room' },
  { id: 'pantry', name: 'Pantry', x: 2, z: 11, w: 3, d: 3, color: '#14b8a6', label: 'Pantry' },
  { id: 'lounge', name: 'Lounge', x: 6, z: 11, w: 4, d: 3, color: '#f97316', label: 'Lounge Istirahat' },
  { id: 'hr', name: 'HRD Office', x: 11, z: 10, w: 3, d: 3, color: '#06b6d4', label: 'HRD Office' },
  { id: 'server', name: 'Server Room', x: 15, z: 2, w: 3, d: 4, color: '#ef4444', label: 'Server & Data Center' },
  { id: 'security', name: 'Security Guard', x: 15, z: 8, w: 3, d: 3, color: '#64748b', label: 'Security & IDS' },
];

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'SATORU', role: 'Manager', dept: 'Manager Room', avatar: '🧙‍♂️', status: 'Working', task: 'Review sprint & approve budget', x: 12, z: 3, targetX: 12, targetZ: 3, speed: 0.05 },
  { id: '2', name: 'KONAN', role: 'HRD', dept: 'HRD Office', avatar: '👩‍💼', status: 'Working', task: 'Kelola rekrutmen & absen', x: 12, z: 11, targetX: 12, targetZ: 11, speed: 0.04 },
  { id: '3', name: 'ITACHI', role: 'Lead Dev', dept: 'IT / Development', avatar: '💻', status: 'Coding', task: 'Optimasi NestJS & Xendit', x: 3, z: 7, targetX: 3, targetZ: 7, speed: 0.06 },
  { id: '4', name: 'DEIDARA', role: 'Frontend', dept: 'IT / Development', avatar: '🎨', status: 'Coding', task: 'Polish Next.js UI & 3D Office', x: 4, z: 8, targetX: 4, targetZ: 8, speed: 0.05 },
  { id: '5', name: 'SASORI', role: 'QA Engineer', dept: 'Lounge', avatar: '☕', status: 'Break', task: 'Istirahat kopi & snack', x: 7, z: 12, targetX: 7, targetZ: 12, speed: 0.04 },
  { id: '6', name: 'KISAME', role: 'SRE / Ops', dept: 'Server Room', avatar: '🛡️', status: 'Monitoring', task: 'Pantau 24/7 uptime & DLP', x: 16, z: 3, targetX: 16, targetZ: 3, speed: 0.05 },
  { id: '7', name: 'MAYA', role: 'AI CS', dept: 'Lobby', avatar: '🤖', status: 'Active', task: 'Melayani tamu & support 24/7', x: 3, z: 3, targetX: 3, targetZ: 3, speed: 0.03 }
];

export default function VirtualOfficePage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<string[]>(['Mission Control dimuat — 11 zona kantor aktif, absensi terintegrasi']);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [selectedRoomId, setSelectedRoomId] = useState<string|null>('command');
  const [selectedWs, setSelectedWs] = useState<WS|null>(null);
  const [focus, setFocus] = useState<{x:number;z:number}|null>(null);
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [topView, setTopView] = useState(false);

  // State untuk Absensi Langsung di Office
  const [attendanceRecords, setAttendanceRecords] = useState<{id:string, name:string, time:string, type:string}[]>([
    { id: '1', name: 'SATORU', time: '08:00:00', type: 'Check-In' },
    { id: '2', name: 'KONAN', time: '08:15:20', type: 'Check-In' }
  ]);

  const selected = useMemo(()=>agents.find(a=>a.id===selectedId)||agents[0],[agents,selectedId]);
  const selectedRoom = useMemo(()=>DEPARTMENTS.find(d=>d.id===selectedRoomId)||null,[selectedRoomId]);
  const online = useMemo(()=>agents.filter(a=>a.status!=='Offline').length,[agents]);
  const filtered = useMemo(()=>agents.filter(a=>(a.name+a.role+a.dept).toLowerCase().includes(query.toLowerCase())),[agents,query]);
  const roomAgents = useMemo(()=>selectedRoom?agents.filter(a=>a.dept===selectedRoom.name):[],[agents,selectedRoom]);

  useEffect(()=>{
    setMounted(true);
    const t = setInterval(()=>setTime(new Date().toLocaleTimeString()), 1000);
    return ()=>clearInterval(t);
  },[]);

  // Realtime agent movement simulation
  useEffect(()=>{
    const interval = setInterval(()=>{
      setAgents(prev=>prev.map(agent=>{
        if(Math.random()<0.15){
          const targetDept = DEPARTMENTS[Math.floor(Math.random()*DEPARTMENTS.length)];
          return {
            ...agent,
            targetX: targetDept.x + Math.floor(Math.random()*targetDept.w),
            targetZ: targetDept.z + Math.floor(Math.random()*targetDept.d),
            dept: targetDept.name
          };
        }
        const dx = agent.targetX - agent.x;
        const dz = agent.targetZ - agent.z;
        return {
          ...agent,
          x: Math.abs(dx)>0.1 ? agent.x + dx*0.2 : agent.x,
          z: Math.abs(dz)>0.1 ? agent.z + dz*0.2 : agent.z
        };
      }));
    }, 2000);
    return ()=>clearInterval(interval);
  },[]);

  const handleAbsen = (type: 'Check-In' | 'Check-Out') => {
    const now = new Date().toLocaleTimeString();
    setAttendanceRecords(prev => [{id: selected.id, name: selected.name, time: now, type}, ...prev]);
    setLogs(prev => [`${selected.name} melakukan ${type} pada pukul ${now}`, ...prev]);
  };

  if(!mounted) return null;

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 flex flex-col font-mono select-none">
      {/* Top Navbar */}
      <header className="h-[52px] border-b border-white/10 bg-[#0b0d11] px-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 text-cyan-400 font-bold hover:opacity-80 transition">
            <span>←</span><span>wspend HQ</span>
          </Link>
          <span className="text-white/20">/</span>
          <h1 className="text-xs font-bold uppercase tracking-widest text-white">Virtual Office & Absensi</h1>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Online Agents:</span>
            <span className="font-bold text-emerald-400">{online}/{agents.length}</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-cyan-300 font-mono">
            {time}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Daftar Agen & Absensi UI Langsung */}
        <aside className="w-full lg:w-80 border-r border-white/10 bg-[#0b0d11] p-3 flex flex-col space-y-3 overflow-y-auto max-h-[calc(100vh-52px)]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Control Panel Agen</p>
            <input
              type="text"
              placeholder="Cari agen atau divisi..."
              value={query}
              onChange={e=>setQuery(e.target.value)}
              className="w-full bg-[#060709] border border-white/10 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[220px]">
            {filtered.map(a=>(
              <button
                key={a.id}
                onClick={()=>{setSelectedId(a.id); setFocus({x:a.targetX,z:a.targetZ});}}
                className={`w-full text-left p-2 rounded-lg border transition flex items-center justify-between ${selectedId===a.id?'bg-cyan-500/10 border-cyan-500/50 text-white':'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-300'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">{a.avatar}</span>
                  <div>
                    <div className="font-bold text-xs">{a.name}</div>
                    <div className="text-[10px] text-slate-400">{a.role}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-cyan-300">{a.dept}</span>
              </button>
            ))}
          </div>

          {/* Form Absensi Karyawan Terintegrasi UI */}
          <div className="bg-[#060709] border border-white/10 rounded-lg p-3 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sistem Absensi Karyawan</span>
              <span className="text-[10px] text-slate-400">{selected.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>handleAbsen('Check-In')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded text-xs transition shadow">
                Check-In
              </button>
              <button onClick={()=>handleAbsen('Check-Out')} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 rounded text-xs transition shadow">
                Check-Out
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Riwayat Absensi Terbaru:</p>
              <div className="max-h-28 overflow-y-auto space-y-1 text-[10px]">
                {attendanceRecords.map((r, i)=>(
                  <div key={i} className="flex justify-between items-center bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                    <span className="font-bold text-white">{r.name}</span>
                    <span className={r.type==='Check-In'?'text-emerald-400':'text-rose-400'}>{r.type} ({r.time})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Simulasi 3D Office Canvas */}
        <main className="flex-1 bg-[#060709] relative flex flex-col items-center justify-center p-4 overflow-hidden min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button onClick={()=>setTopView(!topView)} className="px-3 py-1.5 bg-slate-900/80 border border-white/10 hover:border-cyan-500 rounded text-xs text-slate-200 backdrop-blur">
              {topView ? 'Kamera: Isometric' : 'Kamera: Top-Down 2D'}
            </button>
          </div>

          <div className="w-full max-w-4xl h-full flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-[#090b10] relative shadow-2xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">PT. Indo Jaya Gram — Live Office Floor Map</h2>
              <p className="text-[11px] text-slate-400">Klik agen di panel kiri untuk melacak posisi dan melakukan absensi real-time.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
              {DEPARTMENTS.map(dept=>(
                <div
                  key={dept.id}
                  onClick={()=>setSelectedRoomId(dept.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between h-28 ${selectedRoomId===dept.id?'border-cyan-500 bg-cyan-500/10 shadow-lg':'border-white/10 bg-white/[0.02] hover:border-white/30'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-white">{dept.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: dept.color}}></span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agents.filter(a=>a.dept===dept.name).map(ag=>(
                      <span key={ag.id} className="text-base" title={`${ag.name} (${ag.role})`}>{ag.avatar}</span>
                    ))}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    {agents.filter(a=>a.dept===dept.name).length} Agen aktif
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Detail Agen Terpilih */}
        <aside className="w-full lg:w-72 border-l border-white/10 bg-[#0b0d11] p-3 flex flex-col text-xs font-mono">
          <div className="bg-[#060709] border border-white/10 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{selected.avatar}</span>
              <div>
                <div className="font-bold text-sm text-white">{selected.name}</div>
                <div className="text-slate-400 text-[11px]">{selected.role}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 space-y-1 text-slate-300 text-[11px]">
              <div>Status: <span className="text-emerald-400 font-bold">{selected.status}</span></div>
              <div>Lokasi: <span className="text-cyan-300 font-bold">{selected.dept}</span></div>
              <div>Tugas Saat Ini: <span className="text-white">{selected.task}</span></div>
            </div>
          </div>

          <div className="mt-4 flex flex-col flex-1">
            <span className="font-bold text-emerald-300 uppercase tracking-widest text-[10px] mb-2">Live Activity Logs</span>
            <div className="flex-1 bg-[#060709] border border-white/10 rounded-lg p-2.5 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed max-h-[300px]">
              {logs.map((l,i)=>(<div key={i} className="text-slate-300 border-b border-white/5 pb-1">{l}</div>))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="h-[30px] border-t border-white/10 bg-[#0b0d11] px-4 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>PT. Indo Jaya Gram · Virtual Office & Attendance System</span>
        <span>Zero Data Leak · <span className="text-emerald-300">ONLINE</span></span>
      </footer>
    </div>
  );
}
