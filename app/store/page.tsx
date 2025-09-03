'use client';

import { useState } from 'react';
import BinaryStatic from '../components/BinaryStatic';
import Footer from '../components/Footer';
import Vinyl from '../components/Vinyl';
interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  status: 'coming-soon' | 'available';
}
const products: Product[] = [{
  id: '1',
  name: 'Digital Album',
  category: 'Music',
  price: '$9.99',
  status: 'coming-soon'
}, {
  id: '2',
  name: 'Limited Edition Vinyl',
  category: 'Music',
  price: '$29.99',
  status: 'coming-soon'
}, {
  id: '3',
  name: 'Artist Merch Bundle',
  category: 'Merchandise',
  price: '$49.99',
  status: 'coming-soon'
}, {
  id: '4',
  name: 'Exclusive NFT',
  category: 'Digital',
  price: '$199.99',
  status: 'coming-soon'
}];
export default function Store() {
  const [showVinyl, setShowVinyl] = useState(false);
  const toggleVinylOverlay = () => {
    setShowVinyl(!showVinyl);
  };
  const closeVinylOverlay = () => {
    setShowVinyl(false);
  };
  return <div className="flex flex-col min-h-screen relative">
            <main className="flex-1 flex items-center justify-center p-8 relative z-10">
                <div className="text-white max-w-6xl w-full space-y-12 mt-8">
                    <section className="text-center mb-16">
                        <h1 className="text-6xl font-bold bg-clip-text text-black bg-gradient-to-r from-white to-black">
                            Store
                        </h1>
                        <div className="flex justify-center relative z-20 ">
                            <button onClick={toggleVinylOverlay} className="w-24 h-12 bg-black text-white flex items-center justify-center mb-6">
                                VINYL
                            </button>
                        </div>
                        <BinaryStatic />
                    </section>
                </div>
            </main>
            <Footer />
            {showVinyl && <Vinyl onClose={closeVinylOverlay} />}
        </div>;
}