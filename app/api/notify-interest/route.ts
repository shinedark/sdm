import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, product, price } = await request.json();

    if (!email || !product) {
      return NextResponse.json(
        { error: 'Email and product are required' },
        { status: 400 }
      );
    }

    // Log to console (Vercel logs are accessible in dashboard)
    console.log('=== NEW EMAIL INTEREST ===');
    console.log(`Email: ${email}`);
    console.log(`Product: ${product}`);
    console.log(`Price: ${price}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('========================');

    // In production on Vercel, you would:
    // 1. Use a database (Vercel Postgres, MongoDB, etc.)
    // 2. Use an email service (Resend, SendGrid) to notify you
    // 3. Use Vercel KV for quick storage
    
    // For now, logging to Vercel console which you can view in dashboard
    // To get notified, add email service integration here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing email interest:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}

