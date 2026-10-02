import Link from 'next/link';

export default function CTA() {
  return (
    <section className="section bg-blue-600 text-white">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="heading-md text-white mb-6">
          Ready to Start Your Project?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Get in touch with our team to discuss your requirements and receive a
          personalized proposal.
        </p>
        <Link href="/contact" className="btn bg-white text-blue-600 hover:bg-blue-50 text-lg">
          Contact Us Today
        </Link>
      </div>
    </section>
  );
}
