import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-24 sm:py-32">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 max-w-5xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm font-medium mb-8 backdrop-blur-md animate-pulse">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          PT. Rizki AI — World-Class Digital Agency & AI Solutions
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Transforming Ideas Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Intelligent Software</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Kami membangun solusi digital tingkat lanjut, arsitektur cloud tangguh, dan sistem cerdas berbasis AI untuk mengakselerasi pertumbuhan bisnis UMKM dan startup Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105"
          >
            Mulai Konsultasi Gratis
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105"
          >
            Jelajahi Layanan
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-800/80 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-3xl font-bold text-blue-400 mb-1">99.9%</div>
            <div className="text-sm text-slate-400">Uptime Infrastructure</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-3xl font-bold text-indigo-400 mb-1">10k+</div>
            <div className="text-sm text-slate-400">Tested Scenarios</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
            <div className="text-sm text-slate-400">QA Sign-Off Passed</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-3xl font-bold text-emerald-400 mb-1">24/7</div>
            <div className="text-sm text-slate-400">Autonomous Agents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
