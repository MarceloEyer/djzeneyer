// src/types/events.ts — v2 (Zen BIT v2 API)

// ============================================================================
// EVENTO v2 (Payload da lista — enxuto)
// ============================================================================

export interface EventLocation {
    venue: string;
    city: string;
    region: string;
    country: string;
    latitude?: string;
    longitude?: string;
}

/**
 * Evento no formato da lista (GET /zen-bit/v1/events).
 * Não contém: description, image, offers, lineup.
 */
export interface ZenBitEventListItem {
    id: string;
    title: string;
    starts_at: string;  // ISO 8601
    timezone?: string;
    location: EventLocation;
    canonical_path: string;  // ex: /events/2025-06-20-dj-zen-eyer-at-club-x-abc123
    canonical_url: string;  // site_url + canonical_path
}

// ============================================================================
// EVENTO v2 (Payload do detalhe — completo)
// ============================================================================

export interface EventOffer {
    url: string;
    type: string;
}

/**
 * Evento completo (GET /zen-bit/v1/events/{id}).
 * Estende o item de lista com campos extras.
 */
export interface ZenBitEventDetail extends ZenBitEventListItem {
    description?: string;
    image?: string;
    offers?: EventOffer[];
    lineup?: string[];
    source_url?: string;  // URL Bandsintown (sameAs no schema)
    raw?: unknown; // presente apenas com debug mode ativo
}

// ============================================================================
// UNION TYPE — compatibilidade com ambos os formatos
// ============================================================================

/** Usado em componentes que recebem tanto lista quanto detalhe */
export type ZenBitEvent = ZenBitEventListItem | ZenBitEventDetail;

// ============================================================================
// PARÂMETROS DE FETCH
// ============================================================================

export interface FetchEventsParams {
    mode?: 'upcoming' | 'past' | 'all';
    days?: number;
    date?: string;       // YYYY-MM-DD,YYYY-MM-DD (sobrescreve days)
    limit?: number;
    lang?: string;
    search?: string;
    // DEPRECATED — mantido para BC; mapeado internamente para mode
    upcomingOnly?: boolean;
}

// ============================================================================
// RESPONSE ENVELOPE
// ============================================================================

export interface EventsApiResponse {
    success: boolean;
    count: number;
    mode: string;
    lang: string;
    events: ZenBitEventListItem[];
}

export interface EventDetailApiResponse {
    success: boolean;
    event: ZenBitEventDetail;
}

// ============================================================================
// ALIAS DE COMPATIBILIDADE — componentes antigos usam BandsintownEvent
// Mantido para não precisar refatorar AddCalendarMenu e outros componentes
// em um único PR. Remover em v3.
// ============================================================================

/** @deprecated Use ZenBitEventDetail. Alias de compatibilidade. */
export type BandsintownEvent = ZenBitEventDetail & {
    /** @deprecated Use starts_at */
    datetime?: string;
    /** @deprecated Use location */
    venue?: {
        name: string;
        city: string;
        region: string;
        country: string;
        latitude?: string;
        longitude?: string;
    };
    /** @deprecated Use source_url */
    url?: string;
};
