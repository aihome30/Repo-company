'use client';
import React, { useState } from 'react';

interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

const MOCK_DATA: AttendanceRecord[] = [
  { id: 1, name: 'SATORU', date: '2026-10-09', checkIn: '08:30:15', checkOut: '17:05:22', status: 'Hadir' },
  { id: 2, name: 'KONAN', date: '2026-10-09', checkIn: '08:45:00', checkOut: '17:00:10', status: 'Hadir' },
  { id: 3, name: 'ITACHI', date: '2026-10-09', checkIn: '09:00:00', checkOut: '18:10:45', status: 'Hadir' },
  { id: 4, name: 'KISAME', date: '2026-10-09', checkIn: '08:15:20', checkOut: '17:30:00', status: 'Hadir' },
  { id: 5, name: 'SASORI', date: '2026-10-09', checkIn: '08:55:12', checkOut: '17:15:33', status: 'Hadir' },
];

export default function AttendanceReportPage() {
  const [data] = useState<AttendanceRecord[]>(MOCK_DATA);

  const downloadExcel = () => {
    // Simulasi download Excel via skrip atau direct file
    window.location.href = '/reports/Laporan_Absensi.xlsx';
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Laporan Absensi Karyawan</h1>
            <p className="text-sm text-slate-400">PT. Indo Jaya Gram — Data Kehadiran Real-time & Tercatat</p>
          </div>
          <button
            onClick={downloadExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download Laporan (.xlsx)
          </button>
        </div>

        {/* Tabel Rekapitulasi Absensi */}
        <div className="bg-[#0b0e14] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Rekapitulasi Harian</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/[0.01]">
                  <th className="p-4">Nama Agen</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Check-In</th>
                  <th className="p-4">Check-Out</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-medium text-white">{row.name}</td>
                    <td className="p-4 text-slate-400">{row.date}</td>
                    <td className="p-4 text-emerald-400 font-mono">{row.checkIn}</td>
                    <td className="p-4 text-rose-400 font-mono">{row.checkOut}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
