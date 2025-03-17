
import { motion } from 'framer-motion';
import { Star, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarBackground from '../components/StarBackground';

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <StarBackground />
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-block">
            <Star 
              size={100} 
              className="text-yellow-300 animate-star-spin animate-star-glow" 
              fill="rgba(253, 224, 71, 0.5)" 
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl mb-8 text-white/70">Страница не найдена</p>
          
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-customPurple text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            <Home size={18} />
            На главную
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
