interface RouletteItem {
    chance: string;
    link: string;
    title: string;
}

// Data for the basic roulette
export const basicRouletteItems: RouletteItem[] = [
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
        'title': 'Homemade Cake',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
        'title': 'Diamond Ring'
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
        'title': 'Eternal Rose',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json',
        'title': 'Cooke Heart',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json',
        'title': 'Party sparkler',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/partysparkler-42952.lottie.json',
        'title': 'Party sparkler',
    },
    {
        'chance': 'yes',
        'link': 'https://nft.fragment.com/gift/signetring-7628.lottie.json',
        'title': 'Signet ring',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/tamagadget-36375.lottie.json',
        'title': 'Tama Gadget',
    },
    {
        'chance': 'no',
        'link': 'https://nft.fragment.com/gift/tamagadget-16850.lottie.json',
        'title': 'Tama Gadget',
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
