
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import StarBackground from '../components/StarBackground';
import GiftUpgradeSelector from '../components/upgrade/GiftUpgradeSelector';
import WebApp from "@twa-dev/sdk";
import {apiService} from '@/utils/api';
import {useToast} from '../hooks/use-toast';

const GiftUpgrade = () => {
    const isFullscreen = WebApp.isFullscreen;
    const {toast} = useToast();
    const [userGifts, setUserGifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const resetUserInfo = async () =>{
        const response = await apiService.getUserInfo();
        const data = await response.data;
        setUserGifts(data["gifts"]);
    }
    useEffect(() => {
        setIsLoading(false);

    }, [toast]);

    return (
        <div className="relative min-h-screen pt-4 pb-24" style={{
            marginTop: isFullscreen ? "80px" : "0px",
        }}>
            <StarBackground/>

            <div className="relative z-10 container mx-auto px-4">
                <div className="flex items-center mb-6">
                    <motion.h1
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="text-2xl font-bold"
                    >
                        Апгрейд Подарков
                    </motion.h1>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <p className="text-white/70 text-sm mb-6">
                        Выберите подарки для апгрейда и множитель, чтобы попытать удачу и получить подарок более высокой
                        стоимости!
                    </p>

                    <GiftUpgradeSelector
                        isLoading={isLoading}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default GiftUpgrade;
