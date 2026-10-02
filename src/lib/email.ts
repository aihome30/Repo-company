interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export function generateContactEmailToAdmin(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
}): EmailTemplate {
  return {
    to: 'hello@pt-wspend.com',
    subject: `New Lead: ${data.name} - ${data.service}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
      ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
      <p><strong>Service Interest:</strong> ${escapeHtml(data.service)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>This lead came from pt-wspend.com contact form</em></p>
    `,
  };
}

export function generateContactEmailToUser(email: string, name: string): EmailTemplate {
  return {
    to: email,
    subject: 'Thank you for contacting wspend',
    html: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thank you for reaching out to wspend! We've received your message and will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our services and portfolio at <a href="https://pt-wspend.com">pt-wspend.com</a></p>
      <p>Best regards,<br>The wspend Team</p>
    `,
  };
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
