
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
  multiplier: number;
  forceWin?: boolean; // Optional prop to force a win (for demo purposes)
}

// Check if a URL is a Lottie animation (ends with .json)
const isLottieAnimation = (url: string): boolean => {
  return url.toLowerCase().endsWith('.json');
};

export const WheelRoulette = ({ items, multiplier, forceWin }: WheelRouletteProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelItems, setWheelItems] = useState<RouletteItem[]>([]);
  const [isWin, setIsWin] = useState(false);
  
  // Set up items based on multiplier and determine win/loss
  useEffect(() => {
    // Determine if this spin is a win or loss
    // If forceWin is provided, use that value, otherwise use random
    const win = forceWin !== undefined ? forceWin : Math.random() < 0.5;
    setIsWin(win);
    
    // Always include the potential reward as the first item
    const targetItem = items.find(item => item.isWin) || items[0];
    
    // For multiplier x2, show 2 segments (win item + empty/loss item)
    // For multiplier x5, show 5 segments
    // For multiplier x10, show 10 segments
    let totalSegments = multiplier;
    if (totalSegments < 2) totalSegments = 2; // Minimum 2 segments
    if (totalSegments > 10) totalSegments = 10; // Maximum 10 segments
    
    // Create the wheel items array
    let wheelItemsArr: RouletteItem[] = [];
    
    if (win) {
      // If win, include the winning item and fill rest with empty segments
      wheelItemsArr.push({...targetItem, isWin: true});
      
      // Fill the remaining segments with empty placeholders
      for (let i = 1; i < totalSegments; i++) {
        wheelItemsArr.push({
          link: "https://nft.fragment.com/gift/lolpop.lottie.json", // fallback item
          title: "Empty",
          price: 0.1,
          isWin: false
        });
      }
    } else {
      // If loss, all segments are empty except one segment shows the "target" item
      // but it won't actually land on it
      const emptyPlaceholder = {
        link: "https://nft.fragment.com/gift/lolpop.lottie.json",
        title: "Empty",
        price: 0.1,
        isWin: false
      };
      
      // Add the target item at a random position that won't be selected
      const winningPosition = Math.floor(Math.random() * (totalSegments - 1)) + 1;
      
      for (let i = 0; i < totalSegments; i++) {
        if (i === winningPosition) {
          // Add the target item but marked as not a win
          wheelItemsArr.push({...targetItem, isWin: false});
        } else {
          // Add empty placeholder
          wheelItemsArr.push({...emptyPlaceholder});
        }
      }
    }
    
    setWheelItems(wheelItemsArr);
  }, [items, multiplier, forceWin]);
  
  // Start spinning the wheel automatically
  useEffect(() => {
    if (wheelItems.length === 0) return;
    
    // Find the winning segment index (marked as isWin)
    const winItemIndex = wheelItems.findIndex(item => item.isWin);
    
    // Calculate the winning segment angle
    const segmentAngle = 360 / wheelItems.length;
    
    // Calculate target rotation to position winning segment at the top (270 degrees)
    let targetPosition;
    
    if (isWin && winItemIndex !== -1) {
      // If it's a win, stop at the winning segment
      targetPosition = 270 - (winItemIndex * segmentAngle);
    } else {
      // If it's a loss, stop at a random non-winning segment
      // We'll avoid the segment that has the target item
      const lossSegments = wheelItems
        .map((_, index) => index)
        .filter(index => !wheelItems[index].isWin && 
                         wheelItems[index].title !== items[0].title);
                         
      const randomLossIndex = lossSegments[Math.floor(Math.random() * lossSegments.length)];
      targetPosition = 270 - (randomLossIndex * segmentAngle);
    }
    
    const fullRotations = 4; // Spin 4 full rotations before stopping
    const finalRotation = (fullRotations * 360) + targetPosition;
    
    // Small random offset for variety (-10 to +10 degrees)
    const randomOffset = Math.random() * 20 - 10;
    
    // Set the final rotation value after a short delay
    setTimeout(() => {
      setRotation(finalRotation + randomOffset);
    }, 300);
  }, [wheelItems, items, isWin]);

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
          {wheelItems.map((item, index) => {
            const segmentAngle = 360 / wheelItems.length;
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
            
            // Determine if this segment should show the reward item or be empty
            const showRewardItem = item.isWin || item.title === items[0].title;
            
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
                {showRewardItem ? (
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
                ) : (
                  // Empty segment
                  <div 
                    className="absolute rounded-full bg-white/5 flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      left: `calc(50% + ${itemX * (wheelSize / 100)}px - 20px)`,
                      top: `calc(50% + ${itemY * (wheelSize / 100)}px - 20px)`,
                    }}
                  >
                    {/* Empty slot indicator */}
                  </div>
                )}
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
              {multiplier && <span className="text-xs block opacity-80">x{multiplier}</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
