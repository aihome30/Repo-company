import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-24 sm:py-32">
      {/* Glassmorphism 2.0 — glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 max-w-5xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-sm font-medium mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] ">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Creative Tech & Modern UI/UX 2026 — Glassmorphism 2.0
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Transforming Ideas Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400">
            Intelligent Software
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Kami membangun solusi digital tingkat lanjut, arsitektur cloud tangguh, dan sistem cerdas berbasis AI untuk mengakselerasi pertumbuhan bisnis UMKM dan startup Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-600/30 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 group flex items-center justify-center gap-2"
          >
            Mulai Konsultasi Gratis
            <svg className="w-5 h-5 transition-transform duration-500 ease-in-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold backdrop-blur-md transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 flex justify-center"
          >
            Jelajahi Layanan
          </Link>
        </div>

        {/* Micro-interaction stats — glass cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-20 pt-12 border-t border-slate-800/60 text-left">
          {[
            { value: '99.9%', label: 'Uptime Infrastructure', color: 'text-cyan-400' },
            { value: '95+', label: 'Lighthouse Score', color: 'text-blue-400' },
            { value: '100%', label: 'QA Sign-Off Passed', color: 'text-indigo-400' },
            { value: '24/7', label: 'Autonomous Agents', color: 'text-emerald-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-500 ease-in-out cursor-default"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
