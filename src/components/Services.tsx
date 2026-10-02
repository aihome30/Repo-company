import Link from 'next/link';

const services = [
  {
    title: 'Web Development',
    description: 'Modern, ultra-responsive websites built with Next.js 14, Tailwind CSS, and optimized for maximum SEO & performance.',
    icon: '🌐',
    tag: 'Popular',
    color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30',
  },
  {
    title: 'Backend Services',
    description: 'Scalable APIs, secure microservices, and robust database architecture using Go, Node.js, and PostgreSQL.',
    icon: '⚙️',
    tag: 'Robust',
    color: 'from-indigo-500/10 to-cyan-500/10 border-indigo-500/30',
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'Kubernetes clusters, Docker containerization, CI/CD pipelines, and enterprise-grade security hardening.',
    icon: '🚀',
    tag: 'Enterprise',
    color: 'from-cyan-500/10 to-emerald-500/10 border-cyan-500/30',
  },
  {
    title: 'AI Agent Systems',
    description: 'Autonomous multi-agent business automation frameworks tailored for finance, HR, and technical workflows.',
    icon: '🤖',
    tag: 'Innovative',
    color: 'from-purple-500/15 to-blue-500/15 border-purple-500/30',
  },
];

export default function Services() {
  return (
    <section className="section bg-slate-950 text-white py-24 relative overflow-hidden">
      {/* Decorative glass elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3 block animate-bounce">
            Layanan Unggulan
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Solusi Digital Komprehensif
          </h2>
          <p className="text-slate-400 text-lg">
            Dirancang dengan standar teknis tertinggi dan <span className="text-cyan-400 font-semibold">Glassmorphism 2.0</span> untuk memastikan efisiensi, keamanan, dan skalabilitas bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group p-8 rounded-3xl bg-gradient-to-br ${service.color} border backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-4xl p-3 bg-slate-900/60 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">{service.description}</p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-cyan-400 transition-colors group/link"
              >
                <span>Konsultasi Proyek</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
