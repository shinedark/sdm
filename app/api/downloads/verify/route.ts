import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Order {
  id: string;
  productId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  customerEmail?: string;
  downloadToken?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      );
    }

    // Load orders from file
    const ordersPath = join(process.cwd(), 'data', 'orders.json');
    
    if (!existsSync(ordersPath)) {
      return NextResponse.json(
        { error: 'No orders found' },
        { status: 404 }
      );
    }

    let orders: Order[] = [];
    try {
      orders = JSON.parse(readFileSync(ordersPath, 'utf8'));
    } catch (error) {
      console.error('Error reading orders file:', error);
      return NextResponse.json(
        { error: 'Failed to read orders' },
        { status: 500 }
      );
    }

    // Find order with matching token
    const order = orders.find(o => o.downloadToken === token && o.status === 'completed');

    if (!order) {
      return NextResponse.json(
        { error: 'Invalid or expired download token' },
        { status: 404 }
      );
    }

    // Check if token has expired (24 hours)
    const orderTime = new Date(order.timestamp);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceOrder > 24) {
      return NextResponse.json(
        { error: 'Download token has expired' },
        { status: 410 }
      );
    }

    // Calculate expiration time
    const expiresAt = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000);

    // Return download information
    return NextResponse.json({
      valid: true,
      productName: 'El Archivo MP3 Collection',
      downloadUrl: '/downloads/el-archivo-complete-collection.zip', // This would be a protected file
      expiresAt: expiresAt.toISOString(),
      message: 'Download token is valid'
    });

  } catch (error) {
    console.error('Error verifying download token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
