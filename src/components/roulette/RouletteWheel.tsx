
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';

interface RouletteItem {
  chance: string;
  link: string;
}

interface RouletteWheelProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ items, onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Find the winning item index (chance === "yes")
  const winningIndex = items.findIndex(item => item.chance === "yes");
  const safeWinningIndex = winningIndex >= 0 ? winningIndex : 0;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);
    
    // Рассчитываем ширину одного элемента и всей полосы
    const itemWidth = 120; // width of each item + gap
    const stripWidth = items.length * itemWidth;
    
    // Начальная позиция - отодвигаем ленту сильно влево для начала вращения
    const initialSlide = -(stripWidth * 3); // Move strip 3x its length to the left
    
    // Конечная позиция - такая, чтобы выигрышный элемент оказался по центру
    const finalPosition = initialSlide + (stripWidth - (safeWinningIndex * itemWidth)) - (window.innerWidth / 2) + (itemWidth / 2);
    
    // Устанавливаем начальную позицию
    setSlidePosition(initialSlide);
    
    // После небольшой задержки начинаем быстрое вращение
    setTimeout(() => {
      // Промежуточная позиция для быстрого вращения
      const fastSpinPosition = initialSlide + (stripWidth * 2);
      
      // Быстрое вращение
      setSlidePosition(fastSpinPosition);
      
      // После завершения быстрого вращения начинаем замедление
      setTimeout(() => {
        // Медленное замедляющееся вращение до финальной позиции
        setSlidePosition(finalPosition);
        
        // После завершения анимации
        setTimeout(() => {
          setSelectedIndex(safeWinningIndex);
          setIsSpinning(false);
          
          if (onSpin) {
            onSpin(items[safeWinningIndex]);
          }
        }, 3000); // Время замедленного вращения
      }, 2000); // Время быстрого вращения
    }, 100);
  };

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>
        
        <div className="relative h-40 mx-auto bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden">
          {/* Center indicator */}
          <div className="absolute left-1/2 top-0 bottom-0 -ml-[2px] w-1 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] z-20"></div>
          
          {/* Highlight glow around the center */}
          <div className="absolute left-1/2 top-0 bottom-0 -ml-6 w-12 bg-white/5 blur-md z-10"></div>
          
          <motion.div 
            ref={stripRef}
            className="absolute top-0 bottom-0 flex items-center gap-4 px-6 py-2"
            animate={{ 
              x: slidePosition 
            }}
            transition={{ 
              duration: isSpinning ? (selectedIndex === null ? 2 : 3) : 0,
              ease: selectedIndex === null ? "easeInOut" : "easeOut",
            }}
          >
            {/* Repeat items multiple times to create illusion of infinite strip */}
            {[...Array(5)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex items-center gap-6">
                {items.map((item, index) => {
                  const isSelected = selectedIndex === index && repeatIndex === 2;
                  return (
                    <div 
                      key={`${repeatIndex}-${index}`}
                      className={`w-24 h-24 flex-shrink-0 ${
                        isSelected ? 'scale-110 z-10' : ''
                      }`}
                    >
                      <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
                        isSelected ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]' : 'border-white/30'
                      }`}>
                        <LottieItem 
                          animationData={item.link}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSpinning ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Крутится...
              </>
            ) : (
              <>
                <Play size={20} />
                Крутить
              </>
            )}
          </button>
        </div>
      </StarCard>
    </div>
  );
};

export default RouletteWheel;
