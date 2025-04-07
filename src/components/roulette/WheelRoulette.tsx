
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
}

const WheelRoulette = ({ items: initialItems, onSpin }: WheelRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [items, setItems] = useState<RouletteItem[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Initialize with provided items
  useEffect(() => {
    // Make sure we have exactly 6 items for the wheel
    const wheelItems = initialItems.slice(0, 6);
    
    // Make sure at least one item is marked as the winner
    const hasWinItem = wheelItems.some(item => item.isWin);
    if (!hasWinItem && wheelItems.length > 0) {
      wheelItems[0] = { ...wheelItems[0], isWin: true };
    }
    
    setItems(wheelItems);
  }, [initialItems]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Find the winning item
    const winItemIndex = items.findIndex(item => item.isWin);
    const winningIndex = winItemIndex !== -1 ? winItemIndex : 0;
    
    // Calculate the winning segment angle
    const segmentAngle = 360 / items.length;
    
    // Calculate target rotation to position winning segment at the top
    // We add multiple full rotations plus the angle needed to position the winning segment at the top
    // The winning position is at the top (270 degrees) to align with the pointer
    const targetPosition = 270 - (winningIndex * segmentAngle);
    const fullRotations = 4; // Spin 4 full rotations before stopping
    const finalRotation = (fullRotations * 360) + targetPosition;
    
    // Small random offset for variety (-10 to +10 degrees)
    const randomOffset = Math.random() * 20 - 10;
    
    // Set the final rotation value
    setRotation(finalRotation + randomOffset);
    
    // Process the result after the animation completes
    setTimeout(() => {
      setIsSpinning(false);
      
      // Get the winning item and show the result modal
      if (items.length > 0) {
        const winningItem = items[winningIndex];
        setResult(winningItem);
        setShowResultModal(true);
        
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
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-0 border-b-[20px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg" />
            </div>
            
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full blur-md bg-gradient-to-t from-purple-500/30 to-blue-500/30"></div>
            
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
                ease: [0.32, 0.72, 0.35, 0.94], // Custom cubic bezier for natural spin deceleration
                type: "tween",
              }}
            >
              {/* Wheel segments */}
              {items.map((item, index) => {
                // Calculate segment angle and position
                const segmentAngle = 360 / items.length;
                const startAngle = index * segmentAngle;
                
                // Alternate segment colors and highlight winning segment
                const isEven = index % 2 === 0;
                const segmentColor = item.isWin 
                  ? 'rgba(255, 215, 0, 0.25)' // Gold for winning segment
                  : isEven 
                    ? 'rgba(128, 90, 213, 0.4)' // Purple
                    : 'rgba(99, 102, 241, 0.4)'; // Blue
                
                const borderColor = item.isWin 
                  ? 'rgba(255, 215, 0, 0.6)' // Gold border for winning segment
                  : 'rgba(255, 255, 255, 0.2)';
                
                return (
                  <div 
                    key={index}
                    className="absolute w-1/2 origin-left"
                    style={{
                      height: '50%',
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${startAngle}deg)`,
                    }}
                  >
                    {/* Segment shape */}
                    <div 
                      className="absolute"
                      style={{
                        width: `${wheelSize / 2}px`,
                        height: `${wheelSize / 2}px`,
                        clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                        backgroundColor: segmentColor,
                        borderLeft: `1px solid ${borderColor}`,
                      }}
                    >
                      {/* Item image */}
                      <div 
                        className="absolute"
                        style={{
                          width: isMobile ? '50px' : '65px',
                          height: isMobile ? '50px' : '65px',
                          top: isMobile ? '20px' : '30px',
                          right: isMobile ? '15px' : '25px',
                          transform: `rotate(${90 - startAngle}deg)`,
                        }}
                      >
                        <img 
                          src={item.link} 
                          alt={item.title}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div 
                className="absolute rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border-2 border-white/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"
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
