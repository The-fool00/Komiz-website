const API_BASE = "https://api.komiz.dev/v1";

export interface Comic {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_url: string | null;
    status: string;
    type: string;
    rating: number;
    alt_titles: { title: string }[];
    referrers: { source: string; url: string }[];
    genres?: { id: string; name: string; slug: string }[];
    creators?: { id: string; name: string; role: string }[];
    publishers?: { id: string; name: string; slug: string }[];
    mangaupdates_url?: string | null;
    last_chapter: {
        chapter_num: number;
        updated_at: string;
    } | null;
    related_series?: {
        id: number;
        title: string;
        relation_type: string;
        related_comic?: {
            id: string;
            slug: string;
            cover_url: string | null;
        } | null;
    }[];
}

export interface PaginatedResponse<T> {
    total: number;
    page: number;
    size: number;
    items: T[];
}

export interface ComicFilterParams {
    page?: number;
    size?: number;
    status?: string;
    type?: string;
    sort_by?: string;
    order?: "asc" | "desc";
    search?: string;
    genre_ids?: string; // Comma separated
    exclude_genre_ids?: string; // Comma separated
}

export async function getComics(params: ComicFilterParams): Promise<PaginatedResponse<Comic>> {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.size) query.set("size", String(params.size));
    if (params.status && params.status !== "Any") query.set("status", params.status);
    if (params.type && params.type !== "Any") query.set("type", params.type);
    if (params.sort_by) query.set("sort_by", params.sort_by);
    if (params.order) query.set("order", params.order);
    if (params.search) query.set("search", params.search);
    if (params.genre_ids) query.set("genre_ids", params.genre_ids);
    if (params.exclude_genre_ids) query.set("exclude_genre_ids", params.exclude_genre_ids);

    const res = await fetch(`${API_BASE}/comics?${query.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch comics");
    }

    return res.json();
}


export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export async function getGenres(): Promise<Genre[]> {
    const res = await fetch(`${API_BASE}/genres`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error("Failed to fetch genres");
    }

    return res.json();
}

export async function getComic(slugOrId: string): Promise<Comic> {
    const res = await fetch(`${API_BASE}/comics/${slugOrId}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch comic");
    }

    return res.json();
}
