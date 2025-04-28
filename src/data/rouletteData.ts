interface RouletteItem {
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

// Static gifts for the basic roulette
export const staticGiftItems: RouletteItem[] = [
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170145012310081615/2x/000.png',
        'title': 'Heart',
        'price': 15,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170233102089322756/1x/000.png',
        'title': 'Bear',
        'price': 15
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168103777563050263/1x/000.png',
        'title': 'Rose',
        'price': 25,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170250947678437525/2x/000.png',
        'title': 'Gift',
        'price': 25,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170144170496491616/1x/000.png',
        'title': 'Cake',
        'price': 50,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170564780938756245/2x/000.png',
        'title': 'Rocket',
        'price': 50,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170314324215857265/1x/000.png',
        'title': 'Flowers',
        'price': 50,
    },
    {
        'link': 'https://easygift.site/assets/ring-CaIX7Rlr.webp',
        'title': 'Ring',
        'price': 100,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168043875654172773/1x/000.png',
        'title': 'Champ',
        'price': 100,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170521118301225164/2x/000.png',
        'title': 'Dimond',
        'price': 100,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5782984811920491178/2x/000.png',
        'title': '150 Stars',
        'price': 150,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5782984811920491178/2x/000.png',
        'title': '150 Stars',
        'price': 350,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5782984811920491178/2x/000.png',
        'title': '150 Stars',
        'price': 500,
    },
    {
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5782984811920491178/2x/000.png',
        'title': '150 Stars',
        'price': 1000,
    },
]

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
        path: '/roulette/nft'
    },
    {
        id: 'upgrade',
        title: 'Апгрейд',
        description: 'Улучшите свои существующие предметы',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        path: '/roulette/upgrade',
        disabled: false // Enable this option
    }
];
