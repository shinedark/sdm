import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/api/images' };

export async function middleware() {
  const images = await get('images');
  return NextResponse.json(images);
} 