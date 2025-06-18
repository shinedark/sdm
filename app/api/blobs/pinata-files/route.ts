import { NextResponse } from 'next/server';
import { pinata } from '@/lib/pinata';

export async function GET() {
  try {
    // List files from specific group
    const files = await pinata.groups.public.get({ 
      groupId: '3002ea6f-6f9c-4fcd-b1eb-794faf218779',
    });
    console.log(files);
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

