export type EncyclopediaCategory = 'fundamentals' | 'music' | 'eventFormats' | 'culture';

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
    key: 'cremosidade',
    category: 'culture',
    relatedTerms: ['musicality', 'zoukMusic', 'zoukRemix'],
  },
  {
    key: 'zoukCongress',
    category: 'eventFormats',
    relatedTerms: ['zoukFestival', 'zoukMarathon', 'workshop'],
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
];
