'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Agent { id:string; name:string; role:string; dept:string; status:'Online'|'Busy'|'Meeting'|'Away'|'Offline'; task:string; avatar:string; color:string; x:number; z:number; targetX:number; targetZ:number; isMoving:boolean; speech:string; }
interface Dept { id:string; name:string; x:number; z:number; w:number; d:number; color:string; }

const DEPARTMENTS: Dept[] = [
  { id:'lobby', name:'Lobby / Reception', x:0, z:-8.5, w:16, d:4, color:'#1e293b' },
  { id:'open', name:'Open Office', x:0, z:-3.5, w:10, d:6, color:'#0f172a' },
  { id:'hr', name:'HR Room', x:-8, z:-3.5, w:6, d:6, color:'#172554' },
  { id:'it', name:'IT / Developer', x:8, z:-3.5, w:6, d:6, color:'#052e16' },
  { id:'meeting', name:'Meeting Room', x:-5, z:3, w:8, d:5, color:'#1e1b4b' },
  { id:'manager', name:'Manager Room', x:4, z:3, w:6, d:5, color:'#422006' },
  { id:'pantry', name:'Pantry / Break Room', x:-8, z:8, w:6, d:4, color:'#431407' },
  { id:'lounge', name:'Lounge', x:-1.5, z:8, w:7, d:4, color:'#082f49' },
  { id:'server', name:'Server Room', x:6.5, z:8, w:5, d:4, color:'#022c22' },
  { id:'toilet', name:'Toilet', x:10.5, z:8, w:3, d:4, color:'#27272a' },
];
const ROOM_POS: Record<string,{x:number;z:number}> = {};
DEPARTMENTS.forEach(d=>{ROOM_POS[d.name]={x:d.x,z:d.z};});

const INITIAL_AGENTS: Agent[] = [
  { id:'1', name:'Satoru', role:'Manager', dept:'Manager Room', status:'Online', task:'Review laporan & approve sprint', avatar:'👔', color:'#5e6ad2', x:4, z:3, targetX:4, targetZ:3, isMoving:false, speech:'Sprint Q4 disetujui.' },
  { id:'2', name:'Nagato', role:'Product Lead', dept:'Meeting Room', status:'Meeting', task:'Memimpin sprint planning', avatar:'📊', color:'#fb923c', x:-5, z:3, targetX:-5, targetZ:3, isMoving:false, speech:'Planning sprint 12.' },
  { id:'3', name:'Itachi', role:'Architect', dept:'IT / Developer', status:'Busy', task:'Coding arsitektur backend', avatar:'💻', color:'#a78bfa', x:7, z:-3.5, targetX:7, targetZ:-3.5, isMoving:false, speech:'Refactor auth module.' },
  { id:'4', name:'Kisame', role:'SRE / Backend', dept:'Server Room', status:'Online', task:'Monitoring server 24/7', avatar:'🖥️', color:'#60a5fa', x:6.5, z:8, targetX:6.5, targetZ:8, isMoving:false, speech:'Uptime 100%.' },
  { id:'5', name:'Sasori', role:'Frontend', dept:'Open Office', status:'Busy', task:'Membangun UI design system', avatar:'🎨', color:'#f472b6', x:-1, z:-3.5, targetX:-1, targetZ:-3.5, isMoving:false, speech:'Polish komponen.' },
  { id:'6', name:'Deidara', role:'QA Engineer', dept:'Open Office', status:'Online', task:'Automated testing', avatar:'🧪', color:'#facc15', x:1.5, z:-3.5, targetX:1.5, targetZ:-3.5, isMoving:false, speech:'Test suite hijau.' },
  { id:'7', name:'Konan', role:'HRD', dept:'HR Room', status:'Online', task:'Rekrutmen & administrasi', avatar:'📋', color:'#34d399', x:-8, z:-3.5, targetX:-8, targetZ:-3.5, isMoving:false, speech:'Absensi sesuai UU.' },
];
const ROTATION:{agentId:string;to:string;task:string;status:Agent['status'];speech:string}[]=[
  { agentId:'3', to:'Meeting Room', task:'Presentasi arsitektur di meeting', status:'Meeting', speech:'Presentasi diagram.' },
  { agentId:'3', to:'IT / Developer', task:'Kembali coding di workstation', status:'Busy', speech:'Lanjut coding.' },
  { agentId:'5', to:'Meeting Room', task:'Demo UI di meeting room', status:'Meeting', speech:'Demo mockup baru.' },
  { agentId:'5', to:'Pantry / Break Room', task:'Istirahat kopi di pantry', status:'Away', speech:'Ngopi dulu ☕' },
  { agentId:'5', to:'Open Office', task:'Kembali ke workstation', status:'Busy', speech:'Lanjut slicing UI.' },
  { agentId:'6', to:'Server Room', task:'Cek deployment di server room', status:'Busy', speech:'Verifikasi build.' },
  { agentId:'6', to:'Open Office', task:'Menulis test report', status:'Online', speech:'0 critical bug.' },
  { agentId:'2', to:'Manager Room', task:'Koordinasi dengan manager', status:'Meeting', speech:'Sinkron roadmap.' },
  { agentId:'2', to:'Meeting Room', task:'Kembali memimpin meeting', status:'Meeting', speech:'Lanjut planning.' },
  { agentId:'7', to:'Lobby / Reception', task:'Menyambut kandidat di lobby', status:'Away', speech:'Interview kandidat.' },
  { agentId:'7', to:'HR Room', task:'Arsip dokumen HR', status:'Online', speech:'SOP tersimpan.' },
  { agentId:'1', to:'Meeting Room', task:'Memimpin board meeting', status:'Meeting', speech:'Semua divisi hadir.' },
  { agentId:'1', to:'Manager Room', task:'Kembali ke ruang manager', status:'Online', speech:'Approve budget.' },
  { agentId:'4', to:'IT / Developer', task:'Bantu debug backend', status:'Busy', speech:'Cek query lambat.' },
  { agentId:'4', to:'Server Room', task:'Kembali jaga server room', status:'Online', speech:'Monitoring aman.' },
];

function Worker({ agent, selected, onSelect }:{agent:Agent;selected:boolean;onSelect:()=>void}){
  const ref=useRef<THREE.Group>(null);
  useFrame((state,delta)=>{
    const g=ref.current; if(!g) return;
    const dx=agent.targetX-g.position.x, dz=agent.targetZ-g.position.z;
    const dist=Math.hypot(dx,dz);
    const k=Math.min(1,delta*2.2);
    g.position.x+=dx*k; g.position.z+=dz*k;
    const walking=dist>0.12;
    g.position.y=walking?Math.abs(Math.sin(state.clock.elapsedTime*12))*0.1:0;
    if(walking) g.rotation.y=Math.atan2(dx,dz);
  });
  const statusColor=agent.status==='Online'?'#10b981':agent.status==='Busy'?'#f59e0b':agent.status==='Meeting'?'#5e6ad2':agent.status==='Away'?'#94a3b8':'#52525b';
  return (
    <group ref={ref} position={[agent.x,0,agent.z]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.28,20]}/><meshBasicMaterial color="#000" transparent opacity={0.45}/></mesh>
      <mesh position={[-0.07,0.2,0]}><cylinderGeometry args={[0.04,0.04,0.4,10]}/><meshStandardMaterial color="#111827"/></mesh>
      <mesh position={[0.07,0.2,0]}><cylinderGeometry args={[0.04,0.04,0.4,10]}/><meshStandardMaterial color="#111827"/></mesh>
      <mesh position={[0,0.6,0]} onClick={onSelect} castShadow><boxGeometry args={[0.32,0.5,0.18]}/><meshStandardMaterial color={agent.color} roughness={0.5}/></mesh>
      <mesh position={[0,0.62,0.1]}><boxGeometry args={[0.07,0.35,0.02]}/><meshStandardMaterial color="#f8fafc"/></mesh>
      <mesh position={[-0.2,0.6,0]}><boxGeometry args={[0.08,0.38,0.1]}/><meshStandardMaterial color={agent.color}/></mesh>
      <mesh position={[0.2,0.6,0]}><boxGeometry args={[0.08,0.38,0.1]}/><meshStandardMaterial color={agent.color}/></mesh>
      <mesh position={[0,1.02,0]} onClick={onSelect} castShadow><sphereGeometry args={[0.15,20,20]}/><meshStandardMaterial color="#fcd9a8" roughness={0.6}/></mesh>
      <mesh position={[0,1.13,-0.02]}><sphereGeometry args={[0.13,14,14]}/><meshStandardMaterial color="#1f2937"/></mesh>
      {selected && (<mesh position={[0,0.02,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.36,0.48,28]}/><meshBasicMaterial color={agent.color} transparent opacity={0.95}/></mesh>)}
      <Html position={[0,1.55,0]} center distanceFactor={16} style={{pointerEvents:'none'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          <div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(8,9,10,0.92)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:6,padding:'2px 7px',fontSize:10,color:'#f7f8f8',whiteSpace:'nowrap'}}>
            <span style={{width:7,height:7,borderRadius:99,background:statusColor,display:'inline-block'}}/>
            <b>{agent.name}</b><span style={{opacity:0.65}}>· {agent.status}</span>
          </div>
          {agent.speech && (<div style={{background:'#fff',color:'#111',borderRadius:6,padding:'2px 8px',fontSize:10,whiteSpace:'nowrap',fontWeight:600}}>{agent.speech}</div>)}
        </div>
      </Html>
    </group>
  );
}

function Workstation({x,z,glow='#7170ff',rot=0}:{x:number;z:number;glow?:string;rot?:number}){
  return (
    <group position={[x,0,z]} rotation={[0,rot,0]}>
      <mesh position={[0,0.37,0]} castShadow receiveShadow><boxGeometry args={[1.5,0.06,0.7]}/><meshStandardMaterial color="#3f3f46" roughness={0.4} metalness={0.3}/></mesh>
      <mesh position={[-0.6,0.18,0]}><boxGeometry args={[0.06,0.36,0.6]}/><meshStandardMaterial color="#27272a"/></mesh>
      <mesh position={[0.6,0.18,0]}><boxGeometry args={[0.06,0.36,0.6]}/><meshStandardMaterial color="#27272a"/></mesh>
      <mesh position={[0,0.72,-0.18]}><boxGeometry args={[0.75,0.45,0.04]}/><meshStandardMaterial color="#09090b" emissive={glow} emissiveIntensity={0.7}/></mesh>
      <mesh position={[0,0.45,-0.18]}><boxGeometry args={[0.06,0.14,0.06]}/><meshStandardMaterial color="#18181b"/></mesh>
      <mesh position={[0,0.42,0.12]}><boxGeometry args={[0.5,0.03,0.18]}/><meshStandardMaterial color="#18181b"/></mesh>
      <mesh position={[0.4,0.42,0.12]}><boxGeometry args={[0.09,0.04,0.12]}/><meshStandardMaterial color="#18181b"/></mesh>
      <mesh position={[0,0.28,0.75]}><boxGeometry args={[0.42,0.06,0.42]}/><meshStandardMaterial color="#18181b"/></mesh>
      <mesh position={[0,0.55,0.95]}><boxGeometry args={[0.42,0.5,0.06]}/><meshStandardMaterial color="#27272a"/></mesh>
      <mesh position={[0,0.14,0.75]}><cylinderGeometry args={[0.04,0.04,0.28,8]}/><meshStandardMaterial color="#52525b" metalness={0.6}/></mesh>
      <mesh position={[0,0.75,-0.36]}><boxGeometry args={[1.5,0.5,0.03]}/><meshStandardMaterial color="#27272a" roughness={0.9}/></mesh>
    </group>
  );
}

function ServerRack({x,z}:{x:number;z:number}){
  const ref=useRef<THREE.Mesh>(null);
  useFrame((s)=>{ if(ref.current){ const m=ref.current.material as THREE.MeshStandardMaterial; m.emissiveIntensity=0.5+Math.sin(s.clock.elapsedTime*3+x)*0.25; } });
  return (
    <group position={[x,0,z]}>
      <mesh position={[0,1,0]} castShadow><boxGeometry args={[0.7,2,0.6]}/><meshStandardMaterial color="#052e2b" roughness={0.4} metalness={0.4}/></mesh>
      <mesh ref={ref} position={[0,1,0.31]}><boxGeometry args={[0.55,1.7,0.02]}/><meshStandardMaterial color="#000" emissive="#10b981" emissiveIntensity={0.6}/></mesh>
    </group>
  );
}

function Building(){
  return (
    <group>
      <mesh position={[0,-0.06,0]} receiveShadow><boxGeometry args={[24,0.12,24]}/><meshStandardMaterial color="#d6c9b4" roughness={0.85}/></mesh>
      {DEPARTMENTS.map(d=>(
        <mesh key={d.id} position={[d.x,0.005,d.z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[d.w-0.4,d.d-0.4]}/><meshStandardMaterial color={d.color} roughness={0.95}/></mesh>
      ))}
      <mesh position={[0,1.4,-11]}><boxGeometry args={[24,2.8,0.25]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[-11.5,1.4,0]}><boxGeometry args={[0.25,2.8,22]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[11.5,1.4,0]}><boxGeometry args={[0.25,2.8,22]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[0,1.4,10.2]}><boxGeometry args={[24,2.8,0.25]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[0,1.4,-6.4]}><boxGeometry args={[22,2.8,0.15]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[-5,1.4,0]}><boxGeometry args={[0.15,2.8,12]}/><meshStandardMaterial color="#a8a29e" transparent opacity={0.35} roughness={0.1}/></mesh>
      <mesh position={[5,1.4,0]}><boxGeometry args={[0.15,2.8,12]}/><meshStandardMaterial color="#a8a29e" transparent opacity={0.35} roughness={0.1}/></mesh>
      <mesh position={[0,1.4,5.5]}><boxGeometry args={[22,2.8,0.15]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <group position={[0,0,-8.5]}>
        <mesh position={[0,0.5,0.6]} castShadow><boxGeometry args={[3.4,1,0.8]}/><meshStandardMaterial color="#78350f" roughness={0.4}/></mesh>
        <mesh position={[0,1.02,0.6]}><boxGeometry args={[3.5,0.06,0.9]}/><meshStandardMaterial color="#292524" roughness={0.25}/></mesh>
        <mesh position={[0,2,-1.6]}><boxGeometry args={[5,1,0.08]}/><meshStandardMaterial color="#1c1917"/></mesh>
        {[-3.5,3.5].map((sx,i)=>(
          <group key={i} position={[sx,0,0.4]}>
            <mesh position={[0,0.25,0]} castShadow><boxGeometry args={[1.8,0.35,0.8]}/><meshStandardMaterial color="#1e40af" roughness={0.7}/></mesh>
            <mesh position={[0,0.55,-0.35]}><boxGeometry args={[1.8,0.6,0.15]}/><meshStandardMaterial color="#1e3a8a" roughness={0.7}/></mesh>
          </group>
        ))}
        {[[-5.5,0],[5.5,0]].map(([tx,tz],i)=>(
          <group key={i} position={[tx,0,tz as number]}>
            <mesh position={[0,0.35,0]}><cylinderGeometry args={[0.25,0.2,0.7,12]}/><meshStandardMaterial color="#78716c"/></mesh>
            <mesh position={[0,1,0]}><sphereGeometry args={[0.5,12,12]}/><meshStandardMaterial color="#15803d" roughness={0.9}/></mesh>
          </group>
        ))}
      </group>
      <Workstation x={-1.5} z={-4} glow="#38bdf8" />
      <Workstation x={1.5} z={-4} glow="#a855f7" />
      <Workstation x={-1.5} z={-2.2} glow="#22c55e" rot={Math.PI} />
      <Workstation x={1.5} z={-2.2} glow="#facc15" rot={Math.PI} />
      <Workstation x={-8.5} z={-4} glow="#34d399" />
      <mesh position={[-7,1,-2.2]} castShadow><boxGeometry args={[0.6,2,1.6]}/><meshStandardMaterial color="#57534e" roughness={0.7}/></mesh>
      <mesh position={[-8,0.4,-1.5]}><boxGeometry args={[2,0.08,1]}/><meshStandardMaterial color="#44403c"/></mesh>
      <Workstation x={7.2} z={-4} glow="#22d3ee" />
      <Workstation x={8.8} z={-4} glow="#a855f7" />
      <mesh position={[8,1.3,-1.8]}><boxGeometry args={[2.4,1.2,0.06]}/><meshStandardMaterial color="#f8fafc" roughness={0.9}/></mesh>
      <group position={[-5,0,3]}>
        <mesh position={[0,1.4,-2.5]}><boxGeometry args={[8,2.8,0.08]}/><meshStandardMaterial color="#a8a29e" transparent opacity={0.25} roughness={0.05}/></mesh>
        <mesh position={[0,0.4,0]} castShadow><boxGeometry args={[4.5,0.08,1.8]}/><meshStandardMaterial color="#1c1917" roughness={0.3}/></mesh>
        {[-1.5,-0.5,0.5,1.5].map((cx,i)=>(
          <group key={i} position={[cx,0,-1.2]}>
            <mesh position={[0,0.3,0]}><boxGeometry args={[0.45,0.07,0.45]}/><meshStandardMaterial color="#292524"/></mesh>
            <mesh position={[0,0.6,-0.2]}><boxGeometry args={[0.45,0.5,0.07]}/><meshStandardMaterial color="#44403c"/></mesh>
          </group>
        ))}
        {[-1.5,-0.5,0.5,1.5].map((cx,i)=>(
          <group key={i} position={[cx,0,1.2]}>
            <mesh position={[0,0.3,0]}><boxGeometry args={[0.45,0.07,0.45]}/><meshStandardMaterial color="#292524"/></mesh>
            <mesh position={[0,0.6,0.2]}><boxGeometry args={[0.45,0.5,0.07]}/><meshStandardMaterial color="#44403c"/></mesh>
          </group>
        ))}
        <mesh position={[0,1.7,-2.4]}><boxGeometry args={[2.6,1.2,0.06]}/><meshStandardMaterial color="#000" emissive="#38bdf8" emissiveIntensity={0.5}/></mesh>
        <mesh position={[-3.4,1.5,0.5]} rotation={[0,Math.PI/2,0]}><boxGeometry args={[2.2,1.2,0.05]}/><meshStandardMaterial color="#f8fafc" roughness={0.9}/></mesh>
      </group>
      <group position={[4,0,3]}>
        <mesh position={[0,0.4,-1]} castShadow><boxGeometry args={[2.4,0.08,1.1]}/><meshStandardMaterial color="#451a03" roughness={0.3}/></mesh>
        <mesh position={[0,0.75,-1.3]}><boxGeometry args={[1,0.55,0.05]}/><meshStandardMaterial color="#000" emissive="#fbbf24" emissiveIntensity={0.5}/></mesh>
        <mesh position={[0,0.4,0.6]}><boxGeometry args={[0.55,0.08,0.55]}/><meshStandardMaterial color="#1c1917"/></mesh>
        <mesh position={[0,0.75,0.85]}><boxGeometry args={[0.55,0.6,0.08]}/><meshStandardMaterial color="#1c1917"/></mesh>
        <mesh position={[1.8,0.35,0.5]}><boxGeometry args={[1.2,0.5,0.6]}/><meshStandardMaterial color="#78350f" roughness={0.7}/></mesh>
        <mesh position={[1.8,0.65,0.2]}><boxGeometry args={[1.2,0.5,0.1]}/><meshStandardMaterial color="#92400e" roughness={0.7}/></mesh>
      </group>
      <group position={[-8,0,8]}>
        <mesh position={[-1,0.45,-1]} castShadow><boxGeometry args={[3,0.9,0.7]}/><meshStandardMaterial color="#e7e5e4" roughness={0.4}/></mesh>
        <mesh position={[1.2,1,-1.1]}><boxGeometry args={[0.5,0.4,0.5]}/><meshStandardMaterial color="#1c1917"/></mesh>
        <mesh position={[-1.2,1.15,-1.1]}><boxGeometry args={[0.6,0.7,0.3]}/><meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.3}/></mesh>
        <mesh position={[0,0.4,0.8]} castShadow><boxGeometry args={[2.2,0.06,1]}/><meshStandardMaterial color="#a16207" roughness={0.4}/></mesh>
        {[-0.7,0.7].map((cx,i)=>(<mesh key={i} position={[cx,0.25,1.4]}><cylinderGeometry args={[0.2,0.2,0.5,12]}/><meshStandardMaterial color="#44403c"/></mesh>))}
      </group>
      <group position={[-1.5,0,8]}>
        <mesh position={[-1.2,0.28,0]} castShadow><boxGeometry args={[2,0.4,0.9]}/><meshStandardMaterial color="#0c4a6e" roughness={0.8}/></mesh>
        <mesh position={[1.2,0.28,0]} castShadow><boxGeometry args={[2,0.4,0.9]}/><meshStandardMaterial color="#0c4a6e" roughness={0.8}/></mesh>
        <mesh position={[0,0.25,0]}><boxGeometry args={[0.9,0.35,0.6]}/><meshStandardMaterial color="#713f12" roughness={0.5}/></mesh>
        <mesh position={[2.6,0.7,-1]}><sphereGeometry args={[0.45,12,12]}/><meshStandardMaterial color="#15803d"/></mesh>
      </group>
      <ServerRack x={5.5} z={8} />
      <ServerRack x={6.5} z={8} />
      <ServerRack x={7.5} z={8} />
      <mesh position={[6.5,0.4,9.2]}><boxGeometry args={[2.4,0.8,0.5]}/><meshStandardMaterial color="#27272a"/></mesh>
      <group position={[10.5,0,8]}>
        <mesh position={[-0.5,0.3,0]}><boxGeometry args={[0.6,0.6,0.6]}/><meshStandardMaterial color="#f8fafc"/></mesh>
        <mesh position={[0.6,0.35,0.5]}><boxGeometry args={[0.5,0.7,0.5]}/><meshStandardMaterial color="#e7e5e4"/></mesh>
      </group>
      {DEPARTMENTS.map(d=>(
        <Html key={d.id} position={[d.x,3.1,d.z]} center distanceFactor={26} style={{pointerEvents:'none'}}>
          <div style={{background:'rgba(8,9,10,0.85)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,padding:'2px 10px',fontSize:11,fontWeight:700,color:'#f7f8f8',whiteSpace:'nowrap',letterSpacing:0.3}}>{d.name}</div>
        </Html>
      ))}
      <Html position={[0,2.05,-10]} center distanceFactor={24} style={{pointerEvents:'none'}}>
        <div style={{fontSize:13,fontWeight:800,color:'#fbbf24',letterSpacing:1,whiteSpace:'nowrap',textShadow:'0 2px 8px #000'}}>PT. INDO JAYA GRAM</div>
      </Html>
    </group>
  );
}

function Scene({agents,selectedId,onSelect,focus}:{agents:Agent[];selectedId:string;onSelect:(a:Agent)=>void;focus:Dept|null}){
  const controls=useRef<any>(null);
  useFrame(()=>{ if(controls.current&&focus){ controls.current.target.lerp(new THREE.Vector3(focus.x,0,focus.z),0.06); } });
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#fff7ed','#44403c',0.7]} />
      <directionalLight position={[12,20,8]} intensity={1.6} castShadow shadow-mapSize={[2048,2048]} />
      <pointLight position={[0,6,-8]} intensity={18} color="#fef3c7" distance={18} />
      <pointLight position={[-5,6,3]} intensity={14} color="#e0f2fe" distance={16} />
      <pointLight position={[6,6,8]} intensity={12} color="#dcfce7" distance={14} />
      <Building />
      {agents.map(a=>(<Worker key={a.id} agent={a} selected={selectedId===a.id} onSelect={()=>onSelect(a)} />))}
      <OrbitControls ref={controls} enablePan maxPolarAngle={Math.PI/2.15} minDistance={5} maxDistance={30} target={[0,0,0]} />
    </>
  );
}

export default function VirtualOfficePage(){
  const [agents,setAgents]=useState<Agent[]>(INITIAL_AGENTS);
  const [logs,setLogs]=useState<string[]>(['Virtual Office 3D PT. Indo Jaya Gram dimuat — 10 zona kantor aktif']);
  const [selected,setSelected]=useState<Agent>(INITIAL_AGENTS[0]);
  const [focusDept,setFocusDept]=useState<Dept|null>(null);
  const [time,setTime]=useState('');
  const [mounted,setMounted]=useState(false);
  const [query,setQuery]=useState('');
  const idx=useRef(0);
  useEffect(()=>{
    setMounted(true);
    const c=setInterval(()=>setTime(new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})),1000);
    const m=setInterval(()=>{
      const now=new Date();
      const h=parseInt(now.toLocaleString('en-US',{timeZone:'Asia/Jakarta',hour:'numeric',hour12:false}));
      const ops=h>=8&&h<19;
      if(!ops){
        setAgents(prev=>prev.map(ag=>{
          if(ag.id==='4'){ const dest=ROOM_POS['Server Room']; return {...ag,status:'Online' as const,task:'Jaga malam — monitoring server 24/7',speech:'Jaga malam aktif.',dept:'Server Room',targetX:dest.x,targetZ:dest.z,isMoving:true}; }
          const dest=ROOM_POS['Lounge']; return {...ag,status:'Away' as const,task:'Istirahat malam di Lounge',speech:'Istirahat.',dept:'Lounge',targetX:dest.x+(Number(ag.id)%3)*0.8-0.8,targetZ:dest.z+0.5,isMoving:true};
        }));
        return;
      }
      const ev=ROTATION[idx.current%ROTATION.length]; idx.current+=1;
      const dest=ROOM_POS[ev.to];
      setAgents(prev=>prev.map(ag=>ag.id===ev.agentId?{...ag,dept:ev.to,targetX:dest.x+(Number(ag.id)%2)*0.8-0.4,targetZ:dest.z+0.6,task:ev.task,status:ev.status,speech:ev.speech,isMoving:true}:ag));
      const who=INITIAL_AGENTS.find(a=>a.id===ev.agentId);
      if(who) setLogs(p=>[`[${new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})}] ${who.name} → ${ev.to}: ${ev.task}`,...p.slice(0,60)]);
      setTimeout(()=>{ setAgents(prev=>prev.map(ag=>ag.id===ev.agentId?{...ag,isMoving:false,x:ag.targetX,z:ag.targetZ}:ag)); },2600);
    },5000);
    return ()=>{ clearInterval(c); clearInterval(m); };
  },[]);
  const online=useMemo(()=>agents.filter(a=>a.status!=='Offline').length,[agents]);
  const filtered=useMemo(()=>agents.filter(a=>(a.name+a.role+a.dept).toLowerCase().includes(query.toLowerCase())),[agents,query]);
  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col select-none" style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="h-13 border-b border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5e6ad2] animate-pulse" />
          <span className="font-semibold text-sm">PT. Indo Jaya Gram <span className="text-[#8a8f98] font-normal">· Virtual Office 3D</span></span>
          <span className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">{online}/7 Online</span>
        </div>
        <div className="flex items-center gap-3">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari karyawan…" className="text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-md px-2.5 py-1.5 w-44 outline-none focus:border-[#5e6ad2]" />
          <span className="text-xs font-mono text-[#d0d6e0]">🕘 {time||'--:--:--'} WIB</span>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] min-h-[calc(100vh-52px)]">
        <aside className="border-r border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-52px)]">
          <p className="text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider">Departemen</p>
          <button onClick={()=>setFocusDept(null)} className="w-full text-left text-xs px-2.5 py-2 rounded-md border border-[rgba(255,255,255,0.08)] hover:border-[#5e6ad2] bg-[rgba(255,255,255,0.02)]">🏢 Semua Gedung</button>
          {DEPARTMENTS.map(d=>(
            <button key={d.id} onClick={()=>setFocusDept(d)} className={`w-full text-left text-xs px-2.5 py-2 rounded-md border transition ${focusDept?.id===d.id?'border-[#5e6ad2] bg-[rgba(94,106,210,0.12)]':'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]'}`}>
              📍 {d.name}
              <span className="block text-[10px] text-[#62666d] font-mono">{agents.filter(a=>a.dept===d.name).length} karyawan</span>
            </button>
          ))}
          <p className="text-[11px] font-semibold text-[#8a8f98] uppercase tracking-wider pt-2">Karyawan</p>
          {filtered.map(a=>(
            <div key={a.id} onClick={()=>{setSelected(a); const d=DEPARTMENTS.find(x=>x.name===a.dept); if(d) setFocusDept(d);}} className={`p-2.5 rounded-lg border cursor-pointer ${selected.id===a.id?'border-[#5e6ad2] bg-[rgba(255,255,255,0.05)]':'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{a.avatar}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{a.name} <span className="font-normal text-[#8a8f98]">· {a.role}</span></div>
                  <div className="text-[10px] text-[#8a8f98] font-mono truncate">{a.status} · {a.dept}</div>
                </div>
              </div>
            </div>
          ))}
        </aside>
        <main className="bg-[#08090a] p-3 flex items-center justify-center">
          <div className="relative rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden w-full h-full min-h-[640px]" style={{background:'#0a0c12'}}>
            {mounted ? (
              <Canvas shadows camera={{position:[0,17,17],fov:46}} dpr={[1,2]}>
                <Scene agents={agents} selectedId={selected.id} onSelect={setSelected} focus={focusDept} />
              </Canvas>
            ) : (<div className="w-full h-full flex items-center justify-center text-sm font-mono text-[#8a8f98]">Memuat gedung kantor 3D…</div>)}
            <div className="absolute top-2.5 left-2.5 text-[10px] font-mono bg-black/70 border border-white/10 rounded px-2 py-1 pointer-events-none">Drag: putar · Scroll: zoom · Klik karyawan: detail</div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] font-mono bg-black/70 border border-white/10 rounded px-2.5 py-1.5 truncate pointer-events-none">{selected.avatar} <b style={{color:selected.color}}>{selected.name}</b> ({selected.role}) · {selected.status} · 📍 {selected.dept} · {selected.task}</div>
          </div>
        </main>
        <aside className="border-l border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-3 flex flex-col text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px]">Aktivitas Kantor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="mt-2 bg-[#08090a] border border-[rgba(255,255,255,0.08)] rounded-lg p-2.5 text-[11px]">
            <div className="text-[#f7f8f8] font-sans font-semibold text-xs">{selected.avatar} {selected.name} — {selected.role}</div>
            <div className="text-[#8a8f98] mt-1">Status: {selected.status}</div>
            <div className="text-[#d0d6e0] mt-0.5">Tugas: {selected.task}</div>
            <div className="text-[#8a8f98] mt-0.5">Lokasi: {selected.dept}</div>
          </div>
          <div className="flex-1 mt-2 bg-[#08090a] border border-[rgba(255,255,255,0.08)] rounded-lg p-2.5 overflow-y-auto space-y-1.5 max-h-[calc(100vh-240px)] text-[11px] leading-relaxed">
            {logs.map((l,i)=>(<div key={i} className="text-[#d0d6e0] border-b border-white/5 pb-1">{l}</div>))}
          </div>
        </aside>
      </div>
    </div>
  );
}
