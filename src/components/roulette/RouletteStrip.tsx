
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

interface RouletteStripProps {
  items: RouletteItem[];
  slidePosition: number;
  isSpinning: boolean;
  selectedIndex: number | null;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const RouletteStrip = memo(({ items, slidePosition, isSpinning, selectedIndex }: RouletteStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Create a repeated array of items for continuous spinning effect
  // Repeat items 5 times instead of 3 to ensure there are plenty of items to fill the strip during animation
  const repeatedItems = [...items, ...items, ...items, ...items, ...items];
  
  return (
    <motion.div 
      ref={stripRef}
      className="absolute top-0 bottom-0 flex items-center gap-4 px-6 py-2"
      animate={{ 
        x: slidePosition 
      }}
      transition={{ 
        duration: isSpinning ? 4 : 0, // Reduced to 4 seconds for slower spinning
        ease: [0.1, 0.6, 0.3, 1], // Adjusted cubic-bezier curve for smoother deceleration
        type: "spring",
        damping: 70, // Increased damping for even smoother stop
        stiffness: 80 // Reduced stiffness for less abrupt stop
      }}
    >
      {repeatedItems.map((item, index) => {
        // Calculate the original index to determine if this item is selected
        const originalIndex = index % items.length;
        const isSelected = selectedIndex === originalIndex && Math.floor(index / items.length) === 2;
        
        return (
          <div 
            key={`${index}-${item.title}`}
            className={`w-24 h-24 flex-shrink-0 ${
              isSelected ? 'scale-110 z-10' : ''
            }`}
          >
            <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
              isSelected ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]' : 'border-white/30'
            } bg-white/10 flex items-center justify-center`}>
              <LottieItem 
                animationData={item.link} 
                className="w-full h-full"
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

RouletteStrip.displayName = 'RouletteStrip';

export default RouletteStrip;
