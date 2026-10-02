'use client';

import pricingData from '@/content/pricing.json';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="section bg-slate-900 border-b border-slate-800">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Paket Harga & Layanan</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Harga transparan, terjangkau untuk UMKM dan Startup Indonesia, dengan kualitas berstandar global.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingData.packages.map((pkg, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 shadow-xl"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{pkg.name}</h3>
                  <div className="text-3xl font-extrabold text-blue-400 mb-4">
                    {pkg.price} <span className="text-sm font-normal text-slate-400">/ {pkg.period}</span>
                  </div>
                  <p className="text-slate-300 mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-slate-300 text-sm">
                        <span className="text-blue-400 font-bold">&#10003;</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center transition-colors shadow-lg shadow-blue-600/30 block"
                >
                  Pilih Paket
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
