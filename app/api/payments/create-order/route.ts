import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, shippingOption } = await request.json();

    // Get PayPal credentials based on environment
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

    // Product data
    const products = {
      vinyl: { name: 'El Archivo Vinyl', price: 33, weight: 1.0, isDigital: false },
      box: { name: 'Para Ti Box', price: 11, weight: 0.5, isDigital: false },
      mp3: { name: 'El Archivo MP3 Collection', price: 33, weight: 0, isDigital: true }
    };

    const product = products[productId as keyof typeof products];
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Calculate shipping
    const shippingPrice = product.isDigital ? 0 : parseFloat(shippingOption?.price || '4.50');
    const totalPrice = product.price + shippingPrice;

    // Create PayPal order
    const paypalUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalPrice.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: product.price.toFixed(2)
            },
            ...(shippingPrice > 0 && {
              shipping: {
                currency_code: 'USD',
                value: shippingPrice.toFixed(2)
              }
            })
          }
        },
        items: [{
          name: product.name,
          unit_amount: {
            currency_code: 'USD',
            value: product.price.toFixed(2)
          },
          quantity: '1',
          category: product.isDigital ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS'
        }]
      }]
    };

    const response = await fetch(`${paypalUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'PayPal-Request-Id': `order-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      },
      body: JSON.stringify(orderData)
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('PayPal API error:', order);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: order.id });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
