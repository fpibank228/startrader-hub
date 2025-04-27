
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {History, User, DollarSign, Share2, Wallet, Loader, Gift, CreditCard, Copy} from 'lucide-react';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import {useToast} from '../hooks/use-toast';
import {TonConnectButton} from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import {apiService} from "@/utils/api.ts";
import {initUtils} from '@tma.js/sdk';
import LottieItem from '../components/roulette/LottieItem';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useNavigate} from 'react-router-dom';

interface Transaction {
    id: number;
    type: 'buy' | 'sell';
    amount: number;
    date: string;
    price: string;
}

interface GiftItem {
    url: string;
    title: string;
    price: number;
    model?: string;
    gift_id?: string;
    name?: string;
    symbol?: string;
    backdrop?: string;
    collectible_id?: number;
}

interface DefaultGiftItem {
    _id: string;
    gift_title: string;
    username: string;
    user_id: number;
    gift_price: number;
}

const Profile = () => {
    const [tab, setTab] = useState<'profile' | 'history' | 'gifts'>('profile');
    const [walletConnected, setWalletConnected] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userInfo, setUserInfo] = useState({"ref_user": 0, "user_details": {"balance": 0}});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
    const [selectedDefaultGift, setSelectedDefaultGift] = useState<DefaultGiftItem | null>(null);
    const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
    const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const {toast} = useToast();
    const isFullscreen = WebApp.isFullscreen;
    const navigate = useNavigate();

    const [gifts, setGifts] = useState<GiftItem[]>([]);
    const [defaultGifts, setDefaultGifts] = useState<DefaultGiftItem[]>([]);

    const [shareLink, setShareLink] = useState('https://t.me/amnyamstarsbot/app');

    useEffect(() => {
        const userIdParam = WebApp.initDataUnsafe.user?.id;
        setShareLink(`https://t.me/amnyamstarsbot/app?startapp=${userIdParam}`);
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getUserInfo();
            const data = await response.data;
            setTransactions(data["transactions"]);
            setUserInfo(data["user_info"]);
            setGifts(data["gifts"]);
            setDefaultGifts(data["default_gifts"]);
            setEarnedAmount(data["ref_balance"]);
            console.log(userInfo);
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
    const default_gifts = [
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168103777563050263/1x/000.png',
            'title': 'Rose',
            'price': 0.55,
        },
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168043875654172773/1x/000.png',
            'title': 'Champ',
            'price': 0.45,
        },
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170144170496491616/1x/000.png',
            'title': 'Cake',
            'price': 0.85,
        },
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170233102089322756/1x/000.png',
            'title': 'Bear',
            'price': 1
        },
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170250947678437525/1x/000.png',
            'title': 'Gift',
            'price': 1,
        },
        {
            'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170314324215857265/1x/000.png',
            'title': 'Flowers',
            'price': 2.25,
        }
    ]

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

    const handleTopUpClick = () => {
        setIsTopUpDialogOpen(true);
    };

    const handleCryptoTopUpClick = () => {
        setIsTopUpDialogOpen(false);
        navigate('/topup');
    };

    const handleRublePaymentClick = () => {
        setIsTopUpDialogOpen(false);
        navigate('/topup/rubles');
    };

    const withdrawClick = async () => {
        if (selectedGift != null) {
            await apiService.withdrawGift(selectedGift.gift_id)
        } else {
            await apiService.withdrawDefaultGift(selectedDefaultGift.gift_title)
        }
        setSelectedDefaultGift(null);
        setSelectedGift(null);
        toast({
            title: 'Успешно',
            description: 'Подарок добавлен в очередь для вывода.',
            variant: 'default',
        });
        try {
            const response = await apiService.getUserInfo();
            const data = await response.data;
            setTransactions(data["transactions"]);
            setUserInfo(data["user_info"]);
            setGifts(data["gifts"]);
            setDefaultGifts(data["default_gifts"]);
            setEarnedAmount(data["ref_balance"]);
            console.log(userInfo);
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
    }

    const handleGiftTopUpClick = () => {
        setIsTopUpDialogOpen(false);
        setIsGiftDialogOpen(true);
    };

    const handleShareLink = () => {
        const utils = initUtils();
        utils.shareURL(shareLink,
            '😁Привет! Добро пожаловать в нашего бота для покупки звёзд и казино!\n'
        );
    };

    const handleGiftClick = (gift: GiftItem) => {
        setSelectedDefaultGift(null)
        setSelectedGift(gift);
    };

    const handleDefaultGiftClick = (gift: DefaultGiftItem) => {
        setSelectedGift(null);
        setSelectedDefaultGift(gift);
    };
    const handleCloseGiftDetail = () => {
        setSelectedDefaultGift(null);
        setSelectedGift(null);
    };

    const handleSellGift = async () => {
        try {
            await apiService.sellGift(selectedGift.gift_id)
            setGifts(prevGifts => prevGifts.filter(gift => gift.gift_id !== selectedGift.gift_id));
            const newUserInfo = userInfo
            newUserInfo.user_details['balance'] = userInfo.user_details['balance'] + selectedGift.price
            console.log(newUserInfo);
            setUserInfo(newUserInfo)
            toast({
                title: 'Успешно',
                description: 'Подарок успешно продан',
                variant: 'default',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка, обратитесь в службу поддержки',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
        setSelectedGift(null);
    };

    const handleSellDefaultGift = async () => {
        try {
            await apiService.sellDefaultGift(selectedDefaultGift._id)
            fetchUserData()
            toast({
                title: 'Успешно',
                description: 'Подарок успешно продан',
                variant: 'default',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка, обратитесь в службу поддержки',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
        setSelectedDefaultGift(null);
        setSelectedGift(null);
    };

    const copyGiftUsername = () => {
        navigator.clipboard.writeText('@giftchance');
        toast({
            title: "Скопировано",
            description: "Имя пользователя скопировано в буфер обмена",
        });
    };

    const getGiftLink = (title) => {
        const gift = default_gifts.find(gift => gift.title === title);
        return gift ? gift.link : 'https://placehold.co/100x100/purple/white?text=Prize'; // Fallback
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
                            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                                tab === 'profile' ? 'bg-customPurple text-white' : 'text-white/70'
                            }`}
                        >
                            <User size={18}/>
                            <span>Профиль</span>
                        </button>
                        <button
                            onClick={() => setTab('gifts')}
                            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                                tab === 'gifts' ? 'bg-customPurple text-white' : 'text-white/70'
                            }`}
                        >
                            <Gift size={18}/>
                            <span>Подарки</span>
                        </button>
                        <button
                            onClick={() => setTab('history')}
                            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 transition-all duration-300 ${
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
                                    <h2 className="text-xl font-bold mb-1">{WebApp.initDataUnsafe.user ? WebApp.initDataUnsafe.user.first_name : "error"}</h2>
                                    <p className="text-white/70 text-sm mb-4">@{WebApp.initDataUnsafe.user ? WebApp.initDataUnsafe.user.username : "error"}</p>
                                    <TonConnectButton className={`mb-4`}/>

                                    {/* Balance display card */}
                                    <div
                                        className="w-full bg-gradient-to-r from-customPurple to-customMidBlue rounded-lg p-4 mb-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                    stroke="white" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path
                                                    d="M15 9C15 8 14 6 12 6C10 6 9 7.5 9 9C9 10.5 10 11 11 11.5C12 12 13 12.5 13 14C13 15.5 12 17 10 17C8 17 7 15.5 7 14.5"
                                                    stroke="white" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path d="M12 5V6" stroke="white" strokeWidth="2" strokeLinecap="round"
                                                      strokeLinejoin="round"/>
                                                <path d="M12 18V19" stroke="white" strokeWidth="2" strokeLinecap="round"
                                                      strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="text-white/70 mb-1 font-bold text-xl">Баланс</h1>
                                            <div className="flex items-center justify-between">
                                                <h3 className="flex gap-1 text-2xl font-bold text-white">{userInfo.user_details.balance}
                                                    <svg width="32" height="32" viewBox="0 0 14 15" fill="#546CF3"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                              d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                              fill="currentColor"></path>
                                                    </svg>
                                                </h3>
                                                <Button
                                                    onClick={handleTopUpClick}
                                                    variant="secondary"
                                                    className="relative bg-white/20 text-white hover:bg-white/30 px-4 py-2"
                                                >
                                                    <CreditCard size={16} className="mr-1"/>
                                                    Пополнить
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-0.5 bg-white/10 my-4"></div>

                                    <div className="w-full gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-4 text-center flex items-center justify-center">
                                                <div>
                                                    <p className="text-4xl font-bold">50%</p>
                                                    <p className="text-base text-white/70">твой процент</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="bg-white/5 rounded-lg p-4">
                                                    <div className="flex items-center justify-center gap-1 text-blue-50">
                                                        <span className="font-bold">{userInfo['ref_user'] || '0'} приглашено</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 rounded-lg p-4 relative group border-white/20">
                                                    <div className="flex flex-col items-center justify-center gap-1 text-blue-50/50">
                                                        <span className="font-bold text-center text-white/80">{userInfo['user_details']['ref_balance']} TON</span>
                                                        <span className="text-sm text-white/80">заработано</span>
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
                                              fill="currentColor"></path>
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
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                        ) : (
                                                            <DollarSign size={16} className="text-green-500"/>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {transaction.type === 'buy'
                                                                ? 'Покупка звезд'
                                                                : 'Продажа звезд'}
                                                        </p>
                                                        <p className="text-xs text-white/70">
                                                            {new Date(transaction.date).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-medium ${
                                                        transaction.type === 'buy'
                                                            ? 'text-yellow-300'
                                                            : 'text-green-500'
                                                    }`}>
                                                        {transaction.type === 'buy' ? '+' : '-'}{transaction.amount}
                                                    </p>
                                                    <p className="text-xs text-white/70">{transaction.price} TON</p>
                                                </div>
                                            </div>
                                        ))}
                                        {transactions.length === 0 && (
                                            <div className="text-center py-10 text-white/50">
                                                <p>Операций пока нет</p>
                                            </div>
                                        )}
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
                            <div className="text-center mb-6">
                                <div className="bg-white/5 rounded-lg p-4 mb-4 mx-auto max-w-xs">
                                    <p className="text-sm text-white/70 mb-1">Подарков у вас</p>
                                    <p className="text-2xl font-bold">{gifts.length + defaultGifts.length}</p>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center p-10">
                                    <Loader className="animate-spin text-customPurple w-10 h-10"/>
                                </div>
                            ) : (
                                <>
                                    {gifts.length + defaultGifts.length > 0 ? (
                                        <>
                                            <div className="mb-6">
                                                <h3 className="font-medium mb-3">Ваши подарки</h3>

                                                <div className="grid grid-cols-3 gap-2">
                                                    {gifts.map((gift, index) => (
                                                        <div
                                                            key={`gift-${index}`}
                                                            onClick={() => handleGiftClick(gift)}
                                                            className="bg-white/5 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-white/10 transition-colors"
                                                        >
                                                            <div
                                                                className="w-full aspect-square mb-2 bg-gradient-to-br from-purple-500/30 to-customPurple/10 rounded-lg flex items-center justify-center overflow-hidden">
                                                                <img
                                                                    src={gift.url || "https://placehold.co/100"}
                                                                    alt={gift.title}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <p className="text-xs font-medium truncate w-full text-center">{gift.title}</p>
                                                            <p className="text-xs text-white/70">{gift.price}
                                                                <svg width="12" height="12" viewBox="0 0 14 15"
                                                                     fill="#FDE047" className="inline ml-0.5"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                                          fill="currentColor"></path>
                                                                </svg>
                                                            </p>
                                                        </div>
                                                    ))}

                                                    {defaultGifts.map((gift, index) => (
                                                        <div
                                                            key={`default-gift-${index}`}
                                                            onClick={() => handleDefaultGiftClick(gift)}
                                                            className="bg-white/5 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-white/10 transition-colors"
                                                        >
                                                            <div
                                                                className="w-full aspect-square mb-2 bg-gradient-to-br from-purple-500/30 to-customPurple/10 rounded-lg flex items-center justify-center overflow-hidden">
                                                                <img
                                                                    src={getGiftLink(gift.gift_title)}
                                                                    alt={gift.gift_title}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <p className="text-xs font-medium truncate w-full text-center">{gift.gift_title}</p>
                                                            <p className="text-xs text-white/70">{gift.gift_price}
                                                                <svg width="12" height="12" viewBox="0 0 14 15"
                                                                     fill="#FDE047" className="inline ml-0.5"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                                          fill="currentColor"></path>
                                                                </svg>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <div className="bg-white/5 rounded-lg p-8 text-center">
                                            <p className="text-white/70 mb-3">У вас еще нет подарков</p>
                                            <p className="text-sm text-white/50">
                                                Подарки можно получить в рулетке или приобрести другим способом
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
                <DialogContent className="bg-gradient-to-b from-customMidBlue to-customPurple/90 border-none">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center">Пополнить баланс</DialogTitle>
                        <DialogDescription className="text-center text-white/70">
                            Выберите способ пополнения
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <Button onClick={handleCryptoTopUpClick} className="bg-customPurple hover:bg-customPurple/80">
                            <Wallet size={16} className="mr-2"/>
                            TON Криптовалюта
                        </Button>
                        <Button onClick={handleRublePaymentClick} className="bg-blue-600 hover:bg-blue-700">
                            <CreditCard size={16} className="mr-2"/>
                            Рубли
                        </Button>
                        <Button onClick={handleGiftTopUpClick} className="bg-pink-600 hover:bg-pink-700">
                            <Gift size={16} className="mr-2"/>
                            Подарки
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog for gift details */}
            <Dialog open={selectedGift !== null || selectedDefaultGift !== null}
                    onOpenChange={handleCloseGiftDetail}>
                <DialogContent className="bg-customDarkBg border-customPurple/40 text-white max-w-sm mx-auto">
                    {selectedGift && (
                        <>
                            <DialogHeader>
                                <DialogTitle
                                    className="text-center">{selectedGift.title || selectedGift.name || 'Подарок'}</DialogTitle>
                            </DialogHeader>

                            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500/30 to-customPurple/10 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src={selectedGift.url || 'https://placehold.co/200'}
                                    alt={selectedGift.title || selectedGift.name || 'Подарок'}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="text-center mb-4">
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    {selectedGift.price}
                                    <svg width="18" height="18" viewBox="0 0 14 15" fill="#FDE047"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                              fill="currentColor"></path>
                                    </svg>
                                </p>

                                {selectedGift.symbol && (
                                    <p className="text-white/70 mt-1">{selectedGift.symbol}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={withdrawClick} className="bg-customPurple hover:bg-customPurple/80">
                                    Вывести
                                </Button>
                                <Button onClick={handleSellGift} className="bg-white/10 hover:bg-white/20">
                                    Продать
                                </Button>
                            </div>
                        </>
                    )}

                    {selectedDefaultGift && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-center">{selectedDefaultGift.gift_title}</DialogTitle>
                            </DialogHeader>

                            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500/30 to-customPurple/10 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src={getGiftLink(selectedDefaultGift.gift_title)}
                                    alt={selectedDefaultGift.gift_title}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="text-center mb-4">
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    {selectedDefaultGift.gift_price}
                                    <svg width="18" height="18" viewBox="0 0 14 15" fill="#FDE047"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                              fill="currentColor"></path>
                                    </svg>
                                </p>

                                <div className="flex items-center justify-center gap-1 mt-1 text-white/70">
                                    <span>От: @{selectedDefaultGift.username}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={withdrawClick} className="bg-customPurple hover:bg-customPurple/80">
                                    Вывести
                                </Button>
                                <Button onClick={handleSellDefaultGift} className="bg-white/10 hover:bg-white/20">
                                    Продать
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog for Gift topup */}
            <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
                <DialogContent className="bg-gradient-to-b from-customMidBlue to-customPurple/90 border-none">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center">Пополнить подарками</DialogTitle>
                        <DialogDescription className="text-center text-white/70">
                            Для пополнения отправьте подарок пользователю
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <div className="bg-white/10 w-full p-4 rounded-lg flex items-center justify-between">
                            <span className="font-mono">@giftchance</span>
                            <Button variant="ghost" size="sm" onClick={copyGiftUsername} className="hover:bg-white/10">
                                <Copy size={16}/>
                            </Button>
                        </div>
                        <p className="text-sm text-white/70 text-center">
                            Перешлите желаемый подарок на указанный выше аккаунт, и мы автоматически пополним ваш
                            баланс.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
