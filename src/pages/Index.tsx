
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Star, ArrowRight, Gift} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import Logo from '../components/Logo';
import StarCard from '../components/StarCard';
import WebApp from "@twa-dev/sdk";
import {Home, DollarSign, User, Loader2} from 'lucide-react';

const Index = () => {
    const [scrollY, setScrollY] = useState(0);
    const navigate = useNavigate();
    const isFullscreen = WebApp.isFullscreen; // Получаем состояние полноэкранного режима

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
    const handleRouletteStarsClick = () => {
        navigate('/roulette');
    };
    const handleProfileStarsClick = () => {
        navigate('/profile');
    };
    const handleUpgradeGiftsClick = () => {
        navigate('/roulette/upgrade');
    };

    return (
        <div className="relative min-h-screen pt-4 pb-24" style={{
            marginTop: isFullscreen ? "80px" : "0px",
        }}>
            <StarBackground/>

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-12"
                >
                    <Logo size="large"/>
                    <p className="mt-4 text-white/80 max-w-md mx-auto">
                        Первая платформа для азартных игр на nft подарки в Telegram
                    </p>
                </motion.div>

                <div className="flex flex-col gap-8 max-w-lg mx-auto">
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        onClick={handleBuyStarsClick}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <StarCard glowEffect className="flex items-center p-6">
                            <div className="mr-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-customPurple flex items-center justify-center">
                                    <Star className="w-6 h-6 text-white" fill="white"/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Покупайте звезды</h3>
                                <p className="text-white/70 text-sm">
                                    Приобретайте звезды Telegram по выгодной цене $0.02 за звезду
                                </p>
                            </div>
                        </StarCard>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                        onClick={handleRouletteStarsClick}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <StarCard glowEffect className="flex items-center p-6">
                            <div className="mr-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-customPurple flex items-center justify-center">
                                    <Loader2 className="w-6 h-6"/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Крутите рулетку</h3>
                                <p className="text-white/70 text-sm">
                                    Получите возможность увеличить ваши средства
                                </p>
                            </div>
                        </StarCard>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                        onClick={handleUpgradeGiftsClick}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <StarCard glowEffect className="flex items-center p-6">
                            <div className="mr-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-customPurple flex items-center justify-center">
                                    <Gift className="w-6 h-6 text-white"/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Апгрейд подарков</h3>
                                <p className="text-white/70 text-sm">
                                    Улучшайте ваши подарки и получайте более ценные
                                </p>
                            </div>
                        </StarCard>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.5}}
                        onClick={handleProfileStarsClick}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <StarCard glowEffect className="flex items-center p-6">
                            <div className="mr-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-customPurple flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" fill="white"/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Следите за профилем</h3>
                                <p className="text-white/70 text-sm">
                                    Просматривайте историю покупок и реферальную активность
                                </p>
                            </div>
                        </StarCard>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.6}}
                        className="mt-6"
                    >
                        <Link
                            to="/buy"
                            className="flex items-center justify-center gap-2 bg-customPurple text-white font-medium py-3 px-6 rounded-lg w-full hover:bg-opacity-90 transition-all duration-300 btn-glow"
                        >
                            Начать торговлю
                            <ArrowRight className="w-5 h-5"/>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Index;
