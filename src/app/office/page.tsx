'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface Agent { id:string; name:string; role:string; dept:string; status:'Online'|'Busy'|'Meeting'|'Away'|'Offline'; task:string; avatar:string; color:string; x:number; z:number; targetX:number; targetZ:number; isMoving:boolean; speech:string; sitting:boolean; }
interface Dept { id:string; name:string; label:string; x:number; z:number; w:number; d:number; floor:string; }
interface WS { id:string; x:number; z:number; rot:number; room:string; agentId:string; glow:string; on:boolean; }

// 10 zona fisik sesuai spec: Lobby, Open, Command, IT, HR, Manager, Meeting A/B, Pantry, Lounge, Server
const DEPARTMENTS: Dept[] = [
  { id:'lobby', name:'Lobby / Reception', label:'LOBBY', x:0, z:-8.2, w:22, d:3.6, floor:'#26292f' },
  { id:'open', name:'Open Office', label:'OPEN OFFICE', x:-7.5, z:-3.8, w:8, d:5.2, floor:'#20242c' },
  { id:'command', name:'Command Center', label:'COMMAND CENTER', x:1.5, z:-3.8, w:9, d:5.2, floor:'#141a28' },
  { id:'it', name:'IT / Development', label:'IT / DEVELOPMENT', x:9, z:-3.8, w:6, d:5.2, floor:'#18241f' },
  { id:'meetingA', name:'Meeting Room A', label:'MEETING ROOM A', x:-7.5, z:1.6, w:8, d:4.4, floor:'#232036' },
  { id:'manager', name:'Manager Room', label:'MANAGER', x:-0.5, z:1.6, w:5, d:4.4, floor:'#2c2318' },
  { id:'meetingB', name:'Meeting Room B', label:'MEETING ROOM B', x:4.5, z:1.6, w:5, d:4.4, floor:'#232036' },
  { id:'hr', name:'HR Room', label:'HR', x:9.5, z:1.6, w:5, d:4.4, floor:'#1d2545' },
  { id:'pantry', name:'Pantry', label:'PANTRY', x:-7.5, z:6.2, w:8, d:4.4, floor:'#2c211b' },
  { id:'lounge', name:'Lounge', label:'LOUNGE', x:0, z:6.2, w:7, d:4.4, floor:'#17293c' },
  // Tambahkan zona kamar
  { id:'sleeping', name:'Sleeping Quarters', label:'SLEEPING', x:-4.5, z:6.2, w:6, d:4.4, floor:'#12141a' },

];
const ROOM_POS: Record<string,{x:number;z:number}> = {};
DEPARTMENTS.forEach(d=>{ ROOM_POS[d.name]={x:d.x,z:d.z}; });

const WORKSTATIONS: WS[] = [
  { id:'ws-open-1', x:-8.8, z:-4.2, rot:0, room:'Open Office', agentId:'5', glow:'#38bdf8', on:true },
  { id:'ws-open-2', x:-6.2, z:-4.2, rot:0, room:'Open Office', agentId:'6', glow:'#a855f7', on:true },
  { id:'ws-open-3', x:-8.8, z:-2.6, rot:Math.PI, room:'Open Office', agentId:'', glow:'#22c55e', on:true },
  { id:'ws-open-4', x:-6.2, z:-2.6, rot:Math.PI, room:'Open Office', agentId:'', glow:'#facc15', on:true },
  { id:'ws-cmd-1', x:-0.8, z:-4.4, rot:0, room:'Command Center', agentId:'2', glow:'#22d3ee', on:true },
  { id:'ws-cmd-2', x:1.2, z:-4.4, rot:0, room:'Command Center', agentId:'', glow:'#22d3ee', on:true },
  { id:'ws-cmd-3', x:3.2, z:-4.4, rot:0, room:'Command Center', agentId:'4', glow:'#34d399', on:true },
  { id:'ws-cmd-4', x:0.2, z:-2.4, rot:Math.PI, room:'Command Center', agentId:'', glow:'#818cf8', on:true },
  { id:'ws-it-1', x:8.2, z:-4.2, rot:0, room:'IT / Development', agentId:'3', glow:'#22d3ee', on:true },
  { id:'ws-it-2', x:9.8, z:-4.2, rot:0, room:'IT / Development', agentId:'', glow:'#a855f7', on:true },
  { id:'ws-hr-1', x:9.5, z:1.2, rot:0, room:'HR Room', agentId:'7', glow:'#34d399', on:true },
  { id:'ws-mgr-1', x:-0.5, z:1.2, rot:0, room:'Manager Room', agentId:'1', glow:'#fbbf24', on:true },
];

const INITIAL_AGENTS: Agent[] = [
  { id:'1', name:'SATORU', role:'Manager', dept:'Manager Room', status:'Online', task:'Review sprint & approve budget', avatar:'👔', color:'#5e6ad2', x:-0.5, z:1.2, targetX:-0.5, targetZ:1.2, isMoving:false, speech:'Sprint Q4 disetujui.', sitting:true },
  { id:'2', name:'NAGATO', role:'Product', dept:'Command Center', status:'Online', task:'Monitoring dashboard command', avatar:'📊', color:'#fb923c', x:-0.8, z:-4.4, targetX:-0.8, targetZ:-4.4, isMoving:false, speech:'Semua metrik hijau.', sitting:true },
  { id:'3', name:'ITACHI', role:'Architect', dept:'IT / Development', status:'Busy', task:'Coding arsitektur backend', avatar:'💻', color:'#a78bfa', x:8.2, z:-4.2, targetX:8.2, targetZ:-4.2, isMoving:false, speech:'Refactor auth module.', sitting:true },
  { id:'4', name:'KISAME', role:'SRE / Ops', dept:'Command Center', status:'Online', task:'Jaga NOC — uptime watcher', avatar:'🖥️', color:'#60a5fa', x:3.2, z:-4.4, targetX:3.2, targetZ:-4.4, isMoving:false, speech:'Uptime 100%.', sitting:true },
  { id:'5', name:'SASORI', role:'Developer', dept:'Open Office', status:'Busy', task:'Membangun UI design system', avatar:'🎨', color:'#f472b6', x:-8.8, z:-4.2, targetX:-8.8, targetZ:-4.2, isMoving:false, speech:'Polish komponen.', sitting:true },
  { id:'6', name:'DEIDARA', role:'QA', dept:'Open Office', status:'Online', task:'Automated testing suite', avatar:'🧪', color:'#facc15', x:-6.2, z:-4.2, targetX:-6.2, targetZ:-4.2, isMoving:false, speech:'Test suite hijau.', sitting:true },
  { id:'7', name:'KONAN', role:'HRD', dept:'HR Room', status:'Online', task:'Rekrutmen & administrasi', avatar:'📋', color:'#34d399', x:9.5, z:1.2, targetX:9.5, targetZ:1.2, isMoving:false, speech:'Absensi sesuai UU.', sitting:true },
];

const ROTATION:{agentId:string;to:string;wsId:string;task:string;status:Agent['status'];speech:string}[]=[
  { agentId:'3', to:'Meeting Room A', wsId:'', task:'Presentasi arsitektur di meeting', status:'Meeting', speech:'Presentasi diagram.' },
  { agentId:'3', to:'IT / Development', wsId:'ws-it-1', task:'Kembali coding di workstation', status:'Busy', speech:'Lanjut coding.' },
  { agentId:'5', to:'Meeting Room A', wsId:'', task:'Demo UI di meeting room', status:'Meeting', speech:'Demo mockup baru.' },
  { agentId:'5', to:'Pantry', wsId:'', task:'Istirahat kopi di pantry', status:'Away', speech:'Ngopi dulu' },
  { agentId:'5', to:'Open Office', wsId:'ws-open-1', task:'Kembali ke workstation', status:'Busy', speech:'Lanjut slicing UI.' },
  { agentId:'6', to:'Server Room', wsId:'', task:'Cek deployment di server room', status:'Busy', speech:'Verifikasi build.' },
  { agentId:'6', to:'Command Center', wsId:'ws-cmd-4', task:'Laporan QA di command center', status:'Online', speech:'0 critical bug.' },
  { agentId:'2', to:'Manager Room', wsId:'', task:'Koordinasi dengan manager', status:'Meeting', speech:'Sinkron roadmap.' },
  { agentId:'2', to:'Command Center', wsId:'ws-cmd-1', task:'Kembali monitor dashboard', status:'Online', speech:'Monitoring aman.' },
  { agentId:'7', to:'Lobby / Reception', wsId:'', task:'Menyambut kandidat di lobby', status:'Away', speech:'Interview kandidat.' },
  { agentId:'7', to:'HR Room', wsId:'ws-hr-1', task:'Arsip dokumen HR', status:'Online', speech:'SOP tersimpan.' },
  { agentId:'1', to:'Meeting Room B', wsId:'', task:'Memimpin board meeting', status:'Meeting', speech:'Semua divisi hadir.' },
  { agentId:'1', to:'Manager Room', wsId:'ws-mgr-1', task:'Kembali ke ruang manager', status:'Online', speech:'Approve budget.' },
  { agentId:'4', to:'Server Room', wsId:'', task:'Inspeksi rak server fisik', status:'Busy', speech:'Suhu rack normal.' },
  { agentId:'4', to:'Command Center', wsId:'ws-cmd-3', task:'Kembali jaga NOC', status:'Online', speech:'NOC aman.' },
  { agentId:'6', to:'Lounge', wsId:'', task:'Break santai di lounge', status:'Away', speech:'Rehat 10 menit.' },
  { agentId:'6', to:'Open Office', wsId:'ws-open-2', task:'Lanjut testing di workstation', status:'Online', speech:'Test jalan lagi.' },
];

function Worker({ agent, selected, onSelect }:{agent:Agent;selected:boolean;onSelect:()=>void}){
  const ref=useRef<THREE.Group>(null);
  const isSleeping = agent.dept === 'Sleeping Quarters' && !agent.isMoving;
  useFrame((state,delta)=>{
    const g=ref.current; if(!g) return;
    const dx=agent.targetX-g.position.x, dz=agent.targetZ-g.position.z;
    const dist=Math.hypot(dx,dz);
    const k=Math.min(1,delta*2.2);
    g.position.x+=dx*k; g.position.z+=dz*k;
    const walking=dist>0.15;
    g.position.y=walking?Math.abs(Math.sin(state.clock.elapsedTime*10))*0.09:0;
    if(walking) g.rotation.y=Math.atan2(dx,dz);
  });
  const statusColor=agent.status==='Online'?'#10b981':agent.status==='Busy'?'#f59e0b':agent.status==='Meeting'?'#5e6ad2':agent.status==='Away'?'#94a3b8':'#52525b';
  const sitY = agent.sitting && !agent.isMoving ? -0.18 : 0;
  return (
    <group ref={ref} position={[agent.x,0,agent.z]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.26,18]}/><meshBasicMaterial color="#000" transparent opacity={0.45}/></mesh>
      {isSleeping ? (
        <group position={[0,0,0]} rotation={[0,0,Math.PI/2]}>
          <mesh position={[0,0.2,0]}><boxGeometry args={[0.3,0.7,0.17]}/><meshStandardMaterial color={agent.color} roughness={0.5}/></mesh>
          <mesh position={[0,0.6,0]}><sphereGeometry args={[0.135,18,18]}/><meshStandardMaterial color="#f2c89b" roughness={0.55}/></mesh>
        </group>
      ) : (
        <group position={[0,sitY,0]}>
          <mesh position={[-0.06,0.19,0]}><cylinderGeometry args={[0.038,0.038,0.38,8]}/><meshStandardMaterial color="#111827" roughness={0.8}/></mesh>
          <mesh position={[0.06,0.19,0]}><cylinderGeometry args={[0.038,0.038,0.38,8]}/><meshStandardMaterial color="#111827" roughness={0.8}/></mesh>
          <mesh position={[0,0.55,0]} onClick={(e)=>{e.stopPropagation();onSelect();}} castShadow><boxGeometry args={[0.3,0.44,0.17]}/><meshStandardMaterial color={agent.color} roughness={0.5}/></mesh>
          <mesh position={[0,0.57,0.095]}><boxGeometry args={[0.06,0.32,0.015]}/><meshStandardMaterial color="#f1f5f9"/></mesh>
          <mesh position={[-0.18,0.55,0]}><boxGeometry args={[0.07,0.34,0.09]}/><meshStandardMaterial color={agent.color} roughness={0.6}/></mesh>
          <mesh position={[0.18,0.55,0]}><boxGeometry args={[0.07,0.34,0.09]}/><meshStandardMaterial color={agent.color} roughness={0.6}/></mesh>
          <mesh position={[0,0.94,0]} onClick={(e)=>{e.stopPropagation();onSelect();}} castShadow><sphereGeometry args={[0.135,18,18]}/><meshStandardMaterial color="#f2c89b" roughness={0.55}/></mesh>
          <mesh position={[0,1.03,-0.015]}><sphereGeometry args={[0.115,12,12,0,Math.PI*2,0,Math.PI*0.55]}/><meshStandardMaterial color="#1f2937" roughness={0.9}/></mesh>
        </group>
      )}
      {selected && (<mesh position={[0,0.02,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.34,0.45,26]}/><meshBasicMaterial color={agent.color} transparent opacity={0.95}/></mesh>)}
      <Html position={[0,1.44,0]} center distanceFactor={15} style={{pointerEvents:'none'}} zIndexRange={[20,0]}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          <div style={{background:'rgba(5,7,10,0.92)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:5,padding:'1px 6px',fontSize:9,fontWeight:800,color:'#fff',whiteSpace:'nowrap',letterSpacing:0.4,lineHeight:1.5}}>{agent.name} <span style={{fontWeight:400,opacity:0.7}}>{agent.role}</span></div>
          <div style={{display:'flex',alignItems:'center',gap:3,background:'rgba(5,7,10,0.85)',borderRadius:5,padding:'1px 6px',fontSize:8.5,color:'#e2e8f0',whiteSpace:'nowrap'}}><span style={{width:6,height:6,borderRadius:99,background:statusColor,display:'inline-block'}}/>{agent.isMoving?'Walking':agent.status}</div>
          {agent.speech && !agent.isMoving && (<div style={{background:'#f8fafc',color:'#0f172a',borderRadius:5,padding:'1px 7px',fontSize:9,whiteSpace:'nowrap',fontWeight:600,maxWidth:170,overflow:'hidden',textOverflow:'ellipsis'}}>{agent.speech}</div>)}
        </div>
      </Html>
    </group>
  );
}

function Workstation({ ws, assigned, selected, onSelect }:{ws:WS;assigned?:Agent;selected:boolean;onSelect:()=>void}){
  return (
    <group position={[ws.x,0,ws.z]} rotation={[0,ws.rot,0]}>
      <mesh position={[0,0.38,0]} castShadow receiveShadow onClick={(e)=>{e.stopPropagation();onSelect();}}><boxGeometry args={[1.35,0.06,0.65]}/><meshStandardMaterial color={selected?'#5e6ad2':'#43464e'} roughness={0.3} metalness={0.4}/></mesh>
      <mesh position={[-0.55,0.18,0]}><boxGeometry args={[0.06,0.36,0.55]}/><meshStandardMaterial color="#23252b" metalness={0.4} roughness={0.5}/></mesh>
      <mesh position={[0.55,0.18,0]}><boxGeometry args={[0.06,0.36,0.55]}/><meshStandardMaterial color="#23252b" metalness={0.4} roughness={0.5}/></mesh>
      <mesh position={[0,0.7,-0.16]}><boxGeometry args={[0.68,0.42,0.035]}/><meshStandardMaterial color="#05070b" emissive={ws.on?ws.glow:'#1f2937'} emissiveIntensity={ws.on?0.9:0.1}/></mesh>
      <mesh position={[0,0.44,-0.16]}><boxGeometry args={[0.05,0.12,0.05]}/><meshStandardMaterial color="#14161a"/></mesh>
      <mesh position={[0,0.425,0.1]}><boxGeometry args={[0.44,0.025,0.16]}/><meshStandardMaterial color="#14161a"/></mesh>
      <mesh position={[0.36,0.43,0.1]}><boxGeometry args={[0.08,0.035,0.11]}/><meshStandardMaterial color="#14161a"/></mesh>
      <mesh position={[0,0.26,0.7]}><boxGeometry args={[0.4,0.06,0.4]}/><meshStandardMaterial color="#17181d" roughness={0.6}/></mesh>
      <mesh position={[0,0.5,0.88]}><boxGeometry args={[0.4,0.44,0.06]}/><meshStandardMaterial color="#23252b" roughness={0.7}/></mesh>
      <mesh position={[0,0.13,0.7]}><cylinderGeometry args={[0.035,0.035,0.24,8]}/><meshStandardMaterial color="#5b5e66" metalness={0.7} roughness={0.3}/></mesh>
      <mesh position={[0,0.72,-0.33]}><boxGeometry args={[1.35,0.42,0.03]}/><meshStandardMaterial color="#23252b" roughness={0.9}/></mesh>
      {selected && (<mesh position={[0,0.03,0.2]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.8,0.9,30]}/><meshBasicMaterial color="#5e6ad2" transparent opacity={0.8}/></mesh>)}
      {assigned && (
        <Html position={[0,1.05,-0.16]} center distanceFactor={16} style={{pointerEvents:'none'}} zIndexRange={[10,0]}>
          <div style={{fontSize:8,background:'rgba(5,7,10,0.8)',color:'#9be3ff',border:'1px solid rgba(56,189,248,0.35)',borderRadius:4,padding:'0px 5px',whiteSpace:'nowrap',fontFamily:'monospace'}}>{assigned.name} · {assigned.task.slice(0,26)}</div>
        </Html>
      )}
    </group>
  );
}

function ServerRack({x,z,seed=0}:{x:number;z:number;seed?:number}){
  const ref=useRef<THREE.Mesh>(null);
  useFrame((s)=>{ if(ref.current){ const m=ref.current.material as THREE.MeshStandardMaterial; m.emissiveIntensity=0.55+Math.sin(s.clock.elapsedTime*2.6+seed)*0.3; } });
  return (
    <group position={[x,0,z]}>
      <mesh position={[0,0.95,0]} castShadow><boxGeometry args={[0.65,1.9,0.55]}/><meshStandardMaterial color="#10181a" roughness={0.35} metalness={0.55}/></mesh>
      <mesh position={[0,0.95,0.29]} ref={ref}><boxGeometry args={[0.5,1.6,0.02]}/><meshStandardMaterial color="#020617" emissive="#10b981" emissiveIntensity={0.6}/></mesh>
      {[0.4,0.7,1.0,1.3].map((y,i)=>(<mesh key={i} position={[-0.15+i*0.1, y, 0.3]}><boxGeometry args={[0.06,0.06,0.02]}/><meshStandardMaterial color="#000" emissive={i%2?'#38bdf8':'#f59e0b'} emissiveIntensity={1}/></mesh>))}
    </group>
  );
}

// Dinding rendah 1.2m: interior selalu terlihat dari kamera isometric
function LowWall({x,z,w,d,glass=false}:{x:number;z:number;w:number;d:number;glass?:boolean}){
  return (
    <group position={[x,0,z]}>
      <mesh position={[0,0.6,0]} castShadow receiveShadow><boxGeometry args={[w,1.2,d]}/><meshStandardMaterial color={glass?'#9fb3c8':'#2e3138'} transparent={glass} opacity={glass?0.26:1} roughness={glass?0.06:0.85} metalness={glass?0.15:0.05}/></mesh>
      <mesh position={[0,1.22,0]}><boxGeometry args={[w+0.04,0.05,d+0.04]}/><meshStandardMaterial color="#0b0d11" emissive={glass?'#38bdf8':'#5e6ad2'} emissiveIntensity={glass?0.7:0.35}/></mesh>
    </group>
  );
}

// Pintu terbuka: kusen + daun pintu + ambang
function Doorway({x,z,w=1.2,rot=0}:{x:number;z:number;w?:number;rot?:number}){
  return (
    <group position={[x,0,z]} rotation={[0,rot,0]}>
      <mesh position={[-w/2,0.6,0]}><boxGeometry args={[0.12,1.2,0.16]}/><meshStandardMaterial color="#3a3d44"/></mesh>
      <mesh position={[w/2,0.6,0]}><boxGeometry args={[0.12,1.2,0.16]}/><meshStandardMaterial color="#3a3d44"/></mesh>
      <mesh position={[0,1.24,0]}><boxGeometry args={[w+0.24,0.08,0.16]}/><meshStandardMaterial color="#0b0d11" emissive="#fbbf24" emissiveIntensity={0.4}/></mesh>
      <mesh position={[-w/2+0.35,0.55,0.45]} rotation={[0,0.7,0]}><boxGeometry args={[0.6,1.1,0.05]}/><meshStandardMaterial color="#4a3b28" roughness={0.5}/></mesh>
      <mesh position={[0,0.015,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[w,0.7]}/><meshStandardMaterial color="#3f3f46" roughness={0.9}/></mesh>
    </group>
  );
}

function Plant({x,z,s=1}:{x:number;z:number;s?:number}){
  return (
    <group position={[x,0,z]} scale={s}>
      <mesh position={[0,0.25,0]} castShadow><cylinderGeometry args={[0.2,0.16,0.5,10]}/><meshStandardMaterial color="#57534e" roughness={0.8}/></mesh>
      <mesh position={[0,0.75,0]} castShadow><sphereGeometry args={[0.38,10,10]}/><meshStandardMaterial color="#15803d" roughness={0.9}/></mesh>
      <mesh position={[0.15,0.6,0.1]}><sphereGeometry args={[0.22,8,8]}/><meshStandardMaterial color="#16a34a" roughness={0.9}/></mesh>
    </group>
  );
}

function Cabinet({x,z,rot=0}:{x:number;z:number;rot?:number}){
  return (
    <group position={[x,0,z]} rotation={[0,rot,0]}>
      <mesh position={[0,0.9,0]} castShadow><boxGeometry args={[0.6,1.8,1.2]}/><meshStandardMaterial color="#3f3f46" roughness={0.6} metalness={0.3}/></mesh>
      {[0.4,0.9,1.4].map((y,i)=>(<mesh key={i} position={[0,y,0.61]}><boxGeometry args={[0.44,0.03,0.02]}/><meshStandardMaterial color="#71717a" metalness={0.7}/></mesh>))}
    </group>
  );
}

function CeilingLamp({x,z}:{x:number;z:number}){
  return (
    <group position={[x,2.6,z]}>
      <mesh><boxGeometry args={[1.4,0.08,0.4]}/><meshStandardMaterial color="#0b0d11" emissive="#ffd9a0" emissiveIntensity={1.15}/></mesh>
      <mesh position={[0,0.6,0]}><cylinderGeometry args={[0.02,0.02,1.2,6]}/><meshStandardMaterial color="#0b0d11"/></mesh>
    </group>
  );
}

function Building({ agents, selectedRoomId, selectedWsId, onRoom, onWs }:{agents:Agent[];selectedRoomId:string|null;selectedWsId:string|null;onRoom:(d:Dept)=>void;onWs:(w:WS)=>void;}){
  const wsOf = (id:string)=>agents.find(a=>a.id===id);
  return (
    <group>
      {/* pelat gedung + refleksi */}
      <mesh position={[0,-0.12,0]} receiveShadow><boxGeometry args={[26,0.24,21]}/><meshStandardMaterial color="#0b0d12" roughness={0.7} metalness={0.25}/></mesh>
      <mesh position={[0,-0.26,0]}><boxGeometry args={[27.5,0.12,22.5]}/><meshStandardMaterial color="#04050a" roughness={1}/></mesh>
      {DEPARTMENTS.map(d=>(
        <group key={d.id}>
          <mesh position={[d.x,0.005,d.z]} rotation={[-Math.PI/2,0,0]} onClick={(e)=>{e.stopPropagation();onRoom(d);}}>
            <planeGeometry args={[d.w,d.d]}/>
            <meshStandardMaterial color={selectedRoomId===d.id?'#2c3552':d.floor} roughness={0.85} metalness={0.08}/>
          </mesh>
          {selectedRoomId===d.id && (<mesh position={[d.x,0.02,d.z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[d.w+0.25,d.d+0.25]}/><meshBasicMaterial color="#5e6ad2" transparent opacity={0.22}/></mesh>)}
        </group>
      ))}
      <gridHelper args={[26,26,'#262a32','#16181d']} position={[0,0.012,0]} />

      {/* dinding luar + jendela kaca */}
      <LowWall x={-6} z={-10.1} w={10} d={0.18} />
      <LowWall x={6} z={-10.1} w={10} d={0.18} glass />
      <LowWall x={-11.1} z={-3} w={0.18} d={8} />
      <LowWall x={-11.1} z={4} w={0.18} d={6} glass />
      <LowWall x={11.1} z={-3} w={0.18} d={8} glass />
      <LowWall x={11.1} z={4} w={0.18} d={6} />
      <LowWall x={-6} z={8.5} w={10} d={0.18} />
      <LowWall x={6} z={8.5} w={10} d={0.18} />
      {/* sekat dalam */}
      <LowWall x={0} z={-6.35} w={22} d={0.14} />
      <LowWall x={-3.4} z={-3.8} w={0.14} d={5.2} />
      <LowWall x={6} z={-3.8} w={0.14} d={5.2} glass />
      <LowWall x={-3.4} z={1.6} w={0.14} d={4.4} glass />
      <LowWall x={2} z={1.6} w={0.14} d={4.4} />
      <LowWall x={7} z={1.6} w={0.14} d={4.4} glass />
      <LowWall x={0} z={-1.05} w={22} d={0.14} />
      <LowWall x={0} z={3.85} w={22} d={0.14} />
      <LowWall x={-3.5} z={6.2} w={0.14} d={4.4} />
      <LowWall x={3.5} z={6.2} w={0.14} d={4.4} />
      {/* pintu tiap ruangan */}
      <Doorway x={0} z={-6.35} />
      <Doorway x={1.5} z={-1.05} />
      <Doorway x={-7.5} z={-1.05} />
      <Doorway x={9} z={-1.05} />
      <Doorway x={-7.5} z={3.85} />
      <Doorway x={-0.5} z={3.85} />
      <Doorway x={4.5} z={3.85} />
      <Doorway x={9.5} z={3.85} />
      <Doorway x={0} z={-10.1} w={1.6} />
      <Doorway x={-7.5} z={8.5} />
      <Doorway x={7.5} z={8.5} />

        {/* LOBBY */}
      <group position={[0,0,-8.2]}>
        <mesh position={[2.5,0.5,0.4]} castShadow receiveShadow><boxGeometry args={[3.6,1,0.85]}/><meshStandardMaterial color="#6b4423" roughness={0.3}/></mesh>
        <mesh position={[2.5,1.03,0.4]}><boxGeometry args={[3.7,0.07,0.95]}/><meshStandardMaterial color="#1c1917" roughness={0.15} metalness={0.4}/></mesh>
        <mesh position={[2.5,1.15,0.2]}><boxGeometry args={[0.5,0.28,0.04]}/><meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.8}/></mesh>
        <mesh position={[2.5,1.85,-1.55]}><boxGeometry args={[5.5,0.9,0.1]}/><meshStandardMaterial color="#111318" roughness={0.7}/></mesh>
        <Plant x={-7.5} z={0.4} />
        <Plant x={7.5} z={0.4} />
        <Cabinet x={-9.5} z={-0.8} rot={Math.PI/2} />
        <mesh position={[0,0.6,-1.72]}><boxGeometry args={[2.2,1.2,0.06]}/><meshStandardMaterial color="#0ea5e9" transparent opacity={0.3} roughness={0.05}/></mesh>
      </group>

      {/* WORKSTATIONS */}
      {WORKSTATIONS.map(ws=>(<Workstation key={ws.id} ws={ws} assigned={ws.agentId?wsOf(ws.agentId):undefined} selected={selectedWsId===ws.id} onSelect={()=>onWs(ws)} />))}

      {/* COMMAND CENTER — NOC / Mission Control */}
      <group position={[1.5,0,-6.1]}>
        <mesh position={[0,1.1,0]} castShadow><boxGeometry args={[8.6,2.1,0.25]}/><meshStandardMaterial color="#0a0d14" roughness={0.55}/></mesh>
        {[[-3.2,'#0ea5e9'],[-1.6,'#10b981'],[0,'#5e6ad2'],[1.6,'#f59e0b'],[3.2,'#38bdf8']].map(([ox,c],i)=>(<mesh key={i} position={[ox as number,1.25,0.15]}><boxGeometry args={[1.45,0.85,0.04]}/><meshStandardMaterial color="#020617" emissive={c as string} emissiveIntensity={0.75}/></mesh>))}
        {[-0.3,-0.1,0.1,0.3].map((ox,i)=>(<mesh key={i} position={[ox,1.25,0.18]}><boxGeometry args={[0.08,0.08,0.02]}/><meshBasicMaterial color="#fff"/></mesh>))}
        {[-0.2,0,0.2].map((ox,i)=>(<mesh key={i} position={[ox,-3.55-(-6.1)+0.35,0]} />))}
        <mesh position={[0,0.35,0.9]} castShadow><boxGeometry args={[6.5,0.1,1.1]}/><meshStandardMaterial color="#151923" roughness={0.3} metalness={0.35}/></mesh>
        {[-2,-0.7,0.7,2].map((ox,i)=>(<mesh key={i} position={[ox,0.62,0.9]}><boxGeometry args={[0.9,0.4,0.03]}/><meshStandardMaterial color="#020617" emissive="#22d3ee" emissiveIntensity={0.7}/></mesh>))}
        {/* central command desk */}
        <mesh position={[0,0.3,2.2]} castShadow><boxGeometry args={[2.4,0.08,1]}/><meshStandardMaterial color="#1e2430" roughness={0.3} metalness={0.3}/></mesh>
        <mesh position={[0,0.62,2.0]}><boxGeometry args={[1.1,0.4,0.04]}/><meshStandardMaterial color="#020617" emissive="#5e6ad2" emissiveIntensity={0.8}/></mesh>
      </group>
      {/* whiteboard IT */}
      <mesh position={[9,1.15,-1.35]}><boxGeometry args={[3.4,1.3,0.06]}/><meshStandardMaterial color="#f1f5f9" roughness={0.85}/></mesh>
      <mesh position={[8.2,1.15,-1.3]}><boxGeometry args={[1.2,0.5,0.03]}/><meshStandardMaterial color="#1d4ed8" roughness={0.8}/></mesh>
      <mesh position={[9.6,1.05,-1.3]}><boxGeometry args={[0.7,0.35,0.03]}/><meshStandardMaterial color="#0ea5e9" roughness={0.8}/></mesh>

      {/* MEETING A */}
      <group position={[-7.5,0,1.6]}>
        <mesh position={[0,0.4,0]} castShadow receiveShadow><boxGeometry args={[4.6,0.09,1.9]}/><meshStandardMaterial color="#14161c" roughness={0.25} metalness={0.25}/></mesh>
        {[-1.6,-0.55,0.55,1.6].map((cx,i)=>(
          <group key={'a'+i} position={[cx,0,-1.25]}>
            <mesh position={[0,0.28,0]}><boxGeometry args={[0.44,0.07,0.44]}/><meshStandardMaterial color="#26282f"/></mesh>
            <mesh position={[0,0.55,-0.18]}><boxGeometry args={[0.44,0.46,0.07]}/><meshStandardMaterial color="#3a3d44"/></mesh>
          </group>
        ))}
        {[-1.6,-0.55,0.55,1.6].map((cx,i)=>(
          <group key={'b'+i} position={[cx,0,1.25]}>
            <mesh position={[0,0.28,0]}><boxGeometry args={[0.44,0.07,0.44]}/><meshStandardMaterial color="#26282f"/></mesh>
            <mesh position={[0,0.55,0.18]}><boxGeometry args={[0.44,0.46,0.07]}/><meshStandardMaterial color="#3a3d44"/></mesh>
          </group>
        ))}
        <mesh position={[0,1.7,-2]}><boxGeometry args={[2.8,1.2,0.07]}/><meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.65}/></mesh>
        <mesh position={[-3.3,1.4,0.4]} rotation={[0,Math.PI/2,0]}><boxGeometry args={[2.4,1.2,0.05]}/><meshStandardMaterial color="#e2e8f0" roughness={0.9}/></mesh>
        <mesh position={[2,0.15,1.2]}><boxGeometry args={[0.3,0.3,0.3]}/><meshStandardMaterial color="#0f172a"/></mesh>
      </group>
      {/* MEETING B */}
      <group position={[4.5,0,1.6]}>
        <mesh position={[0,0.4,0]} castShadow><boxGeometry args={[3.2,0.09,1.6]}/><meshStandardMaterial color="#14161c" roughness={0.25} metalness={0.25}/></mesh>
        {[-1,0,1].map((cx,i)=>(
          <group key={i} position={[cx,0,-1.05]}>
            <mesh position={[0,0.28,0]}><boxGeometry args={[0.42,0.07,0.42]}/><meshStandardMaterial color="#26282f"/></mesh>
            <mesh position={[0,0.55,-0.17]}><boxGeometry args={[0.42,0.44,0.07]}/><meshStandardMaterial color="#3a3d44"/></mesh>
          </group>
        ))}
        {[-1,0,1].map((cx,i)=>(
          <group key={'r'+i} position={[cx,0,1.05]}>
            <mesh position={[0,0.28,0]}><boxGeometry args={[0.42,0.07,0.42]}/><meshStandardMaterial color="#26282f"/></mesh>
            <mesh position={[0,0.55,0.17]}><boxGeometry args={[0.42,0.44,0.07]}/><meshStandardMaterial color="#3a3d44"/></mesh>
          </group>
        ))}
        <mesh position={[0,1.6,-2]}><boxGeometry args={[2.2,1,0.07]}/><meshStandardMaterial color="#020617" emissive="#a78bfa" emissiveIntensity={0.6}/></mesh>
      </group>
      {/* MANAGER */}
      <group position={[-0.5,0,1.6]}>
        <mesh position={[0,0.4,-1]} castShadow><boxGeometry args={[2.6,0.09,1.15]}/><meshStandardMaterial color="#4a2c12" roughness={0.25}/></mesh>
        <mesh position={[0,0.78,-1.35]}><boxGeometry args={[1.1,0.55,0.05]}/><meshStandardMaterial color="#020617" emissive="#fbbf24" emissiveIntensity={0.55}/></mesh>
        <mesh position={[0,0.38,0.75]}><boxGeometry args={[0.55,0.09,0.55]}/><meshStandardMaterial color="#15171c"/></mesh>
        <mesh position={[0,0.72,1]}><boxGeometry args={[0.55,0.55,0.09]}/><meshStandardMaterial color="#15171c"/></mesh>
        <mesh position={[1.6,0.32,0.6]}><boxGeometry args={[1.1,0.45,0.55]}/><meshStandardMaterial color="#6b4423" roughness={0.7}/></mesh>
        <Plant x={-1.6} z={0.6} s={0.8} />
        <Cabinet x={-2} z={-1.4} />
      </group>
      {/* HR */}
      <group position={[9.5,0,1.6]}>
        <Cabinet x={0.8} z={2} />
        <Cabinet x={1.8} z={2} />
        <mesh position={[-1,0.4,-1.2]}><boxGeometry args={[2,0.08,1]}/><meshStandardMaterial color="#2e3138" roughness={0.5}/></mesh>
        <mesh position={[-1.5,0.28,-1.2]}><boxGeometry args={[0.4,0.07,0.4]}/><meshStandardMaterial color="#26282f"/></mesh>
        <mesh position={[-0.5,0.28,-1.2]}><boxGeometry args={[0.4,0.07,0.4]}/><meshStandardMaterial color="#26282f"/></mesh>
        <Plant x={-1.9} z={1.6} s={0.75} />
      </group>
      {/* PANTRY */}
      <group position={[-7.5,0,6.2]}>
        <mesh position={[-1.5,0.45,-1.2]} castShadow><boxGeometry args={[3.4,0.9,0.7]}/><meshStandardMaterial color="#d6d3d1" roughness={0.35}/></mesh>
        <mesh position={[0.6,1.05,-1.3]}><boxGeometry args={[0.5,0.4,0.5]}/><meshStandardMaterial color="#14161a"/></mesh>
        <mesh position={[-1.8,1.1,-1.3]}><boxGeometry args={[0.65,0.7,0.35]}/><meshStandardMaterial color="#e7e5e4" metalness={0.5} roughness={0.3}/></mesh>
        <mesh position={[-2.7,0.95,-1.3]}><boxGeometry args={[0.4,0.35,0.35]}/><meshStandardMaterial color="#78350f" roughness={0.6}/></mesh>
        <mesh position={[0.5,0.4,0.8]} castShadow><boxGeometry args={[2.6,0.07,1.1]}/><meshStandardMaterial color="#8a5a2b" roughness={0.3}/></mesh>
        {[-0.4,0.5,1.4].map((cx,i)=>(<mesh key={i} position={[cx,0.24,1.5]}><cylinderGeometry args={[0.19,0.19,0.48,10]}/><meshStandardMaterial color="#3a3d44"/></mesh>))}
        <mesh position={[2.8,1.6,-1.4]}><boxGeometry args={[1.4,0.9,0.08]}/><meshStandardMaterial color="#f1f5f9" roughness={0.85}/></mesh>
      </group>
      {/* LOUNGE */}
      <group position={[0,0,6.2]}>
        <mesh position={[-1.5,0.28,-0.8]} castShadow><boxGeometry args={[2.1,0.4,0.9]}/><meshStandardMaterial color="#0c4a6e" roughness={0.8}/></mesh>
        <mesh position={[-1.5,0.55,-1.2]}><boxGeometry args={[2.1,0.5,0.18]}/><meshStandardMaterial color="#082f49" roughness={0.8}/></mesh>
        <mesh position={[1.5,0.28,0.8]} castShadow><boxGeometry args={[2.1,0.4,0.9]}/><meshStandardMaterial color="#0c4a6e" roughness={0.8}/></mesh>
        <mesh position={[1.5,0.55,1.2]}><boxGeometry args={[2.1,0.5,0.18]}/><meshStandardMaterial color="#082f49" roughness={0.8}/></mesh>
        <mesh position={[0,0.24,0]}><boxGeometry args={[1,0.32,0.6]}/><meshStandardMaterial color="#57340f" roughness={0.5}/></mesh>
        <Plant x={2.9} z={-1.2} />
        <mesh position={[0,0.06,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[1.6,24]}/><meshStandardMaterial color="#20262e" roughness={0.95}/></mesh>
      </group>
      {/* SERVER */}
      <ServerRack x={5} z={6.4} seed={0} />
      <ServerRack x={6} z={6.4} seed={1.4} />
      <ServerRack x={7} z={6.4} seed={2.8} />
      <ServerRack x={8} z={6.4} seed={4.2} />
      <ServerRack x={9.5} z={6.4} seed={5.6} />
      <group position={[7,0,7.6]}>
        <mesh position={[0,0.4,0]}><boxGeometry args={[3.4,0.8,0.5]}/><meshStandardMaterial color="#1c1e24" roughness={0.5}/></mesh>
        <mesh position={[-1,0.85,0]}><boxGeometry args={[0.5,0.3,0.4]}/><meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.8}/></mesh>
        <mesh position={[1,0.5,0.05]}><boxGeometry args={[1,0.15,0.06]}/><meshStandardMaterial color="#000" emissive="#f59e0b" emissiveIntensity={0.7}/></mesh>
      </group>
      {/* lampu + label */}
      {DEPARTMENTS.map(d=>(<CeilingLamp key={'lamp'+d.id} x={d.x} z={d.z} />))}
      {DEPARTMENTS.map(d=>(
        <Html key={d.id} position={[d.x,2.15,d.z]} center distanceFactor={30} style={{pointerEvents:'none'}} zIndexRange={[15,0]}>
          <div style={{background:'rgba(4,6,10,0.8)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:5,padding:'1px 8px',fontSize:9.5,fontWeight:800,color:'#e8edf4',whiteSpace:'nowrap',letterSpacing:1}}>{d.label}</div>
        </Html>
      ))}
      <Html position={[2.5,2.3,-9.8]} center distanceFactor={26} style={{pointerEvents:'none'}} zIndexRange={[15,0]}>
        <div style={{fontSize:12,fontWeight:900,color:'#fbbf24',letterSpacing:1.5,whiteSpace:'nowrap',textShadow:'0 2px 10px #000'}}>PT. INDO JAYA GRAM</div>
      </Html>
      <ContactShadows position={[0,0.02,0]} opacity={0.55} scale={30} blur={2.4} far={4} color="#000000" />
    </group>
  );
}

function Scene({ agents, selectedId, selectedRoomId, selectedWsId, focus, topView, onAgent, onRoom, onWs }:{
  agents:Agent[];selectedId:string;selectedRoomId:string|null;selectedWsId:string|null;focus:{x:number;z:number}|null;topView:boolean;
  onAgent:(a:Agent)=>void;onRoom:(d:Dept)=>void;onWs:(w:WS)=>void;
}){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controls=useRef<any>(null);
  useFrame(()=>{
    if(controls.current&&focus){
      const t=new THREE.Vector3(focus.x,0,focus.z);
      controls.current.target.lerp(t,0.08);
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#fef3c7','#141210',0.55]} />
      <directionalLight position={[14,22,10]} intensity={1.55} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} />
      <pointLight position={[1.5,3,-3.8]} intensity={24} color="#bfe9ff" distance={15} />
      <pointLight position={[-7.5,3,1.6]} intensity={15} color="#ffe4b5" distance={12} />
      <pointLight position={[0,3,6.2]} intensity={13} color="#ffd9a0" distance={12} />
      <pointLight position={[7.5,3,6.2]} intensity={11} color="#a7f3d0" distance={10} />
      <pointLight position={[9,2.5,-3.8]} intensity={9} color="#a5f3c8" distance={9} />
      <Building agents={agents} selectedRoomId={selectedRoomId} selectedWsId={selectedWsId} onRoom={onRoom} onWs={onWs} />
      {agents.map(a=>(<Worker key={a.id} agent={a} selected={selectedId===a.id} onSelect={()=>onAgent(a)} />))}
      {topView
        ? <OrbitControls ref={controls} enableDamping dampingFactor={0.08} enablePan={true} minDistance={6} maxDistance={42} maxPolarAngle={0.05} minPolarAngle={0} target={focus?[focus.x,0,focus.z]:[0,0,0]} />
        : <OrbitControls ref={controls} enableDamping dampingFactor={0.08} enablePan={true} minDistance={6} maxDistance={42} maxPolarAngle={1.02} minPolarAngle={0.25} target={focus?[focus.x,0,focus.z]:[0,0,0]} />}
    </>
  );
}

export default function VirtualOfficePage(){
  const [agents,setAgents]=useState<Agent[]>(INITIAL_AGENTS);
  const [logs,setLogs]=useState<string[]>(['Mission Control dimuat — 11 zona kantor aktif, kamera isometric terkunci']);
  const [selected,setSelected]=useState<Agent>(INITIAL_AGENTS[0]);
  const [selectedRoom,setSelectedRoom]=useState<Dept|null>(DEPARTMENTS.find(d=>d.id==='command')||null);
  const [selectedWs,setSelectedWs]=useState<WS|null>(null);
  const [focus,setFocus]=useState<{x:number;z:number}|null>(null);
  const [time,setTime]=useState('');
  const [mounted,setMounted]=useState(false);
  const [query,setQuery]=useState('');
  const [topView,setTopView]=useState(false);
  const idx=useRef(0);

  useEffect(()=>{
    setMounted(true);
    const c=setInterval(()=>setTime(new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})),1000);
    const m=setInterval(()=>{
      const now=new Date();
      const h=parseInt(now.toLocaleString('en-US',{timeZone:'Asia/Jakarta',hour:'numeric',hour12:false}));
      const ops=h>=8&&h<19;
      if(!ops){
        const jakartaDate=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Jakarta'}));
        const startYear=new Date(jakartaDate.getFullYear(),0,0);
        const dayNum=Math.floor((jakartaDate.getTime()-startYear.getTime())/86400000);
        const NIGHT_CREW=['3','4','5','6'];
        const picker=NIGHT_CREW[dayNum%NIGHT_CREW.length];
        const sleepPos=ROOM_POS['Sleeping Quarters'];
        const devPos=ROOM_POS['IT / Development'];
        const hrPos=ROOM_POS['HR Room'];
        const mgrPos=ROOM_POS['Manager Room'];
        setAgents(prev=>prev.map(ag=>{
          if(ag.id===picker){ const d=ROOM_POS['Command Center']; return {...ag,status:'Online' as const,task:'Jaga server bergantian (Lembur)',speech:'Shift jaga.',dept:'Command Center',targetX:d.x+1.7,targetZ:d.z+0.4,isMoving:false,sitting:false}; }
          if(ag.id==='1'){ return {...ag,status:'Online' as const,task:'Review sprint & approve budget (Lembur)',speech:'Sprint Q4.',dept:'Manager Room',targetX:mgrPos.x,targetZ:mgrPos.z,isMoving:false,sitting:true}; }
          if(ag.id==='3'){ return {...ag,status:'Busy' as const,task:'Coding arsitektur backend (Lembur)',speech:'Bugfixing.',dept:'IT / Development',targetX:devPos.x,targetZ:devPos.z,isMoving:false,sitting:true}; }
          if(ag.id==='7'){ return {...ag,status:'Online' as const,task:'Rekrutmen & administrasi (Lembur)',speech:'Evaluasi.',dept:'HR Room',targetX:hrPos.x,targetZ:hrPos.z,isMoving:false,sitting:true}; }
          return {...ag,status:'Away' as const,task:'Istirahat di kamar',speech:'Tidur.',dept:'Sleeping Quarters',targetX:sleepPos.x+(Number(ag.id)%3)*1.1-1.1,targetZ:sleepPos.z+0.4,isMoving:false,sitting:false};
        }));
        return;
      }
      const ev=ROTATION[idx.current%ROTATION.length]; idx.current+=1;
      const dest=ROOM_POS[ev.to]||{x:0,z:0};
      let tx=dest.x, tz=dest.z;
      if(ev.wsId){ const ws=WORKSTATIONS.find(w=>w.id===ev.wsId); if(ws){ tx=ws.x; tz=ws.z+(ws.rot===0?0.7:-0.7); } }
      else { tx=dest.x+(Number(ev.agentId)%3)*0.9-0.9; tz=dest.z+0.7; }
      const sitting = !!ev.wsId;
      setAgents(prev=>prev.map(ag=>ag.id===ev.agentId?{...ag,dept:ev.to,targetX:tx,targetZ:tz,task:ev.task,status:ev.status,speech:ev.speech,isMoving:true,sitting}:ag));
      const who=INITIAL_AGENTS.find(a=>a.id===ev.agentId);
      if(who) setLogs(p=>['['+new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})+'] '+who.name+' -> '+ev.to+': '+ev.task,...p.slice(0,60)]);
      setTimeout(()=>{ setAgents(prev=>prev.map(ag=>ag.id===ev.agentId?{...ag,isMoving:false,x:ag.targetX,z:ag.targetZ,sitting}:ag)); },2600);
    },5200);
    return ()=>{ clearInterval(c); clearInterval(m); };
  },[]);

  const online=useMemo(()=>agents.filter(a=>a.status!=='Offline').length,[agents]);
  const filtered=useMemo(()=>agents.filter(a=>(a.name+a.role+a.dept).toLowerCase().includes(query.toLowerCase())),[agents,query]);
  const roomAgents = useMemo(()=>selectedRoom?agents.filter(a=>a.dept===selectedRoom.name):[],[agents,selectedRoom]);

  // SYNC: selected selalu ikut state live agen (fix mismatch 3D vs panel bawah)
  useEffect(()=>{
    setSelected(prev=>{
      const live=agents.find(a=>a.id===prev.id);
      return live?{...live}:prev;
    });
  },[agents]);

  const pickAgent=(a:Agent)=>{ setSelected(a); setSelectedWs(null); const d=DEPARTMENTS.find(x=>x.name===a.dept); if(d) setSelectedRoom(d); setFocus({x:a.targetX,z:a.targetZ}); };
  const pickRoom=(d:Dept)=>{ setSelectedRoom(d); setSelectedWs(null); setFocus({x:d.x,z:d.z}); };
  const pickWs=(w:WS)=>{ setSelectedWs(w); const d=DEPARTMENTS.find(x=>x.name===w.room); if(d){ setSelectedRoom(d); setFocus({x:w.x,z:w.z}); } };

  return (
    <div className="min-h-screen bg-[#060709] text-[#f1f5f9] flex flex-col select-none" style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="border-b border-white/10 bg-[#0b0d11] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5e6ad2] animate-pulse" />
          <span className="font-bold text-[13px] tracking-tight">PT. INDO JAYA GRAM <span className="text-slate-400 font-normal">· Mission Control — Isometric 3D Office</span></span>
          <span className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">{online}/7 Online</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{setFocus(null);setTopView(v=>!v);}} className="text-[11px] px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5 hover:border-[#5e6ad2]">{topView?'Iso View':'Top View'}</button>
          <button onClick={()=>setFocus({x:1.5,z:-3.8})} className="text-[11px] px-2.5 py-1.5 rounded-md border border-[#5e6ad2]/50 bg-[#5e6ad2]/15 hover:bg-[#5e6ad2]/25">Command Center</button>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari karyawan…" className="text-xs bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 w-40 outline-none focus:border-[#5e6ad2]" />
          <span className="text-xs font-mono text-slate-300">{time||'--:--:--'} WIB</span>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[228px_1fr_296px] min-h-[calc(100vh-49px-30px)]">
        <aside className="border-r border-white/10 bg-[#0b0d11] p-2.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-79px)]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Agents — klik untuk fokus</p>
          {filtered.map(a=>(
            <div key={a.id} onClick={()=>pickAgent(a)} className={'p-2 rounded-lg border cursor-pointer transition '+(selected.id===a.id?'border-[#5e6ad2] bg-[#5e6ad2]/10':'border-white/10 bg-white/[0.02] hover:border-white/25')}>
              <div className="flex items-center gap-2">
                <span className="text-base">{a.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold truncate">{a.name} <span className="font-normal text-slate-400">· {a.role}</span></div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{a.isMoving?'Walking':a.status} · {a.dept}</div>
                </div>
                <span className="w-2 h-2 rounded-full" style={{background:a.status==='Online'?'#10b981':a.status==='Busy'?'#f59e0b':a.status==='Meeting'?'#5e6ad2':'#94a3b8'}} />
              </div>
            </div>
          ))}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pt-2">Rooms — klik untuk fokus</p>
          <button onClick={()=>{setSelectedRoom(null);setFocus(null);}} className="w-full text-left text-[11px] px-2 py-1.5 rounded-md border border-white/10 bg-white/[0.02] hover:border-[#5e6ad2]">Seluruh Gedung</button>
          {DEPARTMENTS.map(d=>(
            <button key={d.id} onClick={()=>pickRoom(d)} className={'w-full text-left text-[11px] px-2 py-1.5 rounded-md border transition '+(selectedRoom?.id===d.id?'border-[#5e6ad2] bg-[#5e6ad2]/10':'border-white/10 bg-white/[0.02] hover:border-white/25')}>
              {d.name}
              <span className="block text-[10px] text-slate-500 font-mono">{agents.filter(a=>a.dept===d.name).length} orang di dalam</span>
            </button>
          ))}
        </aside>
        <main className="bg-[#060709] p-2.5 flex items-center justify-center min-h-[560px]">
          <div className="relative rounded-xl border border-white/10 overflow-hidden w-full h-full min-h-[620px]" style={{background:'#07090d'}}>
            {mounted ? (
              <Canvas shadows camera={{position:[0,21,13.5], fov:34}} dpr={[1,2]}>
                <Scene agents={agents} selectedId={selected.id} selectedRoomId={selectedRoom?.id||null} selectedWsId={selectedWs?.id||null} focus={focus} topView={topView} onAgent={pickAgent} onRoom={pickRoom} onWs={pickWs} />
              </Canvas>
            ) : (<div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">Memuat Mission Control 3D…</div>)}
            <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/75 border border-white/10 rounded px-2 py-1 pointer-events-none">Drag: putar · Scroll: zoom · Klik agen / workstation / ruangan</div>
            <div className="absolute bottom-2 left-2 right-2 text-[11px] font-mono bg-black/75 border border-white/10 rounded px-2.5 py-1.5 truncate pointer-events-none">
              {selectedWs ? (<span>{selectedWs.id} · {selectedWs.room} · {selectedWs.on?'Online':'Offline'}</span>)
              : (<span>{selected.avatar} <b style={{color:selected.color}}>{selected.name}</b> ({selected.role}) · {selected.isMoving?'Walking -> ':''}{selected.status} · {selected.dept} · {selected.task}</span>)}
            </div>
          </div>
        </main>
        <aside className="border-l border-white/10 bg-[#0b0d11] p-2.5 flex flex-col text-xs font-mono max-h-[calc(100vh-79px)]">
          <div className="bg-[#060709] border border-white/10 rounded-lg p-2.5 text-[11px]">
            <div className="font-sans font-bold text-xs">{selected.avatar} {selected.name} — {selected.role}</div>
            <div className="text-slate-400 mt-1">Status: {selected.isMoving?'Walking':selected.status} {selected.sitting&&!selected.isMoving?'· duduk':'· berdiri'}</div>
            <div className="text-slate-200 mt-0.5">Tugas: {selected.task}</div>
            <div className="text-slate-400 mt-0.5">Lokasi: {selected.dept}</div>
            {selectedRoom && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{selectedRoom.name}</div>
                <div className="text-slate-400 mt-1">{roomAgents.length} orang di dalam: {roomAgents.map(a=>a.name).join(', ')||'—'}</div>
              </div>
            )}
            {selectedWs && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{selectedWs.id}</div>
                <div className="text-slate-400 mt-1">Ruang: {selectedWs.room} · Status: {selectedWs.on?'Online':'Offline'}</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-bold text-emerald-300 uppercase tracking-widest text-[10px]">Live Activity</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex-1 bg-[#060709] border border-white/10 rounded-lg p-2.5 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed min-h-[200px]">
            {logs.map((l,i)=>(<div key={i} className="text-slate-300 border-b border-white/5 pb-1">{l}</div>))}
          </div>
        </aside>
      </div>
      <footer className="h-[30px] border-t border-white/10 bg-[#0b0d11] px-4 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
        <span>PT. Indo Jaya Gram · Isometric Mission Control · 11 zona · 12 workstation · 7 agen</span>
        <span>Zero Data Leak · <span className="text-emerald-300">BUILD OK</span></span>
      </footer>
    </div>
  );
}
