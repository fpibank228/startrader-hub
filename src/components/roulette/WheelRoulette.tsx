
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

const WHEEL_SEGMENTS = 6; // Number of segments in the wheel

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

  // Initialize with fresh data on mount - shuffle only once
  useEffect(() => {
    // Make sure to have at least one win item
    const preparedItems = [...initialItems];
    const hasWinItem = preparedItems.some(item => item.isWin);
    
    if (!hasWinItem && preparedItems.length > 0) {
      // If no win item is specified, make the first one a winner
      preparedItems[0] = { ...preparedItems[0], isWin: true };
    }
    
    setItems(preparedItems);
  }, [initialItems]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Find the winning item
    const winItemIndex = items.findIndex(item => item.isWin);
    const winningIndex = winItemIndex !== -1 ? winItemIndex : 0;
    
    // Calculate angle for the winning segment
    // Each segment is 360/WHEEL_SEGMENTS degrees, and we want to position it at the top
    const segmentAngle = 360 / WHEEL_SEGMENTS;
    const winningAngle = 360 - (winningIndex * segmentAngle); // Reverse direction to match visual expectation
    
    // Add multiple full rotations (e.g., 5 * 360 degrees) plus the winning position
    const spinRotation = 1800 + winningAngle + (Math.random() * 30 - 15); // 5 full rotations + winning position + small random offset
    
    // Animate the rotation
    setRotation(spinRotation);
    
    // Set a timeout for when the animation completes
    setTimeout(() => {
      setIsSpinning(false);
      
      // Prepare result data and show modal
      if (items && items.length > winningIndex) {
        const winningItem = items[winningIndex];
        setResult(winningItem);
        setShowResultModal(true);
        
        if (onSpin && winningItem) {
          onSpin(winningItem);
        }
      }
    }, 5000); // Animation duration
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

  // Calculate wheel size based on device
  const wheelSize = isMobile ? 300 : 400;
  const centerSize = isMobile ? 60 : 80;

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Крутите колесо и выигрывайте приз!</h3>

        <div className="flex justify-center">
          <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
            {/* Wheel pointer (at the top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-10 z-10">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-white" />
            </div>

            {/* Wheel */}
            <motion.div 
              ref={wheelRef}
              className="absolute inset-0 rounded-full overflow-hidden border-4 border-white/30 shadow-lg"
              style={{ 
                backgroundImage: 'radial-gradient(circle, rgba(82,37,109,1) 0%, rgba(40,18,54,1) 100%)',
              }}
              animate={{ 
                rotate: rotation,
              }}
              transition={{ 
                duration: 5,
                ease: "easeOut",
                type: "tween",
              }}
            >
              {items.map((item, index) => {
                const segmentAngle = 360 / WHEEL_SEGMENTS;
                const startAngle = index * segmentAngle;
                
                // Create alternating colors for the segments
                const isEven = index % 2 === 0;
                const segmentColor = isEven ? 'rgba(96, 44, 128, 0.6)' : 'rgba(128, 58, 171, 0.6)';
                const borderColor = item.isWin ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 255, 255, 0.2)';
                
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
                    {/* Segment */}
                    <div 
                      className="absolute"
                      style={{
                        width: `${wheelSize / 2}px`,
                        height: `${wheelSize / 2}px`,
                        clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                        backgroundColor: segmentColor,
                        border: `1px solid ${borderColor}`,
                      }}
                    >
                      {/* Item icon */}
                      <div 
                        className="absolute"
                        style={{
                          width: isMobile ? '50px' : '70px',
                          height: isMobile ? '50px' : '70px',
                          top: isMobile ? '20px' : '30px',
                          right: isMobile ? '20px' : '30px',
                          transform: `rotate(${90 - startAngle}deg)`,
                        }}
                      >
                        <img 
                          src={item.link} 
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div 
                className="absolute rounded-full bg-gradient-to-r from-purple-900 to-purple-700 border-2 border-white/30 flex items-center justify-center"
                style={{
                  width: centerSize,
                  height: centerSize,
                  top: `calc(50% - ${centerSize/2}px)`,
                  left: `calc(50% - ${centerSize/2}px)`,
                }}
              >
                <span className="text-white font-bold text-xl">SPIN</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-6">
          <SpinButton isSpinning={isSpinning} onSpin={spinWheel} />
        </div>
      </StarCard>

      {/* Показываем все возможные выигрыши под рулеткой */}
      <PrizeGrid items={items} onItemClick={handleItemClick} />

      {/* Модальное окно с результатом */}
      <RouletteResultModal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        result={result}
        onPlayAgain={handlePlayAgain}
      />

      {/* Модальное окно с деталями предмета */}
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
