
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, Store, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNavClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const navItems = [
    { path: '/', label: 'Главная', icon: <Home className="w-5 h-5" /> },
    { path: '/buy', label: 'Купить', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/sell', label: 'Продать', icon: <Store className="w-5 h-5" /> },
    { path: '/profile', label: 'Профиль', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-customDarkBlue bg-opacity-85 backdrop-blur-xl z-50 border-t border-white/10 shadow-lg">
      <div className="max-w-screen-lg mx-auto px-2">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-3 px-1 ${
                    isActive 
                      ? 'text-customPurple' 
                      : 'text-gray-400 hover:text-gray-300'
                  } transition-all duration-300`}
                  onClick={handleNavClick}
                >
                  <div 
                    className={`${
                      isActive 
                        ? 'bg-white/10 p-2 rounded-full shadow-inner' 
                        : 'p-2'
                    } ${isAnimating ? 'animate-star-glow' : ''}`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 w-1/4 h-0.5 bg-customPurple rounded-t-full animate-pulse-slow" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
