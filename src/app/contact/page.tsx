import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="section bg-slate-900 border-b border-slate-800">
        <div className="container">
          <h1 className="heading-md mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Have a project in mind? Let&apos;s talk about how we can help.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h3 className="heading-sm mb-2">Email</h3>
                <p className="text-slate-400">
                  <a
                    href="mailto:hello@pt-wspend.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    hello@pt-wspend.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="heading-sm mb-2">Phone</h3>
                <p className="text-slate-400">
                  <a
                    href="tel:+6281234567890"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    +62 812 3456 7890
                  </a>
                </p>
              </div>

              <div>
                <h3 className="heading-sm mb-2">Office Hours</h3>
                <p className="text-slate-400">
                  Monday - Friday<br />
                  09:00 AM - 18:00 WIB
                </p>
              </div>

              <div>
                <h3 className="heading-sm mb-2">Social Media</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Twitter
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    LinkedIn
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
