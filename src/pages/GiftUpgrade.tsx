import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import StarBackground from '../components/StarBackground';
import GiftUpgradeSelector from '../components/upgrade/GiftUpgradeSelector';
import UpgradePreview from '../components/upgrade/UpgradePreview';
import WebApp from "@twa-dev/sdk";
import {apiService} from '@/utils/api';
import {useToast} from '../hooks/use-toast';
import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

const GiftUpgrade = () => {
    const isFullscreen = WebApp.isFullscreen;
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(false);

    }, [toast]);

    const handleBack = () => {
        navigate('/roulette');
    };

    return (
        <div className="relative min-h-screen pt-4 pb-24" style={{
            marginTop: isFullscreen ? "80px" : "0px",
        }}>
            <StarBackground/>

            <div className="relative z-10 container mx-auto px-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBack}
                        className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft size={20}/>
                    </button>
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