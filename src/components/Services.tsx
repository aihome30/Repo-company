import Link from 'next/link';

export default function Services() {
  const services = [
    {
      title: 'Custom Web & SaaS Development',
      description: 'High-performance web applications built with Next.js 14, TypeScript, and robust backend architectures (Java, Go, NestJS).',
      tag: 'Core Engineering',
      icon: '⚡',
      span: 'col-span-1 md:col-span-2'
    },
    {
      title: 'Autonomous AI Agents',
      description: 'Custom multi-agent workflows for automated financial auditing, HR management, and 24/7 SRE uptime monitoring.',
      tag: 'AI & Automation',
      icon: '🤖',
      span: 'col-span-1'
    },
    {
      title: 'Payment Gateway Integration',
      description: 'Secure, PCI-DSS compliant payment processing integrations with Xendit, Midtrans, and global financial rails.',
      tag: 'Fintech & Security',
      icon: '💳',
      span: 'col-span-1'
    },
    {
      title: 'Cloud Infrastructure & DevOps',
      description: 'Zero-trust Kubernetes clusters, Proxmox hypervisors, and automated Data Loss Prevention (DLP) guardrails.',
      tag: 'Infrastructure',
      icon: '🛡️',
      span: 'col-span-1 md:col-span-2'
    }
  ];

  return (
    <section className="bg-slate-950 py-24 border-b border-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3 block">Layanan Profesional</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Solusi Digital Komprehensif untuk Skala Enterprise
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Dirancang khusus untuk memenuhi standar ketat perusahaan modern dengan fokus pada kecepatan, keamanan, dan keandalan.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className={`${s.span} bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition group relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition"></div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">{s.icon}</span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
                  {s.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.description}</p>

              <Link href="/contact" className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition">
                <span>Pelajari Lebih Lanjut</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
