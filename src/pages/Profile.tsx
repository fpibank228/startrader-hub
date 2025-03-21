import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Star, History, User, DollarSign, Share2, Wallet, Loader} from 'lucide-react';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { TonConnectButton } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import axios from "axios";

interface Transaction {
    id: number;
    type: 'buy' | 'sell';
    amount: number;
    date: string;
    price: string;
}

const Profile = () => {
    const [tab, setTab] = useState<'profile' | 'history'>('profile');
    const [walletConnected, setWalletConnected] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Состояние для хранения транзакций
    const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
    const { toast } = useToast();
    const isFullscreen = WebApp.isFullscreen;

    // Загрузка транзакций при открытии вкладки "История"
    useEffect(() => {
        if (tab === 'history') {
            fetchTransactions();
        }
    }, [tab]);

    // Функция для загрузки транзакций
    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://starsbuy.space/api/api/get_my_transaction',
                {
                    init: WebApp.initData,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const json = await response.data;
            // if (!response.ok) {
            //     throw new Error('Ошибка при загрузке транзакций');
            // }

            const data = await response.data;
            setTransactions(data.transactions); // Обновляем состояние транзакций
        } catch (error) {
            console.error(error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить историю транзакций',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const totalBought = transactions
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + parseInt(String(t.amount), 10), 0);

    const totalSold = transactions
        .filter(t => t.type === 'sell')
        .reduce((sum, t) => sum + t.amount, 0);

    const handleConnectWallet = () => {
        setWalletConnected(true);
        toast({
            title: "Кошелек подключен",
            description: "Ваш TON кошелек успешно подключен к аккаунту",
        });
    };

    const handleCopyReferral = () => {
        navigator.clipboard.writeText('https://star-market.com/ref/user123');
        toast({
            title: "Скопировано",
            description: "Реферальная ссылка скопирована в буфер обмена",
        });
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
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Мой профиль</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Управляйте своим аккаунтом и просматривайте историю транзакций
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <div className="flex rounded-lg overflow-hidden mb-6 bg-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setTab('profile')}
                            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                                tab === 'profile' ? 'bg-customPurple text-white' : 'text-white/70'
                            }`}
                        >
                            <User size={18}/>
                            <span>Профиль</span>
                        </button>
                        <button
                            onClick={() => setTab('history')}
                            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                                tab === 'history' ? 'bg-customPurple text-white' : 'text-white/70'
                            }`}
                        >
                            <History size={18}/>
                            <span>История</span>
                        </button>
                    </div>

                    {tab === 'profile' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            <StarCard className="mb-6">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-24 h-24 rounded-full bg-customMidBlue mb-4 flex items-center justify-center">
                                        {WebApp.initDataUnsafe.user?.photo_url ? (
                                            <img
                                                src={WebApp.initDataUnsafe.user.photo_url}
                                                alt="User Avatar"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <User size={40} className="text-white"/>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold mb-1">{WebApp.initDataUnsafe.user.first_name}</h2>
                                    <p className="text-white/70 text-sm mb-4">@{WebApp.initDataUnsafe.user.username}</p>
                                    <TonConnectButton className={`mb-4`}/>

                                    <div className="w-full h-0.5 bg-white/10 my-4"></div>

                                    <div className="w-full gap-4">
                                        <div className="bg-white/5 rounded-lg p-4 text-center">
                                            <div
                                                className="flex items-center justify-center gap-1 text-yellow-300 mb-1">
                                                <Star size={16} fill="rgba(253, 224, 71, 0.5)"/>
                                                <span className="font-bold">Куплено</span>
                                            </div>
                                            <p className="text-2xl font-bold">{totalBought}</p>
                                        </div>

                                        {/*<div className="bg-white/5 rounded-lg p-4 text-center">*/}
                                        {/*    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">*/}
                                        {/*        <DollarSign size={16}/>*/}
                                        {/*        <span className="font-bold">Продано</span>*/}
                                        {/*    </div>*/}
                                        {/*    <p className="text-2xl font-bold">{totalSold}</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </StarCard>

                            {/* Referral Program Card */}
                            <StarCard className="mb-6 border border-customPurple/30">
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-customPurple/20 flex items-center justify-center">
                                        <Share2 className="text-customPurple" size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Реферальная программа</h3>
                                        <p className="text-xs text-white/70">Приглашайте друзей и получайте бонусы</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-white/5 mb-4">
                                    <p className="text-sm font-medium mb-1">Ваш бонус:</p>
                                    <p className="text-xl font-bold text-green-400">50% от прибыли</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-white/70">Ваша реферальная ссылка:</p>
                                    <div className="flex">
                                        <div
                                            className="flex-1 bg-white/5 truncate rounded-l-lg p-2 text-xs border border-white/10">
                                            https://star-market.com/ref/user123
                                        </div>
                                        <button
                                            onClick={handleCopyReferral}
                                            className="bg-customPurple text-white px-3 rounded-r-lg text-xs"
                                        >
                                            Копировать
                                        </button>
                                    </div>
                                </div>
                            </StarCard>
                        </motion.div>
                    )}

                    {tab === 'history' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            <StarCard className="mb-6">
                                <h3 className="text-lg font-medium mb-4">История операций</h3>

                                {isLoading ? (
                                    <div className="flex items-center justify-center p-6">
                                        <Loader className="animate-spin text-customPurple w-8 h-8"/>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 transition-all hover:bg-white/10"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            transaction.type === 'buy'
                                                                ? 'bg-yellow-500/20'
                                                                : 'bg-green-500/20'
                                                        }`}
                                                    >
                                                        {transaction.type === 'buy' ? (
                                                            <Star size={16} className="text-yellow-300"/>
                                                        ) : (
                                                            <DollarSign size={16} className="text-green-400"/>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {transaction.type === 'buy' ? 'Покупка' : 'Продажа'} {transaction.amount} звезд
                                                        </div>
                                                        <div className="text-xs text-white/50">{transaction.date}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-bold ${
                                                        transaction.type === 'buy'
                                                            ? 'text-red-400'
                                                            : 'text-green-400'
                                                    }`}>
                                                        {transaction.type === 'buy' ? '-' : '+'}{transaction.price}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </StarCard>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;