'use client';

import Link from 'next/link';
import servicesData from '@/content/services.json';

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-blue-50">
        <div className="container">
          <h1 className="heading-md mb-4">Our Services</h1>
          <p className="text-xl text-muted max-w-2xl">
            Comprehensive digital solutions for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h2 className="heading-sm mb-3">{service.title}</h2>
                <p className="text-muted mb-4">{service.description}</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="text-blue-600 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-blue-600">
                    {service.pricing}
                  </span>
                  <Link href="/contact" className="btn btn-primary">
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
