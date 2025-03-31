
interface RouletteItem {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;    // New field for model
    symbol?: string;   // New field for symbol
    backdrop?: string; // New field for backdrop
}

// Data for the basic roulette
export const basicRouletteItems: RouletteItem[] = [
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
        'title': 'Homemade Cake',
        'price': 0.25,
        'model': 'Basic 15%',
        'symbol': 'Gold 5%',
        'backdrop': 'Blue 10%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
        'title': 'Diamond Ring',
        'price': 1.5,
        'model': 'Premium 5%',
        'symbol': 'Silver 10%', 
        'backdrop': 'Purple 5%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
        'title': 'Eternal Rose',
        'price': 0.7,
        'model': 'Standard 10%',
        'symbol': 'Bronze 15%',
        'backdrop': 'Red 8%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json',
        'title': 'Cooke Heart',
        'price': 0.3,
        'model': 'Basic 20%',
        'symbol': 'Copper 20%',
        'backdrop': 'Green 12%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json',
        'title': 'Party sparkler',
        'price': 0.2,
        'model': 'Basic 25%',
        'symbol': 'Bronze 25%',
        'backdrop': 'Yellow 15%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/partysparkler-42952.lottie.json',
        'title': 'Party sparkler',
        'price': 0.2,
        'model': 'Basic 25%',
        'symbol': 'Copper 20%',
        'backdrop': 'Orange 10%'
    },
    {
        'chance': 'yes',
        'link': 'https://nft.fragment.com/gift/signetring-7628.lottie.json',
        'title': 'Signet ring',
        'price': 1.0,
        'model': 'Premium 5%',
        'symbol': 'Gold 3%',
        'backdrop': 'Purple 5%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/tamagadget-36375.lottie.json',
        'title': 'Tama Gadget',
        'price': 0.5,
        'model': 'Standard 10%',
        'symbol': 'Silver 7%',
        'backdrop': 'Blue 8%'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/tamagadget-16850.lottie.json',
        'title': 'Tama Gadget',
        'price': 0.5,
        'model': 'Standard 10%',
        'symbol': 'Silver 7%',
        'backdrop': 'Red 8%'
    },
];

// Data for the roulette types/options
export const rouletteOptions = [
    {
        id: 'basic',
        title: 'Обычная рулетка',
        description: 'Испытайте свою удачу с шансом выигрыша',
        icon: 'Star',
        imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        path: '/roulette/basic'
    },
    {
        id: 'nft',
        title: 'NFT рулетка',
        description: 'Выиграйте уникальные NFT предметы',
        icon: 'Star',
        imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        disabled: true
    },
    {
        id: 'upgrade',
        title: 'Апгрейд',
        description: 'Улучшите свои существующие предметы',
        icon: 'Star',
        imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        disabled: true
    }
];
