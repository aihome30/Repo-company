import { contactFormSchema } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactFormSchema.parse(body);
    
    // TODO: Implement email sending via SendGrid
    console.log('Contact form submission:', validatedData);
    
    return NextResponse.json(
      { message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 400 }
    );
  }
}
