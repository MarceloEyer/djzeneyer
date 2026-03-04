// src/types/events.ts — v3 (Zen BIT v2 API)

// ============================================================================
// CAMPO LOCATION
// ============================================================================

export interface EventLocation {
    venue: string;
    city: string;
    region: string;
    country: string;
    latitude?: string;
    longitude?: string;
}

// ============================================================================
// LISTA (payload enxuto — zen-bit/v2)
// ============================================================================

/**
 * Evento na lista: GET /zen-bit/v2/events
 * NÃO inclui: description, image, offers, lineup, raw
 */
export interface ZenBitEventListItem {
    event_id: string;   // ID numérico Bandsintown (string)
    title: string;
    starts_at: string;   // ISO 8601
    timezone?: string;
    location: EventLocation;
    canonical_path: string;   // ex: /events/2025-06-20-dj-zen-eyer-at-club-x-15619775
    canonical_url: string;
    source_url?: string;   // URL Bandsintown
}

// ============================================================================
// DETALHE (payload completo — zen-bit/v2)
// ============================================================================

export interface EventOffer {
    url: string;
    type: string;
    status?: string;
}

export interface EventArtist {
    name: string;
    image?: string;
    source_url?: string;
}

/**
 * Evento completo: GET /zen-bit/v2/events/{event_id}
 */
export interface ZenBitEventDetail extends ZenBitEventListItem {
    ends_at?: string;
    description?: string;
    image?: string;
    artists?: EventArtist[];
    offers?: EventOffer[];
    tickets?: string[];   // lista plana de URLs de tickets
    raw?: unknown;    // debug only
}

// ============================================================================
// RESPONSE ENVELOPE
// ============================================================================

export interface EventsApiResponse {
    success: boolean;
    count: number;
    mode: string;
    events: ZenBitEventListItem[];
}

export interface EventDetailApiResponse {
    success: boolean;
    event: ZenBitEventDetail;
}

// ============================================================================
// PARÂMETROS DE FETCH
// ============================================================================

export interface FetchEventsParams {
    mode?: 'upcoming' | 'past' | 'all';
    days?: number;
    date?: string;          // YYYY-MM-DD,YYYY-MM-DD
    limit?: number;
    lang?: string;

    // DEPRECATED — BC apenas, mapeado para mode no fetchEventsFn
    /** @deprecated Use mode='all' */
    upcomingOnly?: boolean;
}
