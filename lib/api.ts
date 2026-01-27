const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.komiz.dev/v1";

export interface Comic {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
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
    chapters?: {
        id: string;
        chapter_num: number;
        title: string | null;
        group_id?: string | null;
        updated_at: string;
    }[];
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

    // Append trailing slash to avoid 307 Redirects
    const res = await fetch(`${API_BASE}/comics/?${query.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.error(`Failed to fetch comics: ${res.status} ${res.statusText}`);
        // Return empty result instead of throwing to prevent build failure
        return { total: 0, page: 1, size: 20, items: [] };
    }

    return res.json();
}


export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export async function getGenres(): Promise<Genre[]> {
    // Append trailing slash to avoid 307 Redirects
    const res = await fetch(`${API_BASE}/genres/`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        console.error(`Failed to fetch genres: ${res.status} ${res.statusText}`);
        return [];
    }

    return res.json();
}

export async function getComic(slugOrId: string): Promise<Comic> {
    const res = await fetch(`${API_BASE}/comics/${slugOrId}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        // If 404, throwing is okay as it will render the Not Found page
        if (res.status === 404) {
            throw new Error("Comic not found");
        }
        throw new Error(`Failed to fetch comic: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export interface Chapter {
    id: string;
    comic_id: string;
    group_id?: string | null;
    chapter_num: number;
    title: string | null;
    images: string[];
    created_at: string;
    group?: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

export async function getChapterBySlug(comicSlug: string, chapterSlug: string): Promise<Chapter> {
    const res = await fetch(`${API_BASE}/read/${comicSlug}/${chapterSlug}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Chapter not found");
        }
        throw new Error(`Failed to fetch chapter: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getComicChapters(comicId: string): Promise<Chapter[]> {
    const res = await fetch(`${API_BASE}/${comicId}/chapters`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}

export interface Group {
    id: string;
    name: string;
    slug: string;
    website: string | null;
    discord: string | null;
    twitter: string | null;
    mangaupdates_url: string | null;
    email: string | null;
    official: boolean;
    description: string | null;
    mangadex_id: string | null;
}

export async function getGroups(): Promise<Group[]> {
    const res = await fetch(`${API_BASE}/groups/`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}

export async function importGroup(mangadexId: string): Promise<Group> {
    const res = await fetch(`${API_BASE}/groups/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mangadex_id: mangadexId }),
    });

    if (!res.ok) {
        if (res.status === 409) {
            throw new Error("Group already exists");
        }
        throw new Error(`Failed to import group: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getGroup(slug: string): Promise<Group> {
    const res = await fetch(`${API_BASE}/groups/${slug}`, {
        next: { revalidate: 600 },
    });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Group not found");
        }
        throw new Error(`Failed to fetch group: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getGroupChapters(slug: string): Promise<Chapter[]> {
    const res = await fetch(`${API_BASE}/groups/${slug}/chapters`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}
