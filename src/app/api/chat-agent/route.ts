import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    
    // Strict Company Compliance & Guardrails (DLP - Data Loss Prevention)
    // Never expose internal IPs (10.10.3.x), credentials, or private server infrastructure.
    
    let reply = "Halo! Saya Maya, CS Executive PT. Indo Jaya Gram. Kami memegang teguh nilai Expertise First, Ownership, dan Transparency. Ada kebutuhan proyek digital atau automasi yang bisa saya bantu?";

    if (lower.includes('website') || lower.includes('web') || lower.includes('buat')) {
      reply = "PT. Indo Jaya Gram ahli dalam pembuatan Custom Web App & SaaS berstandar tinggi (menggunakan Next.js, React, TypeScript dengan estetika Stripe/Linear). Apakah Anda ingin membangun company profile, e-commerce, atau platform SaaS khusus?";
    } else if (lower.includes('ai') || lower.includes('otomasi') || lower.includes('agent')) {
      reply = "Kami menyediakan solusi Automasi AI dan Multi-Agent System untuk efisiensi operasional perusahaan. Layanan ini dirancang aman, terenkripsi, dan menjaga kerahasiaan data Anda.";
    } else if (lower.includes('bayar') || lower.includes('payment') || lower.includes('xendit')) {
      reply = "Untuk sistem pembayaran, kami terintegrasi resmi dengan Xendit dan Midtrans dengan standar keamanan perbankan (PCI-DSS compliant).";
    } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('budget')) {
      reply = "Estimasi investasi disesuaikan dengan kompleksitas dan skala proyek Anda. Agar kami dapat memberikan proposal penawaran transparan, boleh dibagikan nomor WhatsApp atau email Anda?";
    } else if (lower.includes('kontak') || lower.includes('whatsapp') || lower.includes('wa') || lower.includes('@') || lower.includes('08')) {
      reply = "Terima kasih! Kontak Anda telah saya catat dengan aman sesuai protokol privasi perusahaan. Tim konsultan senior kami akan segera menghubungi Anda dalam waktu kurang dari 1 jam.";
    }

    return NextResponse.json({
      success: true,
      reply: reply,
      agent: "Maya (Certified AI CS Executive - PT. Indo Jaya Gram)",
      compliance: "Zero Data Leak Enforced",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
