
import { useEffect, useState, memo } from 'react';
import Lottie from "lottie-react";

interface LottieItemProps {
  animationData: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const LottieItem = memo(({ animationData, className = '', loop = true, autoplay = true }: LottieItemProps) => {
  const [animation, setAnimation] = useState<any>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(animationData);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        if (isMounted) {
          setAnimation(data);
          setError(false);
        }
      } catch (err) {
        console.error('Error loading Lottie animation:', err, animationData);
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
    } else {
      setError(true);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [animationData]);

  if (isLoading) {
    return <div className={`flex items-center justify-center bg-white/10 rounded-lg ${className}`}>
      <div className="animate-pulse w-8 h-8 rounded-full bg-white/20"></div>
    </div>;
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
