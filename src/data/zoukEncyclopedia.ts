export type EncyclopediaCategory = 'fundamentals' | 'history' | 'styles' | 'music' | 'eventFormats' | 'culture';

export interface EncyclopediaTerm {
  key: string;
  category: EncyclopediaCategory;
  relatedTerms?: string[];
  sources?: Array<{
    label: string;
    url: string;
  }>;
}

export const ZOUK_ENCYCLOPEDIA: EncyclopediaTerm[] = [
  {
    key: 'brazilianZouk',
    category: 'fundamentals',
    relatedTerms: ['lambada', 'lambazouk', 'zoukMusic'],
    sources: [
      { label: 'Wikipedia: Brazilian Zouk', url: 'https://en.wikipedia.org/wiki/Brazilian_zouk' },
      { label: 'Brazilian Zouk Council', url: 'https://www.brazilianzoukcouncil.com/' },
      { label: 'Zoukology', url: 'https://www.zoukology.com/' },
    ],
  },
  {
    key: 'lambada',
    category: 'fundamentals',
    relatedTerms: ['brazilianZouk', 'lambazouk'],
    sources: [
      { label: 'Wikipedia: Lambada', url: 'https://en.wikipedia.org/wiki/Lambada' },
      { label: 'Brazilian Zouk Council', url: 'https://www.brazilianzoukcouncil.com/' },
    ],
  },
  {
    key: 'lambazouk',
    category: 'fundamentals',
    relatedTerms: ['lambada', 'brazilianZouk'],
    sources: [
      { label: 'Wikipedia: Brazilian Zouk', url: 'https://en.wikipedia.org/wiki/Brazilian_zouk' },
      { label: 'Zoukology', url: 'https://www.zoukology.com/' },
    ],
  },
  {
    key: 'caribbeanVsBrazilianZouk',
    category: 'fundamentals',
    relatedTerms: ['zoukMusic', 'brazilianZouk', 'lambada'],
  },
  {
    key: 'cabecada',
    category: 'fundamentals',
    relatedTerms: ['bodyWave', 'connection', 'leading', 'following'],
  },
  {
    key: 'bodyWave',
    category: 'fundamentals',
    relatedTerms: ['cabecada', 'flow', 'elasticity'],
  },
  {
    key: 'connection',
    category: 'fundamentals',
    relatedTerms: ['leading', 'following', 'elasticity'],
  },
  {
    key: 'leading',
    category: 'fundamentals',
    relatedTerms: ['following', 'connection', 'socialDanceEtiquette'],
  },
  {
    key: 'following',
    category: 'fundamentals',
    relatedTerms: ['leading', 'connection', 'socialDanceEtiquette'],
  },
  {
    key: 'zoukMusic',
    category: 'music',
    relatedTerms: ['brazilianZouk', 'zoukRemix', 'cremosidade', 'brazilianZoukDj'],
  },
  {
    key: 'brazilianZoukDj',
    category: 'music',
    relatedTerms: ['zoukMusic', 'musicality', 'zoukDjSet', 'zoukRemix'],
  },
  {
    key: 'zoukDjSet',
    category: 'music',
    relatedTerms: ['brazilianZoukDj', 'musicality', 'cremosidade', 'zoukSocialDance'],
  },
  {
    key: 'zoukBpm',
    category: 'music',
    relatedTerms: ['zoukMusic', 'musicality', 'zoukDjSet'],
  },
  {
    key: 'zoukRemix',
    category: 'music',
    relatedTerms: ['zoukMusic', 'cremosidade'],
  },
  {
    key: 'musicality',
    category: 'music',
    relatedTerms: ['zoukMusic', 'cremosidade', 'brazilianZouk', 'zoukBpm'],
    sources: [
      { label: 'Brazilian Zouk Council', url: 'https://www.brazilianzoukcouncil.com/' },
      { label: 'Zoukology', url: 'https://www.zoukology.com/' },
    ],
  },
  {
    key: 'elasticity',
    category: 'culture',
    relatedTerms: ['connection', 'bodyWave', 'flow'],
  },
  {
    key: 'flow',
    category: 'culture',
    relatedTerms: ['cremosidade', 'musicality', 'elasticity'],
  },
  {
    key: 'cremosidade',
    category: 'culture',
    relatedTerms: ['musicality', 'zoukMusic', 'zoukRemix', 'flow'],
  },
  {
    key: 'socialDanceEtiquette',
    category: 'culture',
    relatedTerms: ['socialDance', 'connection', 'leading', 'following'],
  },
  {
    key: 'zoukCongress',
    category: 'eventFormats',
    relatedTerms: ['zoukFestival', 'zoukMarathon', 'workshop'],
  },
  {
    key: 'brazilianZoukCongress',
    category: 'eventFormats',
    relatedTerms: ['zoukCongress', 'zoukFestival', 'workshop'],
  },
  {
    key: 'zoukFestival',
    category: 'eventFormats',
    relatedTerms: ['zoukCongress', 'zoukMarathon', 'socialDance'],
  },
  {
    key: 'zoukMarathon',
    category: 'eventFormats',
    relatedTerms: ['zoukFestival', 'socialDance', 'zoukWeekender'],
  },
  {
    key: 'zoukWeekender',
    category: 'eventFormats',
    relatedTerms: ['zoukCongress', 'zoukMarathon', 'workshop'],
  },
  {
    key: 'workshop',
    category: 'eventFormats',
    relatedTerms: ['zoukCongress', 'socialDance'],
  },
  {
    key: 'socialDance',
    category: 'eventFormats',
    relatedTerms: ['zoukMusic', 'musicality', 'zoukFestival', 'zoukDjSet'],
  },
  {
    key: 'jackAndJill',
    category: 'eventFormats',
    relatedTerms: ['zoukCongress', 'socialDance', 'musicality'],
  },
  {
    key: 'zoukSocialDance',
    category: 'eventFormats',
    relatedTerms: ['socialDance', 'brazilianZoukDj', 'zoukMusic'],
  },
  {
    key: 'bookingZoukDj',
    category: 'eventFormats',
    relatedTerms: ['brazilianZoukDj', 'zoukCongress', 'zoukFestival', 'zoukDjSet'],
  },
  {
    key: 'zoukAuthority',
    category: 'culture',
    relatedTerms: ['brazilianZouk', 'brazilianZoukDj', 'zoukCongress'],
  },
  {
    key: 'historyOfZouk',
    category: 'history',
    relatedTerms: ['lambada', 'lambazouk', 'brazilianZouk'],
    sources: [
      { label: 'Wikipedia: Brazilian Zouk History', url: 'https://en.wikipedia.org/wiki/Brazilian_zouk#History' }
    ]
  },
  {
    key: 'zoukOrigin',
    category: 'history',
    relatedTerms: ['brazilianZouk', 'lambada'],
  },
  {
    key: 'zoukPioneers',
    category: 'history',
    relatedTerms: ['historyOfZouk', 'traditionalZouk'],
  },
  {
    key: 'traditionalZouk',
    category: 'styles',
    relatedTerms: ['historyOfZouk', 'zoukPioneers'],
  },
  {
    key: 'neozouk',
    category: 'styles',
    relatedTerms: ['traditionalZouk', 'brazilianZouk'],
  },
  {
    key: 'soulZouk',
    category: 'styles',
    relatedTerms: ['traditionalZouk', 'musicality'],
  },
  {
    key: 'rioStyle',
    category: 'styles',
    relatedTerms: ['traditionalZouk', 'brazilianZouk'],
  },
  {
    key: 'rnbZouk',
    category: 'music',
    relatedTerms: ['zoukMusic', 'musicality'],
  },
  {
    key: 'popZouk',
    category: 'music',
    relatedTerms: ['zoukMusic', 'zoukRemix'],
  },
  {
    key: 'kizombaInfluence',
    category: 'music',
    relatedTerms: ['zoukMusic', 'caribbeanVsBrazilianZouk'],
  },
  {
    key: 'zoukProducers',
    category: 'music',
    relatedTerms: ['brazilianZoukDj', 'zoukRemix'],
  },
  {
    key: 'zoukPlaylists',
    category: 'music',
    relatedTerms: ['zoukMusic', 'brazilianZoukDj'],
  }
];
