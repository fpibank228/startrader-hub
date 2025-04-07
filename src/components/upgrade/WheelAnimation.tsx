
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LottieItem from '../roulette/LottieItem';

interface RouletteItem {
  link: string;
  title: string;
  price: number;
  isWin?: boolean;
  [key: string]: any;
}

interface WheelRouletteProps {
  items: RouletteItem[];
}

// Check if a URL is a Lottie animation (ends with .json)
const isLottieAnimation = (url: string): boolean => {
  return url.toLowerCase().endsWith('.json');
};

export const WheelRoulette = ({ items }: WheelRouletteProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Start spinning the wheel automatically
  useEffect(() => {
    const winItemIndex = items.findIndex(item => item.isWin);
    const winningIndex = winItemIndex !== -1 ? winItemIndex : 0;
    
    // Calculate the winning segment angle
    const segmentAngle = 360 / items.length;
    
    // Calculate target rotation to position winning segment at the top
    const targetPosition = 270 - (winningIndex * segmentAngle);
    const fullRotations = 4; // Spin 4 full rotations before stopping
    const finalRotation = (fullRotations * 360) + targetPosition;
    
    // Small random offset for variety (-10 to +10 degrees)
    const randomOffset = Math.random() * 20 - 10;
    
    // Set the final rotation value after a short delay
    setTimeout(() => {
      setRotation(finalRotation + randomOffset);
    }, 300);
  }, [items]);

  // Calculate wheel dimensions
  const wheelSize = 280;
  const centerSize = 70;

  return (
    <div className="flex justify-center items-center">
      {/* Wheel container */}
      <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
        {/* Wheel pointer (triangle at the top) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-0 border-b-[20px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg" />
        </div>
        
        {/* The wheel */}
        <motion.div 
          ref={wheelRef}
          className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-b from-purple-900 to-blue-900 border-4 border-white/20 shadow-lg"
          animate={{ 
            rotate: rotation,
          }}
          initial={{ rotate: 0 }}
          transition={{ 
            duration: 5,
            ease: [0.32, 0.72, 0.35, 0.94],
            type: "tween",
          }}
        >
          {/* Wheel segments */}
          {items.map((item, index) => {
            const segmentAngle = 360 / items.length;
            const angle = index * segmentAngle;
            
            // Alternate background colors
            const isEven = index % 2 === 0;
            const segmentColor = item.isWin 
              ? 'rgba(255, 215, 0, 0.25)' // Gold for winning
              : isEven 
                ? 'rgba(128, 90, 213, 0.4)' // Purple
                : 'rgba(99, 102, 241, 0.4)'; // Blue
            
            // Calculate segment clip path using SVG path
            const startX = Math.sin(angle * Math.PI / 180) * 50 + 50;
            const startY = -Math.cos(angle * Math.PI / 180) * 50 + 50;
            const endAngle = (angle + segmentAngle) * Math.PI / 180;
            const endX = Math.sin(endAngle) * 50 + 50;
            const endY = -Math.cos(endAngle) * 50 + 50;
            const largeArcFlag = segmentAngle <= 180 ? "0" : "1";

            // SVG path for the segment
            const path = `M50,50 L${startX},${startY} A50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`;
            
            // Position for the item image
            const itemAngle = (angle + segmentAngle/2) * Math.PI / 180;
            const itemX = Math.sin(itemAngle) * 30;
            const itemY = -Math.cos(itemAngle) * 30;
            
            return (
              <div
                key={index}
                className="absolute inset-0"
              >
                {/* Segment with border */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                  <path 
                    d={path} 
                    fill={segmentColor}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                </svg>
                
                {/* Item image - centered in each segment */}
                <div 
                  className="absolute rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden"
                  style={{
                    width: '60px',
                    height: '60px',
                    left: `calc(50% + ${itemX * (wheelSize / 100)}px - 30px)`,
                    top: `calc(50% + ${itemY * (wheelSize / 100)}px - 30px)`,
                  }}
                >
                  {isLottieAnimation(item.link) ? (
                    <LottieItem 
                      animationData={item.link} 
                      className="w-full h-full"
                    />
                  ) : (
                    <img 
                      src={item.link} 
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://nft.fragment.com/gift/signetring.lottie.json';
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div 
            className="absolute rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border-2 border-white/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] z-10"
            style={{
              width: centerSize,
              height: centerSize,
              top: `calc(50% - ${centerSize/2}px)`,
              left: `calc(50% - ${centerSize/2}px)`,
            }}
          >
            <div className="text-white font-bold text-center">
              <span className="text-xs block opacity-80">АПГРЕЙД</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
