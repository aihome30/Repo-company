import Link from 'next/link';

const services = [
  {
    title: 'Web Development',
    description: 'Modern, responsive websites built with latest technologies.',
    icon: '🌐',
  },
  {
    title: 'Backend Services',
    description: 'Scalable APIs and server solutions for your applications.',
    icon: '⚙️',
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'Deployment, monitoring, and infrastructure optimization.',
    icon: '🚀',
  },
  {
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platforms for your online business.',
    icon: '🛒',
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications.',
    icon: '📱',
  },
  {
    title: 'Consulting',
    description: 'Technology strategy and digital transformation consulting.',
    icon: '💡',
  },
];

export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">Our Services</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            We offer comprehensive digital solutions tailored to your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="heading-sm mb-2">{service.title}</h3>
              <p className="text-muted mb-4">{service.description}</p>
              <Link href="/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
