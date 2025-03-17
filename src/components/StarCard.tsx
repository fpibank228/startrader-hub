
import { ReactNode } from 'react';

interface StarCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
}

const StarCard = ({ children, className = '', glowEffect = false }: StarCardProps) => {
  return (
    <div 
      className={`glass-card p-4 ${
        glowEffect ? 'animate-pulse-slow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default StarCard;
