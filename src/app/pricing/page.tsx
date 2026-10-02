'use client';

import pricingData from '@/content/pricing.json';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-blue-50">
        <div className="container">
          <h1 className="heading-md text-center mb-4">Our Pricing</h1>
          <p className="text-xl text-muted text-center max-w-2xl mx-auto">
            Flexible packages tailored to your business needs. All prices are for project-based work.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingData.packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`rounded-lg border-2 p-8 transition ${
                  idx === 1
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-600'
                }`}
              >
                {idx === 1 && (
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold mb-4">
                    POPULAR
                  </div>
                )}

                <h3 className="heading-sm mb-2">{pkg.name}</h3>
                <p className="text-muted mb-4 text-sm">{pkg.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">
                    ${pkg.price.toLocaleString()}
                  </span>
                  <span className="text-slate-400 ml-2">per {pkg.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <span className="text-blue-600 mr-3 font-bold">✓</span>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`btn w-full text-center ${
                    idx === 1
                      ? 'btn-primary'
                      : 'bg-slate-900 text-slate-100 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-blue-50">
        <div className="container max-w-3xl">
          <h2 className="heading-md text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I customize the packages?",
                a: "Yes! All our packages are flexible. Contact us to discuss your specific needs."
              },
              {
                q: "Do you offer payment plans?",
                a: "Yes, we offer flexible payment terms. Discuss with our team to arrange a plan."
              },
              {
                q: "What's included in support?",
                a: "Support includes bug fixes, minor updates, and technical guidance during the support period."
              },
              {
                q: "Can I upgrade my package?",
                a: "Absolutely! You can upgrade at any time with prorated pricing."
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-950 text-white p-6 rounded-lg">
                <h4 className="font-bold text-slate-100 mb-2">{faq.q}</h4>
                <p className="text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
