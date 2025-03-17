
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
    <nav className="fixed bottom-0 left-0 right-0 bg-customDarkBlue bg-opacity-80 backdrop-blur-lg z-50 border-t border-white/10">
      <div className="max-w-screen-lg mx-auto">
        <ul className="flex justify-around">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1">
              <Link
                to={item.path}
                className={`nav-item flex flex-col items-center justify-center py-3 ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                onClick={handleNavClick}
              >
                <div className={`${isAnimating ? 'animate-star-glow' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
