
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

// Helper function to determine if URL is a Lottie animation
const isLottieAnimation = (url: string): boolean => {
  return url?.toLowerCase?.().endsWith('.json') || false;
};

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const RouletteStrip = memo(({ items, slidePosition, isSpinning, selectedIndex }: RouletteStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Create a repeated array of items for continuous spinning effect
  // Repeat items 5 times to ensure there are plenty of items to fill the strip during animation
  const repeatedItems = [...items, ...items, ...items, ...items, ...items];
  
  return (
    <motion.div 
      ref={stripRef}
      className="absolute top-0 bottom-0 flex items-center gap-4 px-6 py-2"
      animate={{ 
        x: slidePosition 
      }}
      transition={{ 
        duration: isSpinning ? 3.5 : 0.2, // 3.5 seconds for spin (slightly faster), 0.2 for reset
        ease: "easeOut", // Simple easeOut for consistent deceleration
        type: "tween", // Using tween for more predictable animation
      }}
    >
      {repeatedItems.map((item, index) => {
        // Calculate the original index to determine if this item is selected
        const originalIndex = index % items.length;
        const isSelected = selectedIndex === originalIndex && Math.floor(index / items.length) === 2;
        
        return (
          <div 
            key={`${index}-${item.title}`}
            className={`w-24 h-24 flex-shrink-0 transition-transform ${
              isSelected ? 'scale-110 z-10' : ''
            }`}
          >
            <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
              isSelected ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]' : 'border-white/30'
            } bg-white/10 flex items-center justify-center`}>
              {isLottieAnimation(item.link) ? (
                <LottieItem 
                  animationData={item.link} 
                  className="w-full h-full"
                  loop={isSelected}
                  autoplay={isSelected || isSpinning}
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
                    target.src = 'https://placehold.co/100x100/purple/white?text=Prize';
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
});

RouletteStrip.displayName = 'RouletteStrip';

export default RouletteStrip;
