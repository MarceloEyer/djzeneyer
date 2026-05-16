export type EncyclopediaCategory = 'fundamentals' | 'music' | 'eventFormats' | 'culture';

export interface EncyclopediaTerm {
  key: string;
  category: EncyclopediaCategory;
  relatedTerms?: string[];
}

export const ZOUK_ENCYCLOPEDIA: EncyclopediaTerm[] = [
  {
    key: 'brazilianZouk',
    category: 'fundamentals',
    relatedTerms: ['lambada', 'lambazouk', 'zoukMusic'],
  },
  {
    key: 'lambada',
    category: 'fundamentals',
    relatedTerms: ['brazilianZouk', 'lambazouk'],
  },
  {
    key: 'lambazouk',
    category: 'fundamentals',
    relatedTerms: ['lambada', 'brazilianZouk'],
  },
  {
    key: 'zoukMusic',
    category: 'music',
    relatedTerms: ['brazilianZouk', 'zoukRemix', 'cremosidade'],
  },
  {
    key: 'zoukRemix',
    category: 'music',
    relatedTerms: ['zoukMusic', 'cremosidade'],
  },
  {
    key: 'musicality',
    category: 'music',
    relatedTerms: ['zoukMusic', 'cremosidade', 'brazilianZouk'],
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
    relatedTerms: ['zoukMusic', 'musicality', 'zoukFestival'],
  },
];
