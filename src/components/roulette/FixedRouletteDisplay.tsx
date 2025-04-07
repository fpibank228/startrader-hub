
import { useRef, memo } from 'react';
import FixedRouletteStrip from './FixedRouletteStrip';
import { useIsMobile } from '../../hooks/use-mobile';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  number?: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
}

interface FixedRouletteDisplayProps {
  items: RouletteItem[];
  slidePosition: number;
  isSpinning: boolean;
  selectedIndex: number | null;
}

const FixedRouletteDisplay = memo(({ items, slidePosition, isSpinning, selectedIndex }: FixedRouletteDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Make sure items is never undefined
  const safeItems = items || [];
  
  return (
    <div 
      ref={containerRef}
      className="relative mx-auto bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden"
      style={{ 
        width: isMobile ? '300px' : '420px', // Smaller width on mobile
        height: isMobile ? '120px' : '160px'  // Smaller height on mobile
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Center indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 -ml-[2px] w-1 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] z-20"></div>
      
      {/* Highlight glow around the center */}
      <div className="absolute left-1/2 top-0 bottom-0 -ml-6 w-12 bg-white/10 blur-md z-10"></div>
      
      <FixedRouletteStrip 
        items={safeItems}
        slidePosition={slidePosition}
        isSpinning={isSpinning}
        selectedIndex={selectedIndex}
      />
    </div>
  );
});

FixedRouletteDisplay.displayName = 'FixedRouletteDisplay';

export default FixedRouletteDisplay;
