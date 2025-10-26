'use client';

import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number; // in pounds for shipping calculation
  stock: number;
  image?: string;
  isDigital: boolean;
}

interface ShippingOption {
  name: string;
  price: number;
  days: string;
}

const products: Product[] = [
  {
    id: 'vinyl',
    name: 'El Archivo Vinyl',
    description: '10 year limited release - 500 copies only. High quality vinyl pressing of the complete El Archivo collection.',
    price: 33,
    weight: 1.0,
    stock: 500,
    image: '/images/vinyl.jpg',
    isDigital: false
  },
  {
    id: 'box',
    name: 'Para Ti Box',
    description: '450 boxes with the label design - meant to be used as a box you fill with letters, pictures and things to open one day in case you are having one of those days in life you need a message from someone.',
    price: 11,
    weight: 0.5,
    stock: 450,
    image: '/images/box.jpg',
    isDigital: false
  },
  {
    id: 'mp3',
    name: 'El Archivo MP3 Collection',
    description: 'The whole collection of MP3s that was previously released as a compressed file to download. Complete digital archive.',
    price: 33,
    weight: 0,
    stock: 999999, // Unlimited digital
    image: '/images/mp3.jpg',
    isDigital: true
  }
];

const shippingOptions: ShippingOption[] = [
  { name: 'USPS Ground Advantage', price: 4.50, days: '2-5 business days' },
  { name: 'USPS Priority Mail', price: 8.95, days: '1-3 business days' },
  { name: 'USPS Priority Mail Express', price: 24.95, days: '1-2 business days' }
];

const calculateShipping = (weight: number): ShippingOption => {
  if (weight === 0) return { name: 'Digital Download', price: 0, days: 'Instant' };
  
  // Simple weight-based calculation
  if (weight <= 0.5) {
    return shippingOptions[0]; // Ground Advantage
  } else if (weight <= 1.0) {
    return shippingOptions[1]; // Priority Mail
  } else {
    return shippingOptions[2]; // Priority Express
  }
};

const ProductCard: React.FC<{ product: Product; onPurchase: (product: Product) => void }> = ({ product, onPurchase }) => {
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(calculateShipping(product.weight));
  const [showStockWarning, setShowStockWarning] = useState(false);

  useEffect(() => {
    setShowStockWarning(product.stock <= 10 && product.stock > 0);
  }, [product.stock]);

  const totalPrice = product.price + selectedShipping.price;

  const paypalOptions = {
    clientId: (process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID 
      : process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID) || '',
    currency: 'USD',
    intent: 'capture'
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalPrice.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: product.price.toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: selectedShipping.price.toFixed(2)
            }
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
        }],
        shipping: product.isDigital ? undefined : {
          name: {
            full_name: 'Customer'
          },
          address: {
            address_line_1: '123 Main St',
            admin_area_2: 'City',
            admin_area_1: 'State',
            postal_code: '12345',
            country_code: 'US'
          }
        }
      }]
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      onPurchase(product);
      console.log('Payment completed:', details);
      // Here you would typically send the order to your backend
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Product Image */}
        <div className="w-full md:w-48 flex-shrink-0">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
          
          {/* Stock Warning */}
          {showStockWarning && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              ⚠️ Only {product.stock} items left in stock!
            </div>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </div>

          {/* Shipping Options (for physical products) */}
          {!product.isDigital && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Options:
              </label>
              <select 
                value={selectedShipping.name}
                onChange={(e) => {
                  const option = shippingOptions.find(opt => opt.name === e.target.value);
                  if (option) setSelectedShipping(option);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {shippingOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name} - ${option.price.toFixed(2)} ({option.days})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Total Price */}
          <div className="text-xl font-semibold text-gray-900 mb-4">
            Total: ${totalPrice.toFixed(2)}
            {!product.isDigital && (
              <span className="text-sm text-gray-600 ml-2">
                (includes ${selectedShipping.price.toFixed(2)} shipping)
              </span>
            )}
          </div>

          {/* PayPal Button */}
          <div className="max-w-xs">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  console.error('PayPal error:', err);
                }}
                style={{
                  layout: 'vertical',
                  color: 'black',
                  shape: 'rect',
                  label: 'paypal'
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

const Store: React.FC = () => {
  const [inventory, setInventory] = useState<Record<string, number>>({
    vinyl: 500,
    box: 450,
    mp3: 999999
  });

  const handlePurchase = (product: Product) => {
    // Update inventory
    setInventory(prev => ({
      ...prev,
      [product.id]: Math.max(0, prev[product.id] - 1)
    }));

    // Update product stock
    const productIndex = products.findIndex(p => p.id === product.id);
    if (productIndex !== -1) {
      products[productIndex].stock = Math.max(0, products[productIndex].stock - 1);
    }

    // Handle digital download
    if (product.isDigital) {
      // Generate download token and redirect
      const token = generateDownloadToken();
      window.location.href = `/downloads/${token}`;
    } else {
      // Show success message for physical products
      alert(`Thank you for your purchase! Your ${product.name} will be shipped within 1-2 business days.`);
    }
  };

  const generateDownloadToken = (): string => {
    // Simple token generation - in production, use crypto.randomBytes
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">El Archivo Store</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Limited edition releases and digital collections from the El Archivo project. 
            Each item is carefully curated and represents a piece of the musical journey.
          </p>
        </div>

        <div className="space-y-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            All physical items ship within 1-2 business days via USPS. 
            Digital downloads are available immediately after purchase.
          </p>
          <p className="text-sm mt-2">
            Questions? Contact us at <a href="mailto:info@shinedark.dev" className="text-blue-600 hover:underline">info@shinedark.dev</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Store;
