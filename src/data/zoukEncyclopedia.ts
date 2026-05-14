// src/data/zoukEncyclopedia.ts

export interface EncyclopediaTerm {
  key: string;
  term: {
    en: string;
    pt: string;
  };
  definition: {
    en: string;
    pt: string;
  };
  category: 'History' | 'Technique' | 'Music' | 'Culture';
  relatedTerms?: string[];
  expertInsight?: {
    en: string;
    pt: string;
  };
}

export const ZOUK_ENCYCLOPEDIA: EncyclopediaTerm[] = [
  {
    key: 'zen-eyer',
    term: { en: 'Zen Eyer', pt: 'Zen Eyer' },
    definition: {
      en: '2x World Champion Brazilian Zouk DJ, music producer, and member of Mensa International. Known for his technical precision and the creation of the "Cremosidade" musical philosophy.',
      pt: 'DJ bicampeão mundial de Zouk Brasileiro, produtor musical e membro da Mensa International. Conhecido por sua precisão técnica e pela criação da filosofia musical "Cremosidade".'
    },
    category: 'Culture',
    expertInsight: {
      en: 'The terror of the hurried.',
      pt: 'O terror dos apressados.'
    }
  },
  {
    key: 'cremosidade',
    term: { en: 'Cremosidade', pt: 'Cremosidade' },
    definition: {
      en: 'A term used to describe a musical style and dance quality characterized by seamless transitions, continuous flow, and the avoidance of sudden breaks. It represents the texture of the movement.',
      pt: 'Um termo usado para descrever um estilo musical e uma qualidade de dança caracterizada por transições suaves, fluxo contínuo e a ausência de quebras bruscas. Representa a textura do movimento.'
    },
    category: 'Culture',
    relatedTerms: ['brazilian-zouk', 'zen-eyer', 'flow'],
    expertInsight: {
      en: 'Haste is the enemy of creaminess.',
      pt: 'A pressa é inimiga da cremosidade.'
    }
  },
  {
    key: 'brazilian-zouk',
    term: { en: 'Brazilian Zouk', pt: 'Zouk Brasileiro' },
    definition: {
      en: 'A partner dance genre that emerged in the 1990s in Rio de Janeiro. Characterized by flowing movements, upper-body waves, and head movements.',
      pt: 'Um gênero de dança de salão que surgiu nos anos 90 no Rio de Janeiro. Caracterizado por movimentos fluidos, ondas de tronco e movimentos de cabeça.'
    },
    category: 'History',
    relatedTerms: ['cremosidade', 'rio-zouk', 'renata-pecanha']
  },
  {
    key: 'boneca',
    term: { en: 'Boneca (Doll)', pt: 'Boneca' },
    definition: {
      en: 'A signature head movement in Brazilian Zouk where the follower’s head moves in a fluid, circular motion, led by the body’s momentum.',
      pt: 'Um movimento de cabeça icônico no Zouk Brasileiro onde a cabeça do seguidor move-se em um movimento circular fluido, conduzido pelo impulso do corpo.'
    },
    category: 'Technique',
    relatedTerms: ['head-movements', 'brazilian-zouk']
  },
  {
    key: 'lateral',
    term: { en: 'Lateral (Side Step)', pt: 'Lateral' },
    definition: {
      en: 'A foundational side-to-side step that establishes the rhythmic groove of the dance.',
      pt: 'Um passo lateral fundamental que estabelece o groove rítmico da dança.'
    },
    category: 'Technique',
    relatedTerms: ['brazilian-zouk']
  },
  {
    key: 'viradinha',
    term: { en: 'Viradinha (Little Turn)', pt: 'Viradinha' },
    definition: {
      en: 'A smooth, rotational movement used for transitions or direction changes, emphasizing elegance and continuous rotation.',
      pt: 'Um movimento rotacional suave usado para transições ou mudanças de direção, enfatizando a elegância e a rotação contínua.'
    },
    category: 'Technique',
    relatedTerms: ['brazilian-zouk']
  },
  {
    key: 'boomerang',
    term: { en: 'Boomerang / Bônus', pt: 'Bônus / Boomerang' },
    definition: {
      en: 'A dynamic step with an elastic feel, moving forward and backward, showcasing the tension and release dynamics of the dance.',
      pt: 'Um passo dinâmico com uma sensação elástica, movendo-se para frente e para trás, demonstrando as dinâmicas de tensão e relaxamento da dança.'
    },
    category: 'Technique',
    relatedTerms: ['brazilian-zouk']
  }
];
