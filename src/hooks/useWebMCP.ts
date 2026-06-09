import { fetchEventsFn } from './usePublicQueries';
import { useEffect } from 'react';
import { ARTIST } from '../data/artistData';
import { logger } from '../lib/logger';

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
                try {
                  const eventsData = await fetchEventsFn({ mode: 'upcoming', limit: 5 });
                  const formattedEvents = eventsData.map(event => ({
                    date: event.starts_at,
                    location: `${event.location.city}, ${event.location.region}`,
                    venue: event.location.venue,
                  }));
                  return { events: formattedEvents };
                } catch (error) {
                  logger.error('WEB_MCP', 'Error fetching events', { error: String(error) });
                  return { events: [] };
                }
              }
            },
            get_bio: {
              name: 'get_bio',
              description: 'Retorna a biografia curta e o estilo musical do DJ Zen Eyer.',
              inputSchema: {
                type: 'object',
                properties: {},
              },
              execute: () => {
                return {
                  name: ARTIST.identity.stageName,
                  genre: 'Brazilian Zouk',
                  philosophy: ARTIST.philosophy.style,
                  mission: ARTIST.philosophy.mission,
                  bio: ARTIST.site.defaultDescription,
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
        logger.debug('WEB_MCP', 'AI tools registered successfully');
      } catch (error) {
        logger.error('WEB_MCP', 'Error registering tools', { error: String(error) });
      }
    }
  }, []);
}
