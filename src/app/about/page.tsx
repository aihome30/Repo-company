import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-blue-600 text-white">
        <div className="container max-w-3xl">
          <h1 className="heading-md text-white mb-6">About wspend</h1>
          <p className="text-xl text-blue-100">
            We&apos;re a team of passionate developers and designers dedicated to helping businesses
            succeed through technology and innovation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container max-w-3xl">
          <h2 className="heading-md mb-6">Our Story</h2>
          <p className="text-slate-400 mb-4">
            wspend was founded with a simple mission: to make world-class web development
            and digital solutions accessible to businesses of all sizes.
          </p>
          <p className="text-slate-400 mb-4">
            Starting as a small team of developers in Jakarta, we&apos;ve grown to become a trusted
            partner for startups, UMKMs, and enterprises across Indonesia. Our passion for
            technology and commitment to quality has helped hundreds of businesses transform
            their digital presence.
          </p>
          <p className="text-slate-400">
            Today, we continue to innovate and deliver cutting-edge solutions that drive real
            business results for our clients.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-slate-900 border-b border-slate-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-slate-400">Projects Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-slate-400">Happy Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-slate-400">Team Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <p className="text-slate-400">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="heading-sm mb-4">Our Mission</h3>
              <p className="text-slate-400">
                To empower businesses with cutting-edge technology solutions that drive growth,
                efficiency, and innovation.
              </p>
            </div>
            <div>
              <h3 className="heading-sm mb-4">Our Vision</h3>
              <p className="text-slate-400">
                To be the leading digital solutions provider in Southeast Asia, known for
                excellence, innovation, and customer success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blue-600 text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="heading-md text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-blue-100 mb-6">
            Let&apos;s discuss how we can help you achieve your digital goals.
          </p>
          <Link href="/contact" className="btn bg-slate-950 text-white text-blue-600 hover:bg-slate-900 border-b border-slate-800">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
