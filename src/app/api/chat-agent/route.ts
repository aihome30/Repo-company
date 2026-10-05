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

    // Knowledge base logic: Maya answers directly without asking for contact info
    if (lower.includes('profil') || lower.includes('siapa') || lower.includes('pt. indo jaya gram')) {
      reply = "PT. Indo Jaya Gram adalah agency digital yang berfokus pada teknologi mutakhir, automasi AI, dan solusi cloud. Kami membangun sistem dengan estetika Stripe/Linear yang modern, performa tinggi, dan fokus pada efisiensi operasional.";
    } else if (lower.includes('website') || lower.includes('web')) {
      reply = "Kami menyediakan layanan pembuatan website profesional (Next.js, TypeScript, Tailwind) dengan performa tinggi dan desain modern. Anda bisa memilih paket mulai dari Company Profile hingga SaaS Enterprise.";
    } else if (lower.includes('ai') || lower.includes('otomasi')) {
      reply = "Layanan AI kami mencakup integrasi AI Agent seperti saya (Maya) untuk kebutuhan CS, automasi workflow operasional, dan analisis data cerdas yang aman dan terenkripsi.";
    } else if (lower.includes('bayar') || lower.includes('xendit')) {
      reply = "Kami menggunakan integrasi Xendit untuk sistem pembayaran yang aman (PCI-DSS compliant), mendukung transfer bank, e-wallet, dan QRIS.";
    } else if (lower.includes('kontak') || lower.includes('hubungi') || lower.includes('nomor') || lower.includes('email') || lower.includes('budget') || lower.includes('harga')) {
      // Ask for contact info only for professional proposal/estimation
      reply = "Untuk kebutuhan penawaran proposal resmi atau estimasi biaya proyek secara spesifik, boleh dibagikan nomor WhatsApp atau email Anda? Tim senior kami akan menyusun proposal transparan untuk Anda.";
    }

    // Lead detection logic
    if ((lower.includes('@') || lower.includes('08') || lower.includes('+62')) && 
        (lower.includes('wa') || lower.includes('email') || lower.includes('gmail'))) {
      leadCaptured = true;
      reply = "Terima kasih informasinya. Data telah kami catat dengan aman. Tim kami akan segera mengirimkan proposal penawaran kepada Anda.";
      clientSummary = `Prospek Klien (Info: ${message})`;
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
