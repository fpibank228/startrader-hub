
import {DollarSign, Wallet, RussianRuble} from 'lucide-react';
import StarCard from '../StarCard';
import {motion} from 'framer-motion';
import React from "react";

interface PaymentDetailsCardProps {
    selectedStars: number;
    calculatePrice: () => { usd: string; ton: string; rub: string };
}

const PaymentDetailsCard = ({selectedStars, calculatePrice}: PaymentDetailsCardProps) => {
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3}}
        >
            <StarCard className="mb-6 border border-customPurple/50">
                <h3 className="text-lg font-medium mb-4">Ваш заказ</h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Количество звезд:</span>
                        <span className="font-medium flex items-center gap-1">
              {selectedStars}
                            <svg width="18" height="18" viewBox="0 0 14 15" fill="#fde047"
                                 xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                    fill="ddd"></path>
          </svg>            </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Стоимость в USD:</span>
                        <span className="font-medium flex items-center gap-1">
              ${calculatePrice().usd}
                            <DollarSign size={14}/>
            </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-white/70">К оплате в TON:</span>
                        <span className="font-medium text-white flex items-center gap-1">
              {calculatePrice().ton} TON
            </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">К оплате в рублях:</span>
                        <span className="font-medium text-white flex items-center gap-1">
              {calculatePrice().rub} ₽
            </span>
                    </div>
                </div>
            </StarCard>
        </motion.div>
    );
};

export default PaymentDetailsCard;
