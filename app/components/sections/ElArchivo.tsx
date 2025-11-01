'use client';

import React, { useState } from 'react';
import GlobeGallery from '../GlobeGallery';
const ElArchivo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const handleNotifyMe = async (productName: string, price: string) => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    setIsSubmitting(true);
    setSelectedProduct(productName);
    try {
      const response = await fetch('/api/notify-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          product: productName,
          price
        })
      });
      if (response.ok) {
        setMessage(`✓ Thanks! We'll notify you when ${productName} is available!`);
        setEmail('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };
  return <div className="w-full">
        {/* Product Boxes - NOW FIRST */}
        <div className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-5xl font-bold text-center mb-6 text-gray-900">EL ARCHIVO STORE</h2>
          <p className="text-center text-gray-700 mb-12 text-lg">Get notified when available</p>
          
          {message && <div className="mb-8 p-4 bg-gray-200 border-2 border-gray-800 rounded-lg text-center text-gray-900 font-semibold">
              {message}
            </div>}

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Vinyl */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-full h-64 mb-4 relative overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-300">
                <img src="/images/front vinyl.png" alt="El Archivo Vinyl" className="w-full h-full object-cover opacity-90" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">El Archivo Vinyl</h3>
              <p className="text-gray-600 mb-4">10 year limited release - 500 copies only</p>
              <p className="text-3xl font-bold text-gray-900 mb-6">$33 + shipping</p>
              
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 mb-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700" />
              <button onClick={() => handleNotifyMe('El Archivo Vinyl', '$33 + shipping')} disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold disabled:opacity-50">
                {isSubmitting && selectedProduct === 'El Archivo Vinyl' ? 'Submitting...' : 'Notify Me'}
              </button>
            </div>

            {/* Para Ti Box */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-full h-64 mb-4 relative overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-300">
                <img src="/images/box.JPG" alt="Para Ti Box" className="w-full h-full object-cover opacity-90" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Para Ti Box</h3>
              <p className="text-gray-600 mb-4">450 special edition boxes with label design</p>
              <p className="text-3xl font-bold text-gray-900 mb-6">$11 + shipping</p>
              
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 mb-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700" />
              <button onClick={() => handleNotifyMe('Para Ti Box', '$11 + shipping')} disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold disabled:opacity-50">
                {isSubmitting && selectedProduct === 'Para Ti Box' ? 'Submitting...' : 'Notify Me'}
              </button>
            </div>

            {/* MP3 Collection */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-full h-64 mb-4 relative overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-300">
                <img src="/images/vinyl back.png" alt="El Archivo MP3 Collection" className="w-full h-full object-cover opacity-90" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">El Archivo MP3 Collection</h3>
              <p className="text-gray-600 mb-4">Complete digital collection of all releases</p>
              <p className="text-3xl font-bold text-gray-900 mb-6">$33</p>
              
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 mb-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700" />
              <button onClick={() => handleNotifyMe('El Archivo MP3 Collection', '$33')} disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold disabled:opacity-50">
                {isSubmitting && selectedProduct === 'El Archivo MP3 Collection' ? 'Submitting...' : 'Notify Me'}
              </button>
            </div>

          </div>
        </div>

        {/* Globe Gallery Section - NOW SECOND */}
        <div className="w-full h-screen overflow-hidden mb-20">
          <style jsx>{`
            @keyframes fadeInOut {
              0% { opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; }
            }
            .animated-heading {
              animation: fadeInOut 9s ease-in-out infinite;
              top: 50vh;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          `}</style>
          <h1 className="text-4xl font-bold mb-8 text-center pt-8 fixed animated-heading">
            {`EL ARCHIVO`}
          </h1>
          <div className="w-full h-[calc(100vh-8rem)]">
            <GlobeGallery />
          </div>
        </div>
      </div>;
};
export default ElArchivo;