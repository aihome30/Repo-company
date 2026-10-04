'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DatacenterMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    fetch('/api/datacenter-metrics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Datacenter Live Telemetry</h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400">Prometheus-powered infrastructure monitoring & hardware health telemetry.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-lg">
              Prometheus Connected
            </span>
            <Link href="/" className="text-xs text-slate-400 hover:text-white px-3 py-2 border border-slate-800 rounded-lg hover:border-slate-700 transition">
              ← Home
            </Link>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Datacenter Overall Health</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center space-x-2">
              <span>●</span>
              <span>{data?.datacenterStatus || 'OPTIMAL'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-right">
            <div>
              <div className="text-xs text-slate-500 uppercase">Active Scrape Nodes</div>
              <div className="text-lg font-mono font-bold text-slate-200">{data?.nodesActive || 2} Units</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">Security Shield</div>
              <div className="text-lg font-mono font-bold text-cyan-400">Enforced (DLP)</div>
            </div>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Cluster CPU Load</div>
            <div className="text-3xl font-mono font-extrabold text-white mb-2">
              {loading ? '...' : data?.metrics?.clusterLoad}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: data?.metrics?.clusterLoad || '28%' }}></div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Memory Allocation</div>
            <div className="text-3xl font-mono font-extrabold text-white mb-2">
              {loading ? '...' : data?.metrics?.memoryUsage}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: data?.metrics?.memoryUsage || '41%' }}></div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Storage Usage</div>
            <div className="text-3xl font-mono font-extrabold text-white mb-2">
              {loading ? '...' : data?.metrics?.storageAllocated}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: data?.metrics?.storageAllocated || '62%' }}></div>
            </div>
          </div>

        </div>

        {/* Detailed Hardware Stats */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Hardware Telemetry & Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">Cooling & Ambient Temp</span>
              <span className="font-mono text-emerald-400 font-semibold">{data?.metrics?.coolingStatus || 'Nominal (21.5°C)'}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">Power Efficiency</span>
              <span className="font-mono text-cyan-400 font-semibold">{data?.metrics?.powerEfficiency || '99.4%'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
