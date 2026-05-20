// src/data/testimonialsData.ts

/**
 * REGRAS DO GOOGLE PARA REVIEWS (AGGREGATE RATING):
 * 1. As avaliações devem ser reais e escritas por usuários reais.
 * 2. É altamente recomendado ter o nome da pessoa e, se possível, data e foto (embora foto não seja obrigatório para o Schema).
 * 3. O 'ratingValue' deve ser de 1 a 5.
 * 
 * Este arquivo alimenta o Schema na Home Page e futuras páginas de testemunhos.
 */

export const TESTIMONIALS = [
  {
    authorName: "João Silva",
    reviewBody: "A energia do Zen Eyer no palco é surreal. O melhor set de Zouk que já dancei!",
    ratingValue: 5,
    source: "Facebook",
    date: "2024-03-15"
  },
  {
    authorName: "Maria Eduarda",
    reviewBody: "As músicas fluem de uma forma que você não consegue parar de dançar. Uma experiência incrível.",
    ratingValue: 5,
    source: "WhatsApp",
    date: "2024-04-02"
  }
];

export const AGGREGATE_RATING = {
  ratingValue: 5.0,
  reviewCount: TESTIMONIALS.length,
  reviews: TESTIMONIALS
};
