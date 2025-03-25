
import { useState } from 'react';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Lock } from 'lucide-react';

interface RouletteOption {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageBg?: string;
  disabled?: boolean;
}

interface RouletteSelectorProps {
  options: RouletteOption[];
  onSelect: (id: string) => void;
}

const RouletteSelector = ({ options, onSelect }: RouletteSelectorProps) => {
  return (
    <div className="grid gap-4">
      {options.map((option) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: option.disabled ? 1 : 1.02 }}
          whileTap={{ scale: option.disabled ? 1 : 0.98 }}
        >
          <StarCard 
            className={`p-0 overflow-hidden ${option.disabled ? 'opacity-70' : 'cursor-pointer hover:shadow-lg transition-shadow'}`}
            onClick={() => !option.disabled && onSelect(option.id)}
          >
            {option.imageBg && (
              <div 
                className="w-full h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${option.imageBg})` }}
              >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {option.icon || <Star className="w-12 h-12 text-white opacity-70" />}
                </div>
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {option.title}
                    {option.disabled && <Lock size={14} className="text-white/60" />}
                  </h3>
                  <p className="text-sm text-white/70">{option.description}</p>
                </div>
                {!option.disabled && <ChevronRight className="w-5 h-5 text-white/60" />}
              </div>
            </div>
          </StarCard>
        </motion.div>
      ))}
    </div>
  );
};

export default RouletteSelector;
