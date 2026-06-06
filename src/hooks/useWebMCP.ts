import { useEffect } from 'react';
import { ARTIST } from '../data/artistData';

/**
 * Hook para expor ferramentas do site para agentes de IA (WebMCP).
 * Bots e navegadores habilitados com WebMCP poderão descobrir e usar estas funções.
 */
export function useWebMCP() {
  useEffect(() => {
    // Verifica se o ambiente é o navegador e se suporta WebMCP
    if (typeof window !== 'undefined' && navigator.modelContext) {
      try {
        navigator.modelContext.provideContext({
          tools: {
            get_agenda: {
              name: 'get_agenda',
              description: 'Retorna as próximas datas de shows e eventos do DJ Zeneyer.',
              inputSchema: {
                type: 'object',
                properties: {},
              },
              execute: async () => {
                // TODO: No futuro, isso pode consultar a API REST do WordPress
                return {
                  events: [
                    { date: '2026-07-15', location: 'São Paulo, SP', venue: 'Laroc Club' },
                    { date: '2026-08-02', location: 'Rio de Janeiro, RJ', venue: 'Green Valley Tour' }
                  ]
                };
              }
            },
            get_bio: {
              name: 'get_bio',
              description: 'Retorna a biografia curta e o estilo musical do DJ Zeneyer.',
              inputSchema: {
                type: 'object',
                properties: {},
              },
              execute: () => {
                return {
                  name: 'DJ Zeneyer',
                  style: ['House', 'Techno', 'Melodic'],
                  bio: 'DJ Zeneyer é conhecido por seus sets imersivos que misturam house e techno melódico.'
                };
              }
            },
            get_music_links: {
              name: 'get_music_links',
              description: 'Retorna links oficiais para escutar os sets e músicas do DJ Zeneyer.',
              inputSchema: {
                type: 'object',
                properties: {},
              },
              execute: () => {
                return {
                  spotify: ARTIST.social.spotify.url,
                  soundcloud: ARTIST.social.soundcloud.url,
                  youtube: ARTIST.social.YouTube.url,
                };
              }
            }
          }
        });
        console.log('[WebMCP] Ferramentas de IA registradas com sucesso.');
      } catch (error) {
        console.error('[WebMCP] Erro ao registrar ferramentas:', error);
      }
    }
  }, []);
}
