import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await list();
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blobs' }, { status: 500 });
    }
} 