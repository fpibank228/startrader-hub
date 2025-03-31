
import { useEffect, useState, memo } from 'react';
import Lottie from "lottie-react";
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface LottieItemProps {
  animationData: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const LottieItem = memo(({ animationData, className = '', loop = true, autoplay = true }: LottieItemProps) => {
  const [animation, setAnimation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimation = async () => {
      // Показываем лоадер каждый раз при смене анимации
      setIsLoading(true);
      setIsVisible(false);
      setError(false);
      
      try {
        const response = await fetch(animationData);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        if (isMounted) {
          setAnimation(data);
          
          // Добавляем небольшую задержку перед скрытием лоадера
          // чтобы анимация успела подготовиться к рендеру
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
              
              // После скрытия лоадера с небольшой задержкой показываем анимацию
              // для плавного перехода
              setTimeout(() => {
                if (isMounted) {
                  setIsVisible(true);
                }
              }, 100);
            }
          }, 300);
        }
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    if (animationData) {
      fetchAnimation();
    }

    return () => {
      isMounted = false;
    };
  }, [animationData]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Skeleton className="w-full h-full rounded-lg bg-white/10">
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="w-8 h-8 animate-spin text-white/70" />
          </div>
        </Skeleton>
      </div>
    );
  }

  if (error) {
    return <div className={`flex items-center justify-center bg-white/10 rounded-lg ${className}`}>❓</div>;
  }

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {animation && (
        <Lottie
          animationData={animation}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      )}
    </div>
  );
});

LottieItem.displayName = 'LottieItem';

export default LottieItem;
