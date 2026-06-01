export type PublishedWork = {
  type: 'Article' | 'Essay';
  translationKey: string;
  title: string;
  description: string;
  source: string;
  url: string;
  date: string;
  publisherUrl: string;
};

export const PUBLISHED_WORKS: PublishedWork[] = [
  {
    translationKey: 'art_of_staying',
    title: 'The Art of Staying',
    description:
      'sometimes, when nothing impressive seems to be happening — everything is happening.',
    url: 'https://events.zoukology.com/articles/the-art-of-staying',
    source: 'Zoukology',
    publisherUrl: 'https://events.zoukology.com',
    date: '2026-05-27',
    type: 'Article',
  },
];
