
import { useRef, memo } from 'react';
import RouletteStrip from './RouletteStrip';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  number?: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
}

interface RouletteDisplayProps {
  items: RouletteItem[];
  slidePosition: number;
  isSpinning: boolean;
  selectedIndex: number | null;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const RouletteDisplay = memo(({ items, slidePosition, isSpinning, selectedIndex }: RouletteDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Make sure items is never undefined
  const safeItems = items || [];
  
  return (
    <div 
      ref={containerRef}
      className="relative h-40 mx-auto bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden"
    >
      {/* Center indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 -ml-[2px] w-1 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] z-20"></div>
      
      {/* Highlight glow around the center */}
      <div className="absolute left-1/2 top-0 bottom-0 -ml-6 w-12 bg-white/5 blur-md z-10"></div>
      
      <RouletteStrip 
        items={safeItems}
        slidePosition={slidePosition}
        isSpinning={isSpinning}
        selectedIndex={selectedIndex}
      />
    </div>
  );
});

RouletteDisplay.displayName = 'RouletteDisplay';

export default RouletteDisplay;
