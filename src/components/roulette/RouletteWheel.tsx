
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';
import { useIsMobile } from '../../hooks/use-mobile';

interface RouletteItem {
  chance: string;
  link: string;
}

interface RouletteWheelProps {
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const items = [
    {
      'chance': 'yes',
      'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/partysparkler-42952.lottie.json'
    },
  ];

  // Find the winning item index (chance === "yes")
  const winningIndex = items.findIndex(item => item.chance === "yes");
  const safeWinningIndex = 0;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);
    
    // Размеры элементов
    const itemWidth = 120; // ширина элемента + отступ
    const stripWidth = items.length * itemWidth;
    
    // Получаем фактическую ширину контейнера
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const centerPosition = containerWidth / 2;
    
    // Начальная позиция (без анимации)
    const startPosition = 0;
    
    // Промежуточная позиция для анимации - сдвигаем ленту далеко влево
    const midwayPosition = -(stripWidth * 3);
    
    // Финальная позиция, где выигрышный элемент будет точно по центру контейнера
    // Учитываем положение центра контейнера и позицию выигрышного элемента
    const targetItemLeftPosition = midwayPosition + (stripWidth - (4 * itemWidth));
    const finalPosition = targetItemLeftPosition - centerPosition + (itemWidth / 2);
    
    // Устанавливаем начальную позицию (без анимации)
    setSlidePosition(startPosition);
    
    // Запускаем анимацию через небольшую задержку
    setTimeout(() => {
      // Единая анимация с использованием одного вызова
      setSlidePosition(finalPosition);
      
      // После завершения анимации
      setTimeout(() => {
        setSelectedIndex(safeWinningIndex);
        setIsSpinning(false);
        
        if (onSpin) {
          onSpin(items[safeWinningIndex]);
        }
      }, 5000); // Время до полной остановки (5 секунд)
    }, 10);
  };

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>
        
        <div 
          ref={containerRef}
          className="relative h-40 mx-auto bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden"
        >
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
              duration: isSpinning ? 5 : 0,
              ease: [0.1, 0.8, 0.5, 1], // Специальная кривая Безье для эффекта: медленно-быстро-плавное замедление
              type: "tween"
            }}
          >
            {/* Repeat items multiple times to create illusion of infinite strip */}
            {[...Array(7)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex items-center gap-6">
                {items.map((item, index) => {
                  const isSelected = selectedIndex === index && repeatIndex === 3;
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
