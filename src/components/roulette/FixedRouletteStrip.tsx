
import { motion } from 'framer-motion';
import { useRef, memo } from 'react';
import LottieItem from './LottieItem';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  number?: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
}

interface FixedRouletteStripProps {
  items: RouletteItem[];
  slidePosition: number;
  isSpinning: boolean;
  selectedIndex: number | null;
}

const FixedRouletteStrip = memo(({ items, slidePosition, isSpinning, selectedIndex }: FixedRouletteStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Create a repeated array of items for continuous spinning effect
  // Repeat items 5 times to ensure there are plenty of items to fill the strip during animation
  const repeatedItems = [...items, ...items, ...items, ...items, ...items];
  
  return (
    <motion.div 
      ref={stripRef}
      className="absolute top-0 bottom-0 flex items-center gap-4 px-4" // Added gap-4 for spacing between items
      animate={{ 
        x: slidePosition 
      }}
      transition={{ 
        duration: isSpinning ? 4.5 : 0.2, // 4.5 seconds for spin (longer to complete 4 rotations)
        ease: isSpinning ? [0.1, 0.3, 0.3, 1] : "easeOut", // Custom easing for a more natural deceleration
        type: "tween",
      }}
    >
      {repeatedItems.map((item, index) => {
        // Calculate the original index to determine if this item is selected
        const originalIndex = index % items.length;
        const isSelected = selectedIndex === originalIndex && Math.floor(index / items.length) === 2;
        
        return (
          <div 
            key={`${index}-${item.title}`}
            className={`flex-shrink-0 transition-transform ${
              isSelected ? 'scale-110 z-10' : ''
            }`}
            style={{ width: '120px', height: '120px' }} // Reduced from 140px to 120px
          >
            <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
              isSelected ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]' : 'border-white/30'
            } bg-gradient-to-br from-purple-900/60 to-blue-900/60 flex items-center justify-center`}>
              <LottieItem 
                animationData={item.link} 
                className="w-5/6 h-5/6" // Using 5/6 of the container for the animation
                loop={isSelected}
                autoplay={isSelected || isSpinning}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
});

FixedRouletteStrip.displayName = 'FixedRouletteStrip';

export default FixedRouletteStrip;
