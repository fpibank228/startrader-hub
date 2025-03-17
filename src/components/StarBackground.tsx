
import { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: 'small' | 'medium' | 'large';
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = Math.floor(window.innerWidth / 8); // Responsive star count
      
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() > 0.7 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small';
        const star: Star = {
          id: i,
          size,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 7}s`,
          animationDelay: `${Math.random() * 5}s`,
        };
        newStars.push(star);
      }
      
      setStars(newStars);
    };

    generateStars();

    // Regenerate stars on window resize
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star-${star.size} pointer-events-none`}
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
