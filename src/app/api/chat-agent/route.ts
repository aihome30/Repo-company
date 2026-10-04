import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Simulate an intelligent CS AI employee handling the request
    const lower = message.toLowerCase();
    let reply = "Halo! Saya Maya, Customer Service Representative PT. Indo Jaya Gram. Ada yang bisa saya bantu terkait layanan pengembangan web, automasi AI, atau sistem pembayaran kami?";

    if (lower.includes('website') || lower.includes('web') || lower.includes('buat')) {
      reply = "Baik, untuk pembuatan website kami menggunakan teknologi modern (Next.js, Tailwind, TypeScript) dengan standar estetika Stripe/Linear. Berapa estimasi halaman atau fitur utama yang Anda butuhkan?";
    } else if (lower.includes('ai') || lower.includes('otomasi') || lower.includes('agent')) {
      reply = "Layanan automasi AI dan agen otonom kami dirancang khusus untuk efisiensi bisnis. Apakah Anda ingin automasi customer service, internal HR, atau operasional data?";
    } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('price')) {
      reply = "Estimasi investasi bervariasi tergantung kompleksitas proyek. Boleh saya tahu email atau nomor WhatsApp Anda agar tim sales engineer kami bisa mengirimkan proposal resmi?";
    } else if (lower.includes('kontak') || lower.includes('whatsapp') || lower.includes('wa') || lower.includes('@')) {
      reply = "Terima kasih! Kontak Anda telah saya catat dan teruskan ke tim teknis kami. Mohon tunggu sebentar, tim kami akan segera menghubungi Anda melalui WhatsApp/Email tersebut.";
    }

    return NextResponse.json({
      success: true,
      reply: reply,
      agent: "Maya (AI Customer Service Executive)",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
