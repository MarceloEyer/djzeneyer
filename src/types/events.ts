// src/types/events.ts

export interface BandsintownEvent {
    id: string;
    title: string;
    datetime: string;
    datetime_iso?: string;
    description?: string;
    image?: string;
    venue: {
        name: string;
        city: string;
        region: string;
        country: string;
        latitude?: string;
        longitude?: string;
    };
    url: string;
    offers?: Array<{ url: string }>;
}

export interface FetchEventsParams {
    limit?: number;
    lang?: string;
    upcomingOnly?: boolean;
    search?: string;
}

export interface EventsApiResponse {
    success: boolean;
    count: number;
    events: BandsintownEvent[];
    lang: string;
}
