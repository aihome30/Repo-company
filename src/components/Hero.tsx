import Link from 'next/link';

export default function Hero() {
  return (
    <section className="section bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="heading-lg text-white mb-6">
          Web Development & Digital Solutions
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Professional software development for startups, UMKMs, and enterprises.
          We turn your ideas into scalable digital solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn bg-white text-blue-600 hover:bg-blue-50">
            Get Started
          </Link>
          <Link
            href="/services"
            className="btn border-2 border-white text-white hover:bg-blue-700"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
