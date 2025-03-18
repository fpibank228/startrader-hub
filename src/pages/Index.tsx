
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import Logo from '../components/Logo';
import StarCard from '../components/StarCard';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyStarsClick = () => {
    navigate('/buy');
  };

  return (
      <div className="relative min-h-screen pt-4 pb-24">
        <StarBackground />

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
          >
            <Logo size="large" />
            <p className="mt-4 text-white/80 max-w-md mx-auto">
              Первая платформа для безопасной покупки и продажи Telegram звезд
            </p>
          </motion.div>

          <div className="flex flex-col gap-8 max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={handleBuyStarsClick}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <StarCard glowEffect className="flex items-center p-6">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-customPurple flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Покупайте звезды</h3>
                  <p className="text-white/70 text-sm">
                    Приобретайте звезды Telegram по выгодной цене $0.015 за звезду
                  </p>
                </div>
              </StarCard>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6"
            >
              <Link
                  to="/buy"
                  className="flex items-center justify-center gap-2 bg-customPurple text-white font-medium py-3 px-6 rounded-lg w-full hover:bg-opacity-90 transition-all duration-300 btn-glow"
              >
                Начать торговлю
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-20 text-center"
          >
            <div
                className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-sm"
                style={{
                  transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.05}deg)`
                }}
            >
              <Star
                  size={40}
                  className="text-yellow-300 animate-star-spin"
                  fill="rgba(253, 224, 71, 0.5)"
              />
            </div>
            <div
                className="inline-block p-3 rounded-full bg-white/5 backdrop-blur-sm ml-8"
                style={{
                  transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.03}deg)`
                }}
            >
              <Star
                  size={24}
                  className="text-blue-300 animate-star-spin"
                  fill="rgba(147, 197, 253, 0.5)"
              />
            </div>
            <div
                className="inline-block p-2 rounded-full bg-white/5 backdrop-blur-sm ml-6 mt-4"
                style={{
                  transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.02}deg)`
                }}
            >
              <Star
                  size={16}
                  className="text-purple-300 animate-star-spin"
                  fill="rgba(216, 180, 254, 0.5)"
              />
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default Index;