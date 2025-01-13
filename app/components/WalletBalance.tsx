'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletBalanceProps {
    walletAddress: string;
    goalAmount: number; // Goal amount in USD
}

export default function WalletBalance({ walletAddress, goalAmount }: WalletBalanceProps) {
    const [balance, setBalance] = useState<string>('0');
    const [usdBalance, setUsdBalance] = useState<number>(0);
    const [ethPrice, setEthPrice] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // Connect to Ethereum mainnet
                const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/ngT2g-ZmKJsWvFCw2qSQgpRISu9AoBTX');

                // Get wallet balance
                const balanceWei = await provider.getBalance(walletAddress);
                const balanceEth = ethers.formatEther(balanceWei);
                setBalance(balanceEth);

                // Fetch ETH price from CoinGecko
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                const ethUsdPrice = data.ethereum.usd;
                setEthPrice(ethUsdPrice);

                // Calculate USD balance
                const usdValue = parseFloat(balanceEth) * ethUsdPrice;
                setUsdBalance(usdValue);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setLoading(false);
            }
        };

        fetchBalance();
        // Refresh every 30 seconds
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [walletAddress]);

    const progressPercentage = (usdBalance / goalAmount) * 100;

    if (loading) {
        return <div className="animate-pulse p-4">Loading balance...</div>;
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl 
            absolute top-4 
            left-4 right-4
            md:left-[35vw] md:right-auto
            ">
            <div className="p-2 md:p-4">
                {/* Desktop Version */}
                <div className="hidden md:block space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500">Progress to Goal</p>
                        <p className="text-sm font-medium text-gray-900">${usdBalance.toFixed(2)} / ${goalAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-black to-gray-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                    <a
                        href="https://shinedark.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-sm font-medium text-black hover:text-black-700 transition-colors"
                    >
                        Donate
                    </a>
                </div>

                {/* Mobile Version */}
                <div className="md:hidden">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xs font-medium text-gray-500">Current Balance</p>
                        <p className="text-lg font-bold text-gray-900">${usdBalance.toFixed(2)}</p>
                        <a
                            href="https://shinedark.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-xs font-medium text-black hover:text-black-700 transition-colors"
                        >
                            Donate
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 