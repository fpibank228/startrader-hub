import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {History, User, DollarSign, Share2, Wallet, Loader, Gift} from 'lucide-react';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import {useToast} from '../hooks/use-toast';
import {TonConnectButton} from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import {apiService} from "@/utils/api.ts";
import {initUtils} from '@tma.js/sdk';
import LottieItem from '../components/roulette/LottieItem';

interface Transaction {
    id: number;
    type: 'buy' | 'sell';
    amount: number;
    date: string;
    price: string;
}

interface GiftItem {
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
}

const Profile = () => {
    const [tab, setTab] = useState<'profile' | 'history' | 'gifts'>('profile');
    const [walletConnected, setWalletConnected] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userInfo, setUserInfo] = useState({"ref_user": 0});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
    const {toast} = useToast();
    const isFullscreen = WebApp.isFullscreen;

    const [gifts, setGifts] = useState<GiftItem[]>([
        {
            'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
            'title': 'Homemade Cake',
            'price': 0.25,
            'model': 'Basic 15%',
            'symbol': 'Gold 5%',
            'backdrop': 'Blue 10%',
            'number': Math.floor(Math.random() * 200000) + 1
        },
        {
            'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
            'title': 'Diamond Ring',
            'price': 1.5,
            'model': 'Premium 5%',
            'symbol': 'Silver 10%',
            'backdrop': 'Purple 5%',
            'number': Math.floor(Math.random() * 200000) + 1
        },
        {
            'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
            'title': 'Eternal Rose',
            'price': 0.7,
            'model': 'Standard 10%',
            'symbol': 'Bronze 15%',
            'backdrop': 'Red 8%',
            'number': Math.floor(Math.random() * 200000) + 1
        }
    ]);

    const [shareLink, setShareLink] = useState('https://t.me/amnyamstarsbot/app');

    useEffect(() => {
        const userIdParam = WebApp.initDataUnsafe.user?.id;
        setShareLink(`https://t.me/amnyamstarsbot/app?startapp=${userIdParam}`);
        fetchUserData()
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getUserInfo()
            const data = await response.data;
            setTransactions(data["transactions"]);
            setUserInfo(data["user_info"]);
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

    const earnedAmount = 0.00;
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

    const handleShareLink = () => {
        const utils = initUtils();
        utils.shareURL(shareLink,
            '😁Привет! Добро пожаловать в нашего бота для покупки звёзд и казино!\n'
            )
    }

    const handleGiftClick = (gift: GiftItem) => {
        setSelectedGift(gift);
    };

    const handleCloseGiftDetail = () => {
        setSelectedGift(null);
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
                        <button
                            onClick={() => setTab('gifts')}
                            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                                tab === 'gifts' ? 'bg-customPurple text-white' : 'text-white/70'
                            }`}
                        >
                            <Gift size={18}/>
                            <span>Подарки</span>
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
                                    <h2 className="text-xl font-bold mb-1">{WebApp.initDataUnsafe.user ? WebApp.initDataUnsafe.user.first_name : "error"}</h2>
                                    <p className="text-white/70 text-sm mb-4">@{WebApp.initDataUnsafe.user ? WebApp.initDataUnsafe.user.username : "error"}</p>
                                    <TonConnectButton className={`mb-4`}/>

                                    <div className="w-full h-0.5 bg-white/10 my-4"></div>

                                    <div className="w-full gap-4">
                                        <div
                                            className="grid grid-cols-2 gap-4">
                                            <div
                                                className="bg-white/5 rounded-lg p-4 text-center flex items-center justify-center">
                                                <div>
                                                    <p className="text-4xl font-bold">50%</p>
                                                    <p className="text-base text-white/70">твой процент</p>
                                                </div>
                                            </div>

                                            <div
                                                className="flex flex-col gap-4">
                                                <div className="bg-white/5 rounded-lg p-4">
                                                    <div
                                                        className="flex items-center justify-center gap-1 text-blue-50">
                                                        <span
                                                            className="font-bold">{userInfo['ref_user'] || '0'} приглашено</span>
                                                    </div>
                                                </div>

                                                <div
                                                    className="bg-white/5 rounded-lg p-4 relative group border border-dashed border-white/20">
                                                    <div
                                                        className="flex flex-col items-center justify-center gap-1 text-blue-50/50">
                                                        <span
                                                            className="font-bold text-center">{earnedAmount} TON</span>
                                                        <span className="text-sm text-white/30">заработано</span>

                                                        <div
                                                            className="absolute top-2 right-2 text-white/40 hover:text-white/60 transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                 height="16" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor">
                                                                <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                                                                <path d="M12 16v-4m0-4h.01" strokeWidth="2"
                                                                      strokeLinecap="round"/>
                                                            </svg>

                                                            <div
                                                                className="absolute hidden group-hover:block top-full right-0 mt-1 w-48 bg-black/90 text-white text-xs p-2 rounded-md shadow-lg z-10">
                                                                Эта функция находится в разработке!
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StarCard>

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

                                <div className="space-y-2">
                                    <p className="text-sm text-white/70">Ваша реферальная ссылка:</p>
                                    <div className="flex">
                                        <div
                                            className="flex-1 bg-white/5 truncate rounded-l-lg p-2 text-xs border border-white/10">
                                            {shareLink}
                                        </div>
                                        <button
                                            onClick={handleShareLink}
                                            className="bg-customPurple text-white px-3 rounded-r-lg text-xs"
                                        >
                                            Отправить
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
                            <div className="bg-white/5 rounded-lg p-4 text-center mb-6">
                                <div
                                    className="flex items-center justify-center gap-1 text-yellow-300 mb-1">
                                    <svg width="16" height="16" viewBox="0 0 14 15" fill="#fde047"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                              fill="ddd"></path>
                                    </svg>
                                    <span className="font-bold">Куплено</span>
                                </div>
                                <p className="text-2xl font-bold">{totalBought}</p>
                            </div>
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
                                                            <svg width="16" height="16" viewBox="0 0 14 15"
                                                                 fill="#fde047" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd"
                                                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                                      fill="ddd"></path>
                                                            </svg>) : (
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

                    {tab === 'gifts' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            <StarCard className="mb-6">
                                <h3 className="text-lg font-medium mb-4">Ваши подарки</h3>
                                
                                {gifts.length === 0 ? (
                                    <div className="text-center py-6 text-white/60">
                                        <Gift size={40} className="mx-auto mb-3 opacity-40" />
                                        <p>У вас пока нет подарков</p>
                                        <p className="text-sm mt-2">Выиграйте их в рулетке!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {gifts.map((gift, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
                                                onClick={() => handleGiftClick(gift)}
                                            >
                                                <div className="w-full aspect-square relative">
                                                    <LottieItem 
                                                        animationData={gift.link} 
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className="p-2 text-center">
                                                    <p className="text-xs font-medium truncate">{gift.title}</p>
                                                    <p className="text-yellow-400 text-xs">{gift.price} TON</p>
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

            {selectedGift && (
                <div 
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={handleCloseGiftDetail}
                >
                    <div 
                        className="bg-gradient-to-b from-customPurple/90 to-customMidBlue/90 rounded-2xl p-5 max-w-sm w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{selectedGift.title}</h3>
                            <button 
                                onClick={handleCloseGiftDetail}
                                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"/>
                                    <path d="m6 6 12 12"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="w-40 h-40 mx-auto mb-4">
                            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
                                <LottieItem 
                                    animationData={selectedGift.link} 
                                    className="w-full h-full"
                                    loop={true}
                                    autoplay={true}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-between mb-4">
                            <span className="text-yellow-400 font-bold">{selectedGift.price} TON</span>
                            {selectedGift.number && (
                                <span className="text-white/70 text-sm">#{selectedGift.number}</span>
                            )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            {selectedGift.model && (
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <span className="text-sm">Модель: <span className="text-white/80">{selectedGift.model}</span></span>
                                </div>
                            )}
                            
                            {selectedGift.symbol && (
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <span className="text-sm">Символ: <span className="text-white/80">{selectedGift.symbol}</span></span>
                                </div>
                            )}
                            
                            {selectedGift.backdrop && (
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <span className="text-sm">Фон: <span className="text-white/80">{selectedGift.backdrop}</span></span>
                                </div>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="py-2 rounded-lg bg-gradient-to-r from-customPurple/80 to-purple-900/80 hover:from-customPurple hover:to-purple-900 flex items-center justify-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
                                    <path d="M16.5 9.4 7.55 4.24"/>
                                    <polyline points="3.29 7 12 12 20.71 7"/>
                                    <line x1="12" y1="22" x2="12" y2="12"/>
                                    <circle cx="18.5" cy="15.5" r="2.5"/>
                                    <path d="M20.27 17.27 22 19"/>
                                </svg>
                                <span className="text-sm">Отправить</span>
                            </button>
                            
                            <button
                                className="py-2 rounded-lg bg-gradient-to-r from-customPurple/80 to-purple-900/80 hover:from-customPurple hover:to-purple-900 flex items-center justify-center gap-1"
                            >
                                <Wallet size={16} />
                                <span className="text-sm">Продать</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
