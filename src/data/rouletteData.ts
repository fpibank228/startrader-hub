
interface RouletteItem {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
    isWin?: boolean;
}

const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const basicRouletteItems: RouletteItem[] = [
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
        'title': 'Homemade Cake',
        'price': 0.25,
        'model': 'Basic 15%',
        'symbol': 'Gold 5%',
        'backdrop': 'Blue 10%',
        'number': getRandomNumber(1, 200000)
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
        'title': 'Diamond Ring',
        'price': 1.5,
        'model': 'Premium 5%',
        'symbol': 'Silver 10%', 
        'backdrop': 'Purple 5%',
        'number': getRandomNumber(1, 200000)
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
        'title': 'Eternal Rose',
        'price': 0.7,
        'model': 'Standard 10%',
        'symbol': 'Bronze 15%',
        'backdrop': 'Red 8%',
        'number': getRandomNumber(1, 200000)
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json',
        'title': 'Cooke Heart',
        'price': 0.3,
        'model': 'Basic 20%',
        'symbol': 'Copper 20%',
        'backdrop': 'Green 12%',
        'number': getRandomNumber(1, 200000)
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json',
        'title': 'Party sparkler',
        'price': 0.2,
        'model': 'Basic 25%',
        'symbol': 'Bronze 25%',
        'backdrop': 'Yellow 15%',
        'number': getRandomNumber(1, 200000)
    },
    {
        'chance': 'yes',
        'link': 'https://nft.fragment.com/gift/signetring-7628.lottie.json',
        'title': 'Signet ring',
        'price': 1.0,
        'model': 'Premium 5%',
        'symbol': 'Gold 3%',
        'backdrop': 'Purple 5%',
        'number': getRandomNumber(1, 200000),
        'isWin': true
    },
];

export const rouletteOptions = [
    {
        id: 'basic',
        title: 'Обычная рулетка',
        description: 'Испытайте свою удачу с шансом выигрыша',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        path: '/roulette/basic'
    },
    {
        id: 'nft',
        title: 'NFT рулетка',
        description: 'Выиграйте уникальные NFT предметы',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    },
    {
        id: 'upgrade',
        title: 'Апгрейд',
        description: 'Улучшите свои существующие предметы',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        disabled: true
    }
];
