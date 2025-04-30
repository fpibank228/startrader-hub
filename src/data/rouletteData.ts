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
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '350 Stars',
        'price': 350,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '500 Stars',
        'price': 500,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '1000 Stars',
        'price': 1000,
    },
]

export const rouletteOptions = [
    {
        id: 'basic',
        title: 'Обычная рулетка',
        description: 'Классическая рулетка с базовыми призами',
        imageBg: '/src/assets/images/roulette/basic.jpg',
        path: '/roulette/basic'
    },
    {
        id: 'middle',
        title: 'Средняя рулетка',
        description: 'Рулетка с более ценными призами',
        imageBg: '/src/assets/images/roulette/middle.jpg',
        path: '/roulette/middle'
    },
    {
        id: 'big',
        title: 'Крупная рулетка',
        description: 'Рулетка с премиальными призами',
        imageBg: '/src/assets/images/roulette/big.jpg',
        path: '/roulette/big'
    },
    {
        id: 'nft',
        title: 'NFT рулетка',
        description: 'Выиграйте уникальные NFT предметы',
        imageBg: '/src/assets/images/roulette/nft.jpg',
        path: '/roulette/nft'
    },
    {
        id: 'upgrade',
        title: 'Апгрейд',
        description: 'Улучшите свои существующие предметы',
        imageBg: '/src/assets/images/roulette/upgrade.jpg',
        path: '/roulette/upgrade',
        disabled: false
    }
];

export const default_gifts1 = [
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
]

export interface PrizeGridItem {
    chance?: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
    isWin?: boolean;
}

export const prizeGridData: PrizeGridItem[] = [
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170145012310081615/2x/000.png',
        title: 'Heart',
        price: 15,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170233102089322756/1x/000.png',
        title: 'Bear',
        price: 15
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168103777563050263/1x/000.png',
        title: 'Rose',
        price: 25,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170250947678437525/2x/000.png',
        title: 'Gift',
        price: 25,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170144170496491616/1x/000.png',
        title: 'Cake',
        price: 50,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170564780938756245/2x/000.png',
        title: 'Rocket',
        price: 50,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170314324215857265/1x/000.png',
        title: 'Flowers',
        price: 50,
    },
    {
        link: 'https://easygift.site/assets/ring-CaIX7Rlr.webp',
        title: 'Ring',
        price: 100,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168043875654172773/1x/000.png',
        title: 'Champ',
        price: 100,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170521118301225164/2x/000.png',
        title: 'Dimond',
        price: 100,
    },
    {
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5782984811920491178/2x/000.png',
        title: '150 Stars',
        price: 150,
    },
];


export const prizeGridDataMiddle: PrizeGridItem[] =  [
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
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '150 Stars',
        'price': 150,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '350 Stars',
        'price': 350,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '500 Stars',
        'price': 500,
    },
]


export const prizeGridDataBig: PrizeGridItem[] = [
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
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '150 Stars',
        'price': 150,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '350 Stars',
        'price': 350,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '500 Stars',
        'price': 500,
    },
    {
        'link': 'https://blog.invitemember.com/content/images/2024/07/Telegram-Stars.png',
        'title': '1000 Stars',
        'price': 1000,
    },
]