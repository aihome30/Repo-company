'use client';

import Link from 'next/link';
import servicesData from '@/content/services.json';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="section bg-slate-900 border-b border-slate-800">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Layanan Kami</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Solusi digital profesional dan terjangkau untuk mengakselerasi pertumbuhan bisnis Anda di Indonesia.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                      {service.icon}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {service.priceRange}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{service.description}</p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Konsultasikan Kebutuhan &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
