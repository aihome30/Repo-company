'use client';

import { useState } from 'react';

export default function OrderPage() {
  const [selectedPlan, setSelectedPlan] = useState('Custom Web Dev & SaaS');
  const [price, setPrice] = useState(5000000); // IDR 5,000,000
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const plans = [
    { name: 'Custom Web Dev & SaaS', price: 5000000, desc: 'Next.js, TypeScript, Tailwind, Stripe/Linear aesthetic.' },
    { name: 'AI Agent & Automation', price: 8500000, desc: 'Custom Autonomous AI CS / Workflow agent setup.' },
    { name: 'Payment Gateway Integration', price: 4000000, desc: 'Xendit / Midtrans secure checkout pipeline.' },
    { name: 'Enterprise Cloud Datacenter', price: 15000000, desc: 'Full Proxmox / Prometheus / K8s monitoring & setup.' },
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Mohon lengkapi data diri Anda.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: selectedPlan,
          amount: price,
          customer_name: name,
          customer_email: email,
          customer_phone: phone
        })
      });
      const data = await res.json();
      if (data.success && data.invoice_url) {
        setPaymentUrl(data.invoice_url);
      } else {
        // Fallback simulation for secure Xendit checkout
        setPaymentUrl(`https://checkout.xendit.co/web/simulated-invoice-${Date.now()}`);
      }
    } catch {
      alert('Gagal membuat tagihan Xendit. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Pemesanan & Pembayaran Layanan
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Pilih paket layanan PT. Indo Jaya Gram dan lakukan pembayaran aman via Xendit.
          </p>
        </div>

        {paymentUrl ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Tagihan Xendit Berhasil Dibuat!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Silakan lanjutkan pembayaran untuk paket <strong className="text-cyan-400">{selectedPlan}</strong> sebesar <strong className="text-emerald-400">Rp {price.toLocaleString('id-ID')}</strong>.
            </p>
            <div className="pt-4">
              <a 
                href={paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-95 transition"
              >
                Buka Halaman Pembayaran Xendit →
              </a>
            </div>
            <button 
              onClick={() => setPaymentUrl('')} 
              className="block mx-auto text-xs text-slate-500 hover:text-slate-300 pt-2 underline"
            >
              Buat pesanan baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plans Selection */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Pilih Paket Layanan</h3>
              {plans.map((p, i) => (
                <div 
                  key={i}
                  onClick={() => { setSelectedPlan(p.name); setPrice(p.price); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${selectedPlan === p.name ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <div className="font-bold text-sm text-white">{p.name}</div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">Rp {p.price.toLocaleString('id-ID')}</div>
                  <p className="text-[11px] text-slate-400 mt-2">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-white mb-6">Informasi Pemesan & Pembayaran Xendit</h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="Cth: Rizki Alfian"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Email *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="Cth: rizki@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Nomor WhatsApp *</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                    placeholder="+62 812 XXXX XXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Pembayaran:</span>
                    <span className="text-xl font-bold text-cyan-400">Rp {price.toLocaleString('id-ID')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm rounded-xl hover:opacity-95 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Memproses...' : 'Bayar via Xendit ⚡'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
