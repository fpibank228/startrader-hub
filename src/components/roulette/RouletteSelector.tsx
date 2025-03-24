
import { useState } from 'react';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface RouletteSelectorProps {
  options: {
    id: string;
    title: string;
    description: string;
  }[];
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <StarCard 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{option.title}</h3>
                <p className="text-sm text-white/70">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </StarCard>
        </motion.div>
      ))}
    </div>
  );
};

export default RouletteSelector;
