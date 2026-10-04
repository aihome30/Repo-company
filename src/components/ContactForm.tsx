'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan. Silakan coba lagi.');
      }

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm font-medium animate-in fade-in">
          ✨ Terima kasih! Pesan Anda telah terkirim. Tim kami akan segera menghubungi Anda.
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            placeholder="Cth: Rizki Alfian"
          />
          {errors.name && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Alamat Email *
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            placeholder="Cth: rizki@company.com"
          />
          {errors.email && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Nomor Telepon / WhatsApp</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            placeholder="+62 812 XXXX XXXX"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Nama Perusahaan / Startup
          </label>
          <input
            type="text"
            {...register('company')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            placeholder="PT. Indo Jaya Gram"
          />
        </div>
      </div>

      {/* Service */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Layanan yang Minati *
        </label>
        <select
          {...register('service')}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
        >
          <option value="" className="bg-slate-950 text-slate-500">Pilih jenis layanan...</option>
          <option value="web-dev" className="bg-slate-950">Custom Web & SaaS Development</option>
          <option value="backend" className="bg-slate-950">Backend & Payment Gateway</option>
          <option value="devops" className="bg-slate-950">DevOps & Datacenter Monitoring</option>
          <option value="other" className="bg-slate-950">Autonomous AI Agents</option>
        </select>
        {errors.service && (
          <p className="text-rose-400 text-xs mt-1.5">{errors.service.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Detail Proyek / Kebutuhan *
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          placeholder="Ceritakan sedikit tentang proyek atau target bisnis Anda..."
        />
        {errors.message && (
          <p className="text-rose-400 text-xs mt-1.5">{errors.message.message}</p>
        )}
      </div>

      {/* Hidden captcha */}
      <input
        type="hidden"
        {...register('h-captcha-response')}
        value="demo"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm rounded-xl hover:opacity-95 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
      >
        {loading ? 'Mengirim Pesan...' : 'Kirim Pesan Konsultasi →'}
      </button>
    </form>
  );
}
