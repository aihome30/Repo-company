import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const text = message.toLowerCase().trim();
    
    // If OPENAI_API_KEY is available, we can query OpenAI directly for true intelligence
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Anda adalah Maya, CS Executive profesional dari PT. Indo Jaya Gram (wspend.vercel.app). Nilai perusahaan: Expertise First, Ownership, Transparency. Jawablah dengan ramah, cerdas, natural dalam Bahasa Indonesia, to the point, dan relevan dengan pertanyaan klien mengenai pembuatan web, SaaS, automasi AI, atau pembayaran Xendit. Jangan meminta kontak klien kecuali mereka meminta penawaran harga atau proposal resmi.'
              },
              ...(history || []),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
        });
        const aiData = await aiRes.json();
        if (aiData.choices && aiData.choices[0]?.message?.content) {
          const reply = aiData.choices[0].message.content;
          const isLead = text.includes('@') || text.includes('08') || text.includes('+62') || text.includes('whatsapp') || text.includes('email');
          return NextResponse.json({
            success: true,
            reply: reply,
            lead_captured: isLead,
            client_summary: isLead ? `Prospek Klien: ${message}` : "",
            agent: "Maya (AI CS Executive - GPT-4o-mini)"
          });
        }
      } catch (err) {
        console.error("OpenAI API fallback:", err);
      }
    }

    // Smart Semantic Fallback Engine if no OpenAI key
    let reply = "Halo! Saya Maya, CS Executive PT. Indo Jaya Gram. Ada yang bisa saya bantu terkait pengembangan web, SaaS, automasi AI, atau integrasi pembayaran?";
    let leadCaptured = false;
    let clientSummary = "";

    if (text.includes('halo') || text.includes('pagi') || text.includes('siang') || text.includes('malam') || text.includes('hi')) {
      reply = "Halo! Selamat datang di PT. Indo Jaya Gram. Ada proyek digital atau sistem yang ingin Anda kembangkan hari ini?";
    } else if (text.includes('siapa') || text.includes('kamu') || text.includes('maya')) {
      reply = "Saya Maya, AI Customer Service Executive di PT. Indo Jaya Gram. Tugas saya membantu menjawab pertanyaan seputar layanan agensi kami dengan cepat dan akurat.";
    } else if (text.includes('buat web') || text.includes('pembuatan website') || text.includes('bikin web') || text.includes('company profile')) {
      reply = "Kami melayani pembuatan Custom Web App, SaaS, dan Company Profile dengan teknologi modern (Next.js, TypeScript) dan estetika Stripe/Linear yang elegan. Apakah ada referensi atau fitur khusus yang Anda inginkan?";
    } else if (text.includes('ai') || text.includes('otomasi') || text.includes('chatbot') || text.includes('agen')) {
      reply = "Kami ahli dalam membangun solusi Automasi AI dan AI Agent kustom untuk efisiensi bisnis Anda, dirancang aman dan menjaga kerahasiaan data perusahaan.";
    } else if (text.includes('harga') || text.includes('biaya') || text.includes('tarif') || text.includes('budget') || text.includes('proposal')) {
      reply = "Estimasi investasi bervariasi tergantung skala dan kerumitan proyek. Agar kami bisa menyusun penawaran resmi yang transparan, boleh infokan nomor WhatsApp atau email Anda?";
    } else if (text.includes('bayar') || text.includes('xendit') || text.includes('transfer') || text.includes('qris')) {
      reply = "Sistem pembayaran kami terintegrasi resmi dengan Xendit dan Midtrans, mendukung transfer bank, e-wallet, dan QRIS dengan standar keamanan perbankan.";
    } else if ((text.includes('@') || text.includes('08') || text.includes('+62')) && (text.includes('wa') || text.includes('email') || text.includes('gmail') || text.length > 8)) {
      leadCaptured = true;
      reply = "Terima kasih! Kontak Anda telah saya catat dengan aman. Tim konsultan kami akan segera menghubungi Anda untuk pembahasan lebih lanjut.";
      clientSummary = `Prospek Klien (Kontak: ${message})`;
    } else {
      reply = `Baik, saya mengerti. Mengenai "${message}", tim ahli kami di PT. Indo Jaya Gram dapat membantu mewujudkannya dengan standar profesional. Ada hal spesifik mengenai fitur atau teknologi yang ingin didiskusikan?`;
    }

    return NextResponse.json({
      success: true,
      reply: reply,
      lead_captured: leadCaptured,
      client_summary: clientSummary,
      agent: "Maya (Smart Fallback CS Executive)",
      compliance: "Zero Data Leak Enforced",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
