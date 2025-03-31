
import { useEffect, useState, memo } from 'react';
import Lottie from "lottie-react";
import { Loader2 } from 'lucide-react';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimation = async () => {
      // Если анимация уже загружена, не загружаем ее снова
      if (animation) return;
      
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch(animationData);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        if (isMounted) {
          setAnimation(data);
        }
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
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
  }, [animationData, animation]);

  if (isLoading) {
    return <div className={`flex items-center justify-center ${className}`}><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (error) {
    return <div className={`flex items-center justify-center bg-white/10 rounded-lg ${className}`}>❓</div>;
  }

  return (
    <div className={className}>
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
