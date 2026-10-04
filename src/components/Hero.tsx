import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 py-28 lg:py-36 border-b border-slate-900">
      {/* Background Glow Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[140px] pointer-events-none rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold mb-8 shadow-inner">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>PT. Indo Jaya Gram — Premier Digital Agency & SaaS Partner</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Membangun Masa Depan <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Digital & AI Enterprise
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Kami menggabungkan rekayasa perangkat lunak tingkat lanjut (Java, Go, Rust, Next.js) dengan otomatisasi agen AI cerdas untuk mempercepat pertumbuhan bisnis UMKM dan Startup kelas dunia.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl hover:opacity-95 transition shadow-lg shadow-cyan-500/20 text-center">
            Konsultasi Proyek Gratis
          </Link>
          <Link href="/portfolio" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-semibold rounded-xl hover:bg-slate-800/80 transition text-center">
            Lihat Portofolio Klien
          </Link>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-900 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
            <div className="text-xs text-slate-500 uppercase mt-1 tracking-wider">Enterprise Security</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">99.9%</div>
            <div className="text-xs text-slate-500 uppercase mt-1 tracking-wider">Uptime SLA</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">3-Agent</div>
            <div className="text-xs text-slate-500 uppercase mt-1 tracking-wider">Autonomous AI</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Zero</div>
            <div className="text-xs text-slate-500 uppercase mt-1 tracking-wider">Data Leaks (DLP)</div>
          </div>
        </div>

      </div>
    </section>
  );
}
