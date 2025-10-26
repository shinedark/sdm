import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
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

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    // Get PayPal credentials
    const clientId = process.env.NODE_ENV === 'production' 
      ? process.env.PAYPAL_LIVE_CLIENT_ID 
      : process.env.PAYPAL_SANDBOX_CLIENT_ID;
    
    const clientSecret = process.env.NODE_ENV === 'production' 
      ? process.env.PAYPAL_LIVE_CLIENT_SECRET 
      : process.env.PAYPAL_SANDBOX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'PayPal credentials not configured' },
        { status: 500 }
      );
    }

    // Capture the PayPal order
    const paypalUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const captureResponse = await fetch(`${paypalUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'PayPal-Request-Id': `capture-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      }
    });

    const captureResult = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', captureResult);
      return NextResponse.json(
        { error: 'Failed to capture PayPal order' },
        { status: 500 }
      );
    }

    // Extract order details
    const purchaseUnit = captureResult.purchase_units[0];
    const amount = parseFloat(purchaseUnit.payments.captures[0].amount.value);
    const customerEmail = captureResult.payer?.email_address;

    // Determine product from amount (simple logic - in production, store product info in order)
    let productId = 'mp3'; // default
    if (amount >= 30 && amount <= 40) {
      productId = 'vinyl';
    } else if (amount >= 10 && amount <= 20) {
      productId = 'box';
    }

    // Generate download token for digital products
    let downloadToken = null;
    if (productId === 'mp3') {
      downloadToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Save order to file (in production, use a database)
    const order: Order = {
      id: orderId,
      productId,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
      customerEmail,
      downloadToken: downloadToken || undefined
    };

    const ordersPath = join(process.cwd(), 'data', 'orders.json');
    let orders: Order[] = [];

    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }

    // Load existing orders
    if (existsSync(ordersPath)) {
      try {
        orders = JSON.parse(readFileSync(ordersPath, 'utf8'));
      } catch (error) {
        console.error('Error reading orders file:', error);
        orders = [];
      }
    }

    // Add new order
    orders.push(order);

    // Save orders
    try {
      writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
    } catch (error) {
      console.error('Error writing orders file:', error);
    }

    // Log order completion
    console.log('Order completed:', {
      orderId,
      productId,
      amount,
      customerEmail,
      downloadToken
    });

    return NextResponse.json({
      success: true,
      orderId,
      productId,
      amount,
      downloadToken,
      message: 'Order captured successfully'
    });

  } catch (error) {
    console.error('Error capturing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
