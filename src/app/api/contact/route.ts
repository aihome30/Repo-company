import { contactFormSchema } from '@/lib/validation';
import { generateContactEmailToAdmin, generateContactEmailToUser } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (production should use Redis)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  
  const timestamps = rateLimitMap.get(ip) || [];
  const recentRequests = timestamps.filter(t => t > fiveMinutesAgo);
  
  if (recentRequests.length >= 5) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = contactFormSchema.parse(body);
    
    // TODO: Send emails via SendGrid/Resend
    // For now, just log and return success
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      service: validatedData.service,
      timestamp: new Date().toISOString(),
    });

    // In production, integrate with SendGrid or Resend:
    // const adminEmail = generateContactEmailToAdmin(validatedData);
    // const userEmail = generateContactEmailToUser(validatedData.email, validatedData.name);
    // await sendEmail(adminEmail);
    // await sendEmail(userEmail);
    
    return NextResponse.json(
      { message: 'Thank you! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 400 }
    );
  }
}
