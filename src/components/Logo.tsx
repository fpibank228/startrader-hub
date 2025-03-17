
import { Star } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl',
  };
  
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]}`}>
      <Star 
        size={iconSize[size]} 
        className="text-yellow-300 animate-star-spin animate-star-glow" 
        fill="rgba(253, 224, 71, 0.5)"
      />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
        StarTrader
      </span>
    </div>
  );
};

export default Logo;
