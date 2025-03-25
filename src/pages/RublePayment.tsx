import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useToast} from '@/hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import {ExternalLink, Check, Loader2} from 'lucide-react';
import {apiService} from '@/utils/api';
import WebApp from '@twa-dev/sdk';

interface PaymentState {
    username: string;
    stars: number;
    price: string;
    transaction_id: string;
}

const RublePayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {toast} = useToast();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const isFullscreen = WebApp.isFullscreen;

    const state = location.state as PaymentState;

    useEffect(() => {
        if (!state?.username || !state?.stars || !state?.price) {
            toast({
                title: "Ошибка",
                description: "Недостаточно информации для оплаты. Вернитесь на предыдущую страницу.",
                variant: "destructive",
            });
            navigate('/buy');
            return;
        }

        // Имитация получения URL для оплаты с сервера
        const fetchPaymentUrl = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.generatePayLink(parseInt(state?.price || '0'), state?.username);
                setPaymentUrl(response.data.data.url);
                setIsLoading(false);
                state.transaction_id = response.data.data.id;
            } catch (error) {
                console.error("Error fetching payment URL:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось получить ссылку для оплаты. Попробуйте еще раз.",
                    variant: "destructive",
                });
                setIsLoading(false);
            }
        };

        fetchPaymentUrl();
    }, [state, navigate, toast]);

    const handleOpenPayment = () => {
        if (paymentUrl) {
            window.open(paymentUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const checkPaymentStatus = async () => {
        setIsChecking(true);
        try {
            // const response = await apiService.checkPayLink("3a18e085-7328-481b-526a-401a6d7e9db5");
            const response = await apiService.checkPayLink(state.transaction_id);
            console.log(response);
            setIsSuccess(true);
            toast({
                title: "Успешно!",
                description: "Оплата прошла успешно! Звезды начислены.",
                variant: "green",
            });
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            console.error("Error fetching payment URL:", error);
            toast({
                title: "Оплата не найдена",
                description: "Мы еще не получили подтверждение оплаты. Если вы уже оплатили, подождите немного и проверьте снова.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
        setIsChecking(false);

        // const isSuccessful = Math.random() > 0.5;
        //
        // if (isSuccessful) {
        //     setIsSuccess(true);
        //     toast({
        //         title: "Успешно!",
        //         description: "Оплата прошла успешно! Звезды начислены.",
        //         variant: "green",
        //     });
        // } else {
        //     toast({
        //         title: "Оплата не найдена",
        //         description: "Мы еще не получили подтверждение оплаты. Если вы уже оплатили, подождите немного и проверьте снова.",
        //         variant: "destructive",
        //     });
        // }
        //
        // setIsChecking(false);
    };

    return (
        <div
            className="relative min-h-screen pt-4 pb-24"
            style={{
                marginTop: isFullscreen ? '80px' : '0px',
            }}
        >
            <StarBackground/>

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Оплата заказа</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        {isSuccess
                            ? "Спасибо за покупку! Ваши звезды уже начислены."
                            : "Оплатите через банковскую карту и получите свои звезды."}
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <StarCard className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Детали заказа</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-white/70">Пользователь:</span>
                                <span className="font-medium">{state?.username || '-'}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/70">Звезды:</span>
                                <span className="font-medium flex items-center gap-1">
                  {state?.stars || '0'}
                                    <svg width="18" height="18" viewBox="0 0 14 15" fill="#fde047"
                                         xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                          fill="currentColor"></path>
                  </svg>
                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/70">Сумма к оплате:</span>
                                <span className="font-medium">{state?.price || '0'} ₽</span>
                            </div>

                            <div className="h-0.5 bg-white/10 my-4"></div>

                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-white/70"/>
                                    <p className="text-white/70 ml-2">Подготовка платежа...</p>
                                </div>
                            ) : isSuccess ? (
                                <div className="bg-green-500/20 p-4 rounded-lg flex items-center">
                                    <Check className="h-6 w-6 text-green-500 mr-2"/>
                                    <span className="text-green-400">Оплата успешно завершена!</span>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleOpenPayment}
                                        className="w-full py-3 px-6 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2 transition-duration-300"
                                    >
                                        <ExternalLink size={18}/>
                                        Перейти к оплате
                                    </button>

                                    <button
                                        onClick={checkPaymentStatus}
                                        disabled={isChecking}
                                        className={`w-full mt-4 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                                            isChecking
                                                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                                : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                    >
                                        {isChecking ? (
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        ) : (
                                            <Check size={18}/>
                                        )}
                                        {isChecking ? 'Проверка...' : 'Я оплатил, проверить'}
                                    </button>
                                </>
                            )}
                        </div>
                    </StarCard>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/buy')}
                            className="text-white/60 hover:text-white"
                        >
                            Вернуться назад
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RublePayment;
