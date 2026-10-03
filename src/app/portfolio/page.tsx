'use client';

import portfolioData from '@/content/portfolio.json';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="section bg-slate-900 border-b border-slate-800 py-20">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Portofolio & Founder</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Dipimpin oleh Software Engineering lulusan Telkom University dengan pengalaman mendalam di bidang Clean Architecture dan Scalable System Design.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 shadow-xl"
              >
                <div>
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-block mb-4">
                    {item.role}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.tech.map((t, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Kunjungi Website &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
