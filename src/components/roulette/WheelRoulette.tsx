import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import StarCard from '../StarCard';
import SpinButton from './SpinButton';
import PrizeGrid from './PrizeGrid';
import { useIsMobile } from '../../hooks/use-mobile';
import RouletteResultModal from './RouletteResultModal';
import ItemDetailModal from './ItemDetailModal';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  price: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
  number?: number;
  isWin?: boolean;
}

interface WheelRouletteProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
  stopPosition?: number; // Position where the wheel should stop (0-5)
}

const WheelRoulette = ({ items: initialItems, onSpin, stopPosition = 0 }: WheelRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [spinCount, setSpinCount] = useState(0); // Track number of spins to reset properly
  const wheelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Ensure stopPosition is within valid range
  const validStopPosition = Math.min(Math.max(0, stopPosition), 5);

  // Initialize with provided items
  useEffect(() => {
    // Make sure we have exactly 6 items for the wheel
    const wheelItems = [...initialItems].slice(0, 6);
    
    // Pad array if fewer than 6 items
    while (wheelItems.length < 6) {
      wheelItems.push({
        chance: "0",
        link: "https://placehold.co/100x100/purple/white?text=Prize",
        title: "Prize",
        price: 0,
      });
    }
    
    // Make sure at least one item is marked as the winner
    const hasWinItem = wheelItems.some(item => item.isWin);
    if (!hasWinItem && wheelItems.length > 0) {
      wheelItems[validStopPosition] = { ...wheelItems[validStopPosition], isWin: true };
    }
    
    setItems(wheelItems);
  }, [initialItems, validStopPosition]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResultModal(false); // Ensure modal is closed
    
    // Use the provided stop position
    const winningIndex = validStopPosition;
    
    // Calculate the winning segment angle
    const segmentAngle = 360 / items.length;
    
    // Calculate target rotation to position winning segment at the top
    // We add multiple full rotations plus the angle needed to position the winning segment at the top
    // The winning position is at the top (270 degrees) to align with the pointer
    const targetPosition = 270 - (winningIndex * segmentAngle);
    const fullRotations = 4; // Spin 4 full rotations before stopping
    
    // Add current rotation to ensure continuous rotation for subsequent spins
    const finalRotation = (fullRotations * 360) + targetPosition + (spinCount * 360);
    
    // Small random offset for variety (-5 to +5 degrees)
    const randomOffset = Math.random() * 10 - 5;
    
    // Set the final rotation value
    setRotation(finalRotation + randomOffset);
    
    // Increment spin count for next spin
    setSpinCount(prev => prev + 1);
    
    // Process the result after the animation fully completes (5 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      
      // Get the winning item and show the result modal
      if (items.length > 0) {
        const winningItem = items[winningIndex];
        setResult(winningItem);
        
        // Wait a short delay after the wheel stops to show the modal
        setTimeout(() => {
          setShowResultModal(true);
        }, 500);
        
        if (onSpin && winningItem) {
          onSpin(winningItem);
        }
      }
    }, 5000); // Match duration to the wheel animation
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setResult(null);
    // Don't reset rotation here - keep the wheel in its current position for the next spin
  };

  const handleItemClick = (item: RouletteItem) => {
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setTimeout(() => {
      setSelectedItem(null);
    }, 200);
  };

  // Calculate wheel dimensions based on device size
  const wheelSize = isMobile ? 280 : 380; 
  const centerSize = isMobile ? 70 : 90;

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-6">Крутите колесо и выигрывайте приз!</h3>

        <div className="flex justify-center mb-6">
          {/* Wheel container */}
          <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
            {/* Wheel pointer (triangle at the top) */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-0 border-b-[20px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg rotate-180" />
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
              {/* Wheel segments - structured as a pie chart with 6 equal segments */}
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
                // Calculate position at 60% of the radius from center, in the middle of the segment
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
                        width: isMobile ? '60px' : '75px',
                        height: isMobile ? '60px' : '75px',
                        left: `calc(50% + ${itemX * (wheelSize / 100)}px - ${isMobile ? 30 : 37.5}px)`,
                        top: `calc(50% + ${itemY * (wheelSize / 100)}px - ${isMobile ? 30 : 37.5}px)`,
                      }}
                    >
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
                  <span className="text-xs block opacity-80">НАЖМИ</span>
                  <span className="text-xl block -mt-1">SPIN</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-2">
          <SpinButton isSpinning={isSpinning} onSpin={spinWheel} />
        </div>
      </StarCard>

      {/* Prize grid showing all possible items */}
      <PrizeGrid items={items} onItemClick={handleItemClick} />

      {/* Result modal shown after spin */}
      <RouletteResultModal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        result={result}
        onPlayAgain={handlePlayAgain}
      />

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetailModal
          isOpen={showItemDetail}
          onClose={handleCloseItemDetail}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default WheelRoulette;
