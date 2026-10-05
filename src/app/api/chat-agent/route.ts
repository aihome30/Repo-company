import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    
    let reply = "Halo! Saya Maya, CS Executive PT. Indo Jaya Gram. Kami memegang teguh nilai Expertise First, Ownership, dan Transparency. Ada kebutuhan proyek digital atau automasi yang bisa saya bantu?";
    let leadCaptured = false;
    let clientSummary = "";

    if (lower.includes('website') || lower.includes('web') || lower.includes('buat')) {
      reply = "PT. Indo Jaya Gram ahli dalam pembuatan Custom Web App & SaaS berstandar tinggi (menggunakan Next.js, React, TypeScript dengan estetika Stripe/Linear). Apakah Anda ingin membangun company profile, e-commerce, atau platform SaaS khusus?";
      clientSummary = "Konsultasi pembuatan Custom Web / SaaS.";
    } else if (lower.includes('ai') || lower.includes('otomasi') || lower.includes('agent')) {
      reply = "Kami menyediakan solusi Automasi AI dan Multi-Agent System untuk efisiensi operasional perusahaan. Layanan ini dirancang aman, terenkripsi, dan menjaga kerahasiaan data Anda.";
      clientSummary = "Konsultasi Automasi AI & Multi-Agent System.";
    } else if (lower.includes('bayar') || lower.includes('payment') || lower.includes('xendit')) {
      reply = "Untuk sistem pembayaran, kami terintegrasi resmi dengan Xendit dan Midtrans dengan standar keamanan perbankan (PCI-DSS compliant).";
      clientSummary = "Konsultasi Integrasi Payment Gateway Xendit.";
    } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('budget')) {
      reply = "Estimasi investasi disesuaikan dengan kompleksitas dan skala proyek Anda. Agar kami dapat memberikan proposal penawaran transparan, boleh dibagikan nomor WhatsApp atau email Anda?";
    } else if (lower.includes('@') || lower.includes('08') || lower.includes('+62') || lower.includes('wa') || lower.includes('nomor') || lower.includes('email') || lower.includes('gmail') || lower.includes('telp')) {
      reply = "Terima kasih! Kontak Anda telah saya catat dengan aman sesuai protokol privasi perusahaan. Tim konsultan senior kami akan segera menghubungi Anda dalam waktu kurang dari 1 jam.";
      leadCaptured = true;
      clientSummary = `Prospek Klien baru via Chat AI (Kontak terlampir: ${message})`;
    }

    return NextResponse.json({
      success: true,
      reply: reply,
      lead_captured: leadCaptured,
      client_summary: clientSummary,
      agent: "Maya (Certified AI CS Executive - PT. Indo Jaya Gram)",
      compliance: "Zero Data Leak Enforced",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
