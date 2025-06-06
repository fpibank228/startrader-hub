
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './use-toast';
import {apiService} from "@/utils/api.ts";

export const useTonPrice = () => {
  const [tonPrice, setTonPrice] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTonPrice = async () => {
      try {
        const response = await apiService.getTonRateUsd();
        const price = response.data.rates.TON.prices.USD;
        setTonPrice(price);
      } catch (error) {
        console.error('Ошибка при получении цены TON:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось получить текущую цену TON.',
          variant: 'destructive',
        });
      }
    };

    fetchTonPrice();
  }, [toast]);

  return tonPrice;
};
