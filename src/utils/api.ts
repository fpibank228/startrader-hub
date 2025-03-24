import axios from 'axios';
import WebApp from '@twa-dev/sdk';

const tonApi = axios.create({
    baseURL: 'https://tonapi.io/v2',
    headers: {
        'Content-Type': 'application/json',
    }
});

const mainApi = axios.create({
    baseURL: 'https://starsbuy.space/api/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Добавляем interceptor для авторизации
mainApi.interceptors.request.use(config => {
    if (WebApp.initData) {
        config.headers.auth = WebApp.initData;
    }
    return config;
});

export const apiService = {
    // Получение курса TON
    async getTonRate() {
        try {
            const response = await tonApi.get('/rates?tokens=ton&currencies=usd');
            return response.data;
        } catch (error) {
            console.error('TON API Error:', error);
            throw error;
        }
    },

    // Получение списка транзакций
    async getMyTransactions() {
        try {
            const response = await mainApi.post('/get_my_transaction');
            return response.data;
        } catch (error) {
            console.error('Transactions API Error:', error);
            throw error;
        }
    },

    // Проверка имени пользователя
    async checkUsername(username: string, stars: number) {
        try {
            const response = await mainApi.post('/stars/search', { username, stars });
            return response.data;
        } catch (error) {
            console.error('Username check API Error:', error);
            throw error;
        }
    },

    // Отправка транзакции
    async sendTransaction(
        {
            walletAddress,
            amount,
            comment,
            currency,
            timestamp,
            hash,
            stars_for_username
        }
    ) {
        try {
            const response = await mainApi.post('/send_transaction',  {
                walletAddress: walletAddress,
                amount: amount,
                comment: comment,
                currency: currency,
                timestamp: timestamp,
                hash: hash,
                stars_for_username: stars_for_username,
            },);
            return response.data;
        } catch (error) {
            console.error('Send transaction API Error:', error);
            throw error;
        }
    }
};