
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, Gift, Star, User, ArrowUpCircle } from 'lucide-react';

const Navigation = () => {
    const activeClass = 'text-white';
    const inactiveClass = 'text-white/50';

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-customDarkBlue/95 via-customDarkBlue/95 to-customDarkBlue/90 backdrop-blur-sm border-t border-white/10 px-2 pt-2 pb-6">
            <div className="grid grid-cols-5 gap-1">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? activeClass : inactiveClass}`}
                >
                    <Home size={20} className="mb-1" />
                    <span className="text-[10px]">Главная</span>
                </NavLink>
                <NavLink
                    to="/buy"
                    className={({ isActive }) => `flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? activeClass : inactiveClass}`}
                >
                    <DollarSign size={20} className="mb-1" />
                    <span className="text-[10px]">Купить</span>
                </NavLink>
                <NavLink
                    to="/roulette"
                    className={({ isActive }) => `flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? activeClass : inactiveClass}`}
                >
                    <Star size={20} className="mb-1" />
                    <span className="text-[10px]">Рулетка</span>
                </NavLink>
                <NavLink
                    to="/upgrade"
                    className={({ isActive }) => `flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? activeClass : inactiveClass}`}
                >
                    <ArrowUpCircle size={20} className="mb-1" />
                    <span className="text-[10px]">Апгрейд</span>
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? activeClass : inactiveClass}`}
                >
                    <User size={20} className="mb-1" />
                    <span className="text-[10px]">Профиль</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Navigation;
