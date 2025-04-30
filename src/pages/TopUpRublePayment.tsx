import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import WebApp from '@twa-dev/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from "lucide-react";
import { apiService } from "@/utils/api.ts";

const TopUpRublePayment = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [amount, setAmount] = useState<string>('');
    const [starsToReceive, setStarsToReceive] = useState<number>(0);
    const isFullscreen = WebApp.isFullscreen;
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

    useEffect(() => {
        const numericAmount = parseFloat(amount) || 0;
        // Примерный расчет - можно изменить коэффициент
        setStarsToReceive(numericAmount);
    }, [amount]);

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, введите сумму пополнения",
                variant: "destructive",
            });
            return;
        }
        try {
            const response = await apiService.topUpRubles(parseFloat(amount));
            setPaymentUrl(response.data.data.url);
        } catch (error) {
            console.error("Error fetching payment URL:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось получить ссылку для оплаты. Попробуйте еще раз.",
                variant: "destructive",
            });
        }
    };

    const handleOpenPayment = () => {
        if (paymentUrl) {
            window.open(paymentUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Проверка минимального значения
    const isButtonDisabled = !amount || parseFloat(amount) < 50;

    return (
        <div className="relative min-h-screen pt-4 pb-24" style={{
            marginTop: isFullscreen ? '80px' : '0px',
        }}>
            <StarBackground />

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Пополнение баланса</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Введите сумму пополнения в рублях
                    </p>
                    {/* Текст с минимальной суммой */}
                    <p className="text-xs text-red-500 mt-2">
                        Минимальная сумма пополнения: 50 рублей
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <StarCard className="mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Сумма в рублях
                                </label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Введите сумму"
                                    className="bg-white/10"
                                />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg">
                                <p className="text-sm text-white/70 mb-1">Вы получите:</p>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    {starsToReceive.toFixed(2)}
                                    <svg width="22" height="22" viewBox="0 0 14 15" fill="#546CF3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                              fill="currentColor"/>
                                    </svg>
                                </p>
                            </div>

                            {/* Кнопка генерации ссылки */}
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isButtonDisabled || !!paymentUrl} // Отключена, если есть paymentUrl
                            >
                                <ExternalLink size={18} />
                                Сгенерировать ссылку
                            </Button>

                            {/* Кнопка перехода к оплате */}
                            <Button
                                onClick={handleOpenPayment}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={!paymentUrl} // Отключена, если paymentUrl отсутствует
                            >
                                <ExternalLink size={18} />
                                Перейти к оплате
                            </Button>
                        </div>
                    </StarCard>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/profile')}
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

export default TopUpRublePayment;