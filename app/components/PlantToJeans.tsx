'use client';

import React from 'react';
import styles from './PlantToJeans.module.css';
interface PlantToJeansProps {
  isAnimating: boolean;
}
const PlantToJeans = ({
  isAnimating
}: PlantToJeansProps) => {
  const getClassName = (baseClass: keyof typeof styles, showClass?: keyof typeof styles) => `${styles[baseClass]} ${isAnimating && showClass ? styles[showClass] : ''}`;
  return <div className="relative w-full h-[100px]">
            <svg viewBox="0 0 400 500" className="w-full h-full">
                {/* Base container for morphing */}
                <g className={getClassName('morphContainer', 'morphActive')}>
                    {/* Plant Group */}
                    <g className={getClassName('plantGroup', 'plantHide')}>
                        {/* Water drops */}
                        <g className={styles.waterdrops}>
                            <path d="M200,30 L205,45 L195,45 Z" className="fill-blue-600/80" />
                            <path d="M180,20 L185,35 L175,35 Z" className="fill-blue-600/80" />
                            <path d="M220,25 L225,40 L215,40 Z" className="fill-blue-600/80" />
                        </g>

                        {/* Main Plant Structure */}
                        <g className={styles.leaves}>
                            {/* Main Stem */}
                            <path d="M200,350 L200,200" className="stroke-green-800" strokeWidth="3" fill="none" />

                            {/* Node Clusters - from bottom to top */}
                            {[320, 290, 260, 230, 200].map((y, i) => <g key={i}>
                                    {/* Left Leaf */}
                                    <path d={`M200 ${y} L${180 - i * 5} ${y - 20} L${170 - i * 5} ${y - 30} L200 ${y} L${175 - i * 5} ${y - 35} Z`} className="fill-green-800 stroke-green-900" strokeWidth="1" />
                                    {/* Right Leaf */}
                                    <path d={`M200 ${y} L${220 + i * 5} ${y - 20} L${230 + i * 5} ${y - 30} L200 ${y} L${225 + i * 5} ${y - 35} Z`} className="fill-green-800 stroke-green-900" strokeWidth="1" />
                                    {/* Purple Highlights */}
                                    <path d={`M200 ${y} L${220 + i * 5} ${y - 20} L${230 + i * 5} ${y - 30}`} className="stroke-purple-700/30" strokeWidth="1" fill="none" />
                                </g>)}

                            {/* Top Cola (flower) */}
                            <g>
                                <path d="M200 200 L220 180 L230 170 L200 200 L225 165 Z
                                       M200 200 L180 180 L170 170 L200 200 L175 165 Z" className="fill-green-700 stroke-green-800" strokeWidth="1" />
                                <path d="M200 175 L210 160 L215 150 L200 175 L205 145 Z
                                       M200 175 L190 160 L185 150 L200 175 L195 145 Z" className="fill-green-700 stroke-green-800" strokeWidth="1" />
                                {/* Purple Tint Overlay */}
                                <path d="M200 200 L220 180 M200 175 L210 160" className="stroke-purple-600/20" strokeWidth="1" fill="none" />
                            </g>
                        </g>
                    </g>

                    {/* Jeans shape that will fade in */}
                    <g className={getClassName('jeansGroup', 'jeansShow')}>
                        <path className={styles.jeansShape} d="M150,100 
                 L250,100 
                 L270,400 
                 L230,400 
                 L200,250
                 L170,400 
                 L130,400 Z" fill="#1E40AF" />

                        {/* Jeans details */}
                        <g className={styles.jeansDetails}>
                            {/* Pockets */}
                            <path d="M170,150 C180,140 220,140 230,150" stroke="#0F2167" fill="none" strokeWidth="2" />
                            <path d="M160,160 L180,160 L180,190 L160,190 Z" fill="#0F2167" />
                            <path d="M220,160 L240,160 L240,190 L220,190 Z" fill="#0F2167" />

                            {/* Stitching */}
                            <path d="M200,250 L200,400" stroke="#2563EB" strokeDasharray="4 2" fill="none" />
                            <path d="M150,100 L250,100" stroke="#2563EB" strokeDasharray="4 2" fill="none" />
                        </g>
                    </g>
                </g>
            </svg>
        </div>;
};
export default PlantToJeans;