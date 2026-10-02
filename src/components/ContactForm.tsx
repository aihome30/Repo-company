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
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          Thank you! Your message has been sent. We'll get back to you soon.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">Phone</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="+62 XXX XXXX XXXX"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Company
          </label>
          <input
            type="text"
            {...register('company')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="Your company"
          />
        </div>
      </div>

      {/* Service */}
      <div>
        <label className="block text-slate-300 font-medium mb-2">
          Service Interest *
        </label>
        <select
          {...register('service')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="">Select a service</option>
          <option value="web-dev">Web Development</option>
          <option value="backend">Backend Services</option>
          <option value="devops">DevOps</option>
          <option value="other">Other</option>
        </select>
        {errors.service && (
          <p className="text-red-600 text-sm mt-1">{errors.service.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-slate-300 font-medium mb-2">
          Message *
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          placeholder="Tell us about your project..."
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Hidden captcha field for validation */}
      <input
        type="hidden"
        {...register('h-captcha-response')}
        value="demo"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
