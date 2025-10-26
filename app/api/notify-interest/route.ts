import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { email, product, price } = await request.json();

    if (!email || !product) {
      return NextResponse.json(
        { error: 'Email and product are required' },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Read existing emails
    const emailsPath = join(dataDir, 'email-interests.json');
    let interests: Array<{
      email: string;
      product: string;
      price: string;
      timestamp: string;
    }> = [];

    if (existsSync(emailsPath)) {
      const data = await readFile(emailsPath, 'utf-8');
      interests = JSON.parse(data);
    }

    // Add new interest
    interests.push({
      email,
      product,
      price,
      timestamp: new Date().toISOString()
    });

    // Save updated list
    await writeFile(emailsPath, JSON.stringify(interests, null, 2));

    // TODO: Send email notification to you (owner)
    // You can integrate SendGrid, Resend, or any email service here
    console.log(`New interest: ${email} for ${product} at ${price}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving email interest:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}

