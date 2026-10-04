'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ServerMetric {
  id: string;
  type: string;
  name: string;
  cpu: string;
  memory: string;
}

export default function DatacenterMonitor() {
  const [data, setData] = useState<any>(() => {
    // Initial state from localStorage for sub-10ms instant UI load
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('dc_metrics_cache');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return { datacenterStatus: 'OPTIMAL', totalServers: 0, servers: [] };
  });
  
  const [loading, setLoading] = useState(!data?.servers?.length);

  const fetchMetrics = () => {
    fetch('/api/ingest-metrics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dc_metrics_cache', JSON.stringify(d));
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Datacenter Fleet Telemetry</h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400">Instant Client-Cached Telemetry (Sub-10ms UI Load).</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-lg">
              {data?.totalServers || 0} Nodes / VMs Active
            </span>
            <Link href="/" className="text-xs text-slate-400 hover:text-white px-3 py-2 border border-slate-800 rounded-lg hover:border-slate-700 transition">
              ← Home
            </Link>
          </div>
        </div>

        {/* Servers Grid */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Live Hardware & Container Health</h2>
          
          {loading && !data?.servers?.length ? (
            <div className="p-12 text-center text-slate-500 font-mono">Synchronizing telemetry...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.servers?.map((s: ServerMetric, idx: number) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold text-cyan-400">{s.name}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] uppercase font-semibold rounded">
                      {s.type}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg">
                      <span className="text-slate-400">CPU Usage</span>
                      <span className="font-mono font-bold text-white">{s.cpu}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg">
                      <span className="text-slate-400">Memory Usage</span>
                      <span className="font-mono font-bold text-emerald-400">{s.memory}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
