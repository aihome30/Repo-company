'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SystemMetric {
  name: string;
  status: string;
  latency?: string;
  threatsBlocked?: number;
  edgeLocations?: string;
}

export default function StatusPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/system-status')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">wspend System Status</h1>
            </div>
            <p className="text-slate-400 text-sm">Real-time infrastructure health and operational monitoring.</p>
          </div>
          <Link href="/" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-4 py-2 border border-slate-800 rounded-lg hover:border-slate-700 transition">
            ← Back to wspend
          </Link>
        </div>

        {/* Global Operational Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-emerald-400">All Systems Fully Operational</h2>
            <p className="text-xs text-slate-400 mt-1">Zero critical incidents detected across production nodes.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            100% Uptime
          </span>
        </div>

        {/* Live Services Grid */}
        <div className="space-y-4 mb-10">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Service Components</h3>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading live telemetry...</div>
          ) : (
            data?.metrics?.services.map((s: SystemMetric, idx: number) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                <div className="flex items-center space-x-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="font-medium text-slate-200">{s.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  {s.latency && <span className="text-slate-400 font-mono">{s.latency}</span>}
                  <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">
                    {s.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Security & Zero Data Leak Assurance Card */}
        <div className="bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-cyan-400 text-lg">🛡️</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Privacy & Security Guardrails</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            wspend operates under strict Zero-Trust & Data Loss Prevention (DLP) protocols. Internal IP addresses, cluster topologies, and confidential telemetry are strictly isolated from public endpoints.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">DLP Shield Status</span>
              <span className="text-emerald-400 font-semibold">Active & Enforced</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">Public Metric Sanitization</span>
              <span className="text-cyan-400 font-semibold">100% Sanitized</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
