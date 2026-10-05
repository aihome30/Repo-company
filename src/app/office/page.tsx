'use client';

import { useState } from 'react';

interface TaskItem {
  time: string;
  task: string;
  status: 'done' | 'in_progress' | 'not_started';
}

export default function RCBDeploymentDashboard() {
  const [etlTasks] = useState<TaskItem[]>([
    { time: '22.00 - 22.10', task: 'Update koneksi ODBC (odbc.ini)', status: 'done' },
    { time: '22.10 - 22.15', task: 'Create View INCOMINGTRX_AVERAGE_SUMM_ETL', status: 'done' },
    { time: '22.15 - 22.20', task: 'Create SP_FAILED_PROCESS', status: 'done' },
    { time: '22.20 - 22.25', task: 'Create SP_START_PROCESS', status: 'done' },
    { time: '22.25 - 22.30', task: 'Create SP_SUCCESS_PROCESS', status: 'done' },
    { time: '22.30 - 22.40', task: 'Login DataStage Production', status: 'done' },
    { time: '22.40 - 22.50', task: 'Import Object ETL', status: 'in_progress' },
    { time: '22.50 - 23.00', task: 'Setting Parameter Production', status: 'in_progress' },
    { time: '23.00 - 23.10', task: 'Compile & Test Running Job', status: 'in_progress' },
    { time: '23.10 - 23.20', task: 'Create Scheduler', status: 'in_progress' },
  ]);

  const [backendTasks] = useState<TaskItem[]>([
    { time: '22.00 - 22.22', task: 'Create Table DWH', status: 'in_progress' },
    { time: '22.22 - 22.40', task: 'Create Directory & Configuration', status: 'in_progress' },
    { time: '22.40 - 22.48', task: 'Setup Security & Permission', status: 'in_progress' },
    { time: '22.48 - 22.52', task: 'Create & Start Service', status: 'in_progress' },
    { time: '22.52 - 22.54', task: 'Post Deployment Verification', status: 'in_progress' },
  ]);

  const [tvtTasks] = useState<TaskItem[]>([
    { time: 'TVT-1', task: 'Data CFMAST, DDMAST dan JHFXDT berhasil insert ke table staging ETL FRMS', status: 'not_started' },
    { time: 'TVT-2', task: 'Berhasil Mengirimkan data transaksi ke FRMS dan SPLUNK', status: 'not_started' },
  ]);

  const [ptrTasks] = useState<TaskItem[]>([
    { time: 'PTR-1', task: 'FRMS: Transaksi berhasil masuk ke FRMS sesuai dengan kebutuhan User', status: 'not_started' },
    { time: 'PTR-2', task: 'SPLUNK: Transaksi berhasil masuk ke FRMS sesuai dengan kebutuhan User', status: 'not_started' },
  ]);

  const renderStatusIcon = (status: 'done' | 'in_progress' | 'not_started') => {
    if (status === 'done') return <span className="text-emerald-400 font-bold">✅</span>;
    if (status === 'in_progress') return <span className="text-amber-400 font-bold">🟨</span>;
    return <span className="text-slate-500 font-bold">⬜</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono font-bold">
                  ID RCB: RCB-2026-00112
                </span>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-mono font-bold">
                  Apps: FRMS
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                Perluasan Channel FRMS Incoming Transaction
              </h1>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-2xl text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">DH On Duty</div>
              <div className="text-sm font-bold text-cyan-300">Rio Yudhia Permana</div>
            </div>
          </div>

          {/* Fixing & Impact Feature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-3">Fixing dan Impact Feature</h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                <li>Penurunan Data Warehouse pada tabel CFMAST, DDMAST dan JHFXDT ke ETL DB FRMS.</li>
                <li>Pengembangan sistem consumer dan enrichment incoming transaction.</li>
                <li>Pembuatan file CSV pendukung/master.</li>
                <li>Penambahan Server FRMS Issuing.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-3">Summary Feature</h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  Saat ini transaksi incoming belum dikirim ke FRMS. Dengan perkembangan deteksi fraud diperlukan data transaksi incoming untuk analisis anomali yang lebih komprehensif.
                </p>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-white block">Problem Fixing:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    <li>Pembuatan ETL untuk penurunan data DDMAST, CFMAST, JHFXDT ke ETL DB FRMS.</li>
                    <li>Pengembangan sistem consumer untuk consume data DDETRN2/DDETR24 dari KAFKA & enrichment membentuk file RBTRAN ke LANDINGZONE FRMS serta SPLUNK via API.</li>
                    <li>Pembuatan file CSV sebagai master data.</li>
                    <li>Penambahan server FRMS Issuing untuk incoming transaction.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Deployment Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ETL Datastage */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">ETL Datastage Progress</h2>
                <span className="text-xs font-mono text-slate-400">Production Deploy</span>
              </div>
              <div className="space-y-2.5">
                {etlTasks.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      {renderStatusIcon(t.status)}
                      <span className="text-slate-300 font-medium">{t.task}</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backend Service Incoming FRMS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Backend Service Incoming FRMS</h2>
                <span className="text-xs font-mono text-slate-400">Server Deploy</span>
              </div>
              <div className="space-y-2.5">
                {backendTasks.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      {renderStatusIcon(t.status)}
                      <span className="text-slate-300 font-medium">{t.task}</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* TVT & PTR Verification Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TVT */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">TVT (Technical Verification Test)</h2>
            </div>
            <div className="space-y-2.5">
              {tvtTasks.map((t, i) => (
                <div key={i} className="flex items-start gap-3 text-xs p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                  {renderStatusIcon(t.status)}
                  <span className="text-slate-300 leading-relaxed">{t.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PTR */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">PTR (Production Trial Run)</h2>
            </div>
            <div className="space-y-2.5">
              {ptrTasks.map((t, i) => (
                <div key={i} className="flex items-start gap-3 text-xs p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                  {renderStatusIcon(t.status)}
                  <span className="text-slate-300 leading-relaxed">{t.task}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Legend & Closing */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold"><span className="text-emerald-400">✅</span> Done</span>
            <span className="flex items-center gap-1.5 font-semibold"><span className="text-amber-400">🟨</span> In progress</span>
            <span className="flex items-center gap-1.5 font-semibold"><span className="text-slate-500">⬜</span> Not Started</span>
          </div>
          <div className="text-xs text-slate-300 italic">
            Demikian kami sampaikan, Terima kasih.
          </div>
        </div>

      </div>
    </div>
  );
}
