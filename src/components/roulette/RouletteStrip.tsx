
import { motion } from 'framer-motion';
import { useRef, memo } from 'react';
import LottieItem from './LottieItem';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
}

interface RouletteStripProps {
  items: RouletteItem[];
  slidePosition: number;
  isSpinning: boolean;
  selectedIndex: number | null;
}

// Мемоизируем компонент и уменьшим количество повторений элементов
const RouletteStrip = memo(({ items, slidePosition, isSpinning, selectedIndex }: RouletteStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Уменьшаем количество повторений с 7 до 5
  const repeatCount = 5;
  
  return (
    <motion.div 
      ref={stripRef}
      className="absolute top-0 bottom-0 flex items-center gap-4 px-6 py-2"
      animate={{ 
        x: slidePosition 
      }}
      transition={{ 
        duration: isSpinning ? 5 : 0,
        ease: [0.1, 0.8, 0.5, 1],
        type: "tween"
      }}
    >
      {/* Уменьшаем количество повторений для оптимизации */}
      {[...Array(repeatCount)].map((_, repeatIndex) => (
        <div key={repeatIndex} className="flex items-center gap-6">
          {items.map((item, index) => {
            const isSelected = selectedIndex === index && repeatIndex === 3;
            // Оптимизация: не показываем анимацию для неактивных элементов
            return (
              <div 
                key={`${repeatIndex}-${index}`}
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
                    autoplay={isSelected}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
});

RouletteStrip.displayName = 'RouletteStrip';

export default RouletteStrip;
