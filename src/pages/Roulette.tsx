
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";

const Roulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();
  const isFullscreen = WebApp.isFullscreen;

  useEffect(() => {
    toast({
      title: "Функция в разработке",
      description: "Рулетка появится в ближайшем обновлении",
    });
  }, [toast]);

  const handleSpinClick = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      setIsSpinning(false);
      toast({
        title: "Скоро открытие!",
        description: "Рулетка будет доступна в следующем обновлении",
      });
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pt-4 pb-24" style={{
      marginTop: isFullscreen ? "80px" : "0px",
    }}>
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Звёздная Рулетка</h1>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Испытайте удачу и выиграйте звезды! Особый режим для смелых игроков.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StarCard className="mb-6 p-8 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-customPurple to-customBrightBlue mx-auto relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: isSpinning ? 360 : 0 }}
                    transition={{ 
                      duration: 2,
                      ease: "linear",
                      repeat: isSpinning ? Infinity : 0
                    }}
                  >
                    <Loader2 size={64} className="text-white" />
                  </motion.div>
                  
                  {/* Декоративные элементы */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/5"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20"></div>
                </div>
                
                {/* Блики */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-customPurple/20 rounded-full blur-lg"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-customBrightBlue/20 rounded-full blur-lg"></div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">В разработке</h2>
              <p className="text-white/70 mb-6">
                Мы работаем над созданием уникальной системы рулетки звёзд. Скоро здесь появится возможность выиграть до x10 от вашей ставки!
              </p>
              
              <button
                onClick={handleSpinClick}
                disabled={isSpinning}
                className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90"
              >
                {isSpinning ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Loader2 size={18} />
                    Скоро открытие!
                  </>
                )}
              </button>
            </StarCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
