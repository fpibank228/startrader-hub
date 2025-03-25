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
    async getTonRate() {
        try {
            return await tonApi.get('/rates?tokens=ton&currencies=usd');
        } catch (error) {
            console.error('TON API Error:', error);
            throw error;
        }
    },

    async getMyTransactions() {
        try {
            return await mainApi.post('/get_my_transaction');
        } catch (error) {
            console.error('Transactions API Error:', error);
            throw error;
        }
    },

    async checkUsername(username: string, stars: number) {
        try {
            return await mainApi.post('/stars/search', {username, stars});
        } catch (error) {
            console.error('Username check API Error:', error);
            throw error;
        }
    },

    async generatePayLink(amount: number, to_user: string) {
        try {
            return await mainApi.post('/pay/link', {amount, to_user});
        } catch (error) {
            console.error('Generate link check API Error:', error);
            throw error;
        }
    },

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
            const response = await mainApi.post('/send_transaction', {
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