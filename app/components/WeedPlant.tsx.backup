'use client';
import React from 'react';
import styles from './WeedPlant.module.css';

interface WeedPlantProps {
    isAnimating: boolean;
}

const WeedPlant = ({ isAnimating }: WeedPlantProps) => {
    return (
        <div className="relative w-full h-[100px]">
            <svg
                viewBox="0 0 64 64"
                className="w-full h-full"
            >
                {/* Water drops */}
                <g className={`${styles['water-drops']} ${isAnimating ? styles['animate-drops'] : ''}`}>
                    <path
                        d="M32,4 L34,8 L30,8 Z"
                        className="fill-blue-600/80"
                    />
                    <path
                        d="M26,2 L28,6 L24,6 Z"
                        className="fill-blue-600/80"
                    />
                    <path
                        d="M38,3 L40,7 L36,7 Z"
                        className="fill-blue-600/80"
                    />
                </g>

                {/* Main Plant Structure */}
                <g className={`${styles.leaves} ${isAnimating ? styles['animate-growth'] : ''}`}>
                    {/* Main Stem */}
                    <path
                        d="M32,50 L32,20"
                        className="stroke-green-800"
                        strokeWidth="1.5"
                        fill="none"
                    />

                    {/* Node Clusters - from bottom to top */}
                    {[45, 40, 35, 30, 25].map((y, i) => (
                        <g key={i}>
                            {/* Left Leaf */}
                            <path
                                d={`M32 ${y} L${28 - i} ${y - 4} L${26 - i} ${y - 6} L32 ${y} L${27 - i} ${y - 7} Z`}
                                className="fill-green-800 stroke-green-900"
                                strokeWidth="0.5"
                            />
                            {/* Right Leaf */}
                            <path
                                d={`M32 ${y} L${36 + i} ${y - 4} L${38 + i} ${y - 6} L32 ${y} L${37 + i} ${y - 7} Z`}
                                className="fill-green-800 stroke-green-900"
                                strokeWidth="0.5"
                            />
                            {/* Purple Highlights */}
                            <path
                                d={`M32 ${y} L${36 + i} ${y - 4} L${38 + i} ${y - 6}`}
                                className="stroke-purple-700/30"
                                strokeWidth="0.3"
                                fill="none"
                            />
                        </g>
                    ))}

                    {/* Top Cola (flower) */}
                    <g>
                        <path
                            d="M32 20 L36 16 L38 14 L32 20 L37 13 Z
                               M32 20 L28 16 L26 14 L32 20 L27 13 Z"
                            className="fill-green-700 stroke-green-800"
                            strokeWidth="0.5"
                        />
                        <path
                            d="M32 15 L34 12 L35 10 L32 15 L33 9 Z
                               M32 15 L30 12 L29 10 L32 15 L31 9 Z"
                            className="fill-green-700 stroke-green-800"
                            strokeWidth="0.5"
                        />
                        {/* Purple Tint Overlay */}
                        <path
                            d="M32 20 L36 16 M32 15 L34 12"
                            className="stroke-purple-600/20"
                            strokeWidth="0.3"
                            fill="none"
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default WeedPlant; 