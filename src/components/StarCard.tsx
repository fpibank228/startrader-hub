
import { ReactNode } from 'react';

interface StarCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
}

const StarCard = ({ children, className = '', glowEffect = false }: StarCardProps) => {
  return (
    <div 
      className={`glass-card p-4 relative overflow-hidden rounded-xl backdrop-blur-md 
        bg-white/5 border border-white/10 shadow-lg
        ${glowEffect ? 'animate-pulse-slow' : ''} 
        ${className}`}
    >
      {/* Декоративный элемент в углу карточки */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-md"></div>
      
      {/* Блик на карточке */}
      <div className="absolute -top-1 left-1/4 w-[150%] h-[1px] bg-white/20 rotate-[30deg] transform-gpu"></div>
      
      {children}
    </div>
  );
};

export default StarCard;
