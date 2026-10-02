import Link from 'next/link';

const caseStudies = [
  {
    id: 1,
    title: 'E-Commerce Platform for Fashion Startup',
    description: 'Built a complete e-commerce platform with inventory management.',
    category: 'E-commerce',
    image: 'Case Study 1',
  },
  {
    id: 2,
    title: 'SaaS Dashboard for Analytics',
    description: 'Developed a real-time analytics dashboard for B2B clients.',
    category: 'Web App',
    image: 'Case Study 2',
  },
  {
    id: 3,
    title: 'Mobile App for Logistics',
    description: 'Cross-platform mobile app for tracking deliveries.',
    category: 'Mobile',
    image: 'Case Study 3',
  },
  {
    id: 4,
    title: 'API Microservices Architecture',
    description: 'Designed scalable microservices for enterprise client.',
    category: 'Backend',
    image: 'Case Study 4',
  },
  {
    id: 5,
    title: 'Cloud Migration Project',
    description: 'Migrated on-premise infrastructure to cloud with zero downtime.',
    category: 'DevOps',
    image: 'Case Study 5',
  },
  {
    id: 6,
    title: 'Website Redesign & Performance',
    description: 'Improved website performance from 45 to 95 Lighthouse score.',
    category: 'Web Dev',
    image: 'Case Study 6',
  },
];

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-blue-50">
        <div className="container">
          <h1 className="heading-md mb-4">Our Portfolio</h1>
          <p className="text-xl text-muted max-w-2xl">
            Check out some of our recent projects and case studies.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                  {study.image}
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium mb-3">
                    {study.category}
                  </span>
                  <h3 className="heading-sm mb-2">{study.title}</h3>
                  <p className="text-muted">{study.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blue-600 text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="heading-md text-white mb-4">
            Your Next Success Story?
          </h2>
          <p className="text-blue-100 mb-6">
            Let's work together to build something amazing.
          </p>
          <Link href="/contact" className="btn bg-slate-950 text-white text-blue-600 hover:bg-blue-50">
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}
