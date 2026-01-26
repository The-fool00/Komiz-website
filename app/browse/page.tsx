"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass, Funnel, X, List, SquaresFour, CaretDown, CaretUp } from "@phosphor-icons/react";
import { getComics, getGenres, Comic, Genre } from "@/lib/api";

export default function BrowsePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#121212] pt-24 text-center">Loading...</div>}>
            <BrowseContent />
        </Suspense>
    );
}

function BrowseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for filters
    const [query, setQuery] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "Any");
    const [type, setType] = useState(searchParams.get("type") || "Any");
    const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "updated_at");
    const [order, setOrder] = useState<"asc" | "desc">((searchParams.get("order") as "asc" | "desc") || "desc");

    // Genre State (Included & Excluded)
    const [includedGenres, setIncludedGenres] = useState<number[]>(
        searchParams.get("genre_ids")?.split(",").map(Number).filter(Boolean) || []
    );
    const [excludedGenres, setExcludedGenres] = useState<number[]>(
        searchParams.get("exclude_genre_ids")?.split(",").map(Number).filter(Boolean) || []
    );

    // Data State
    const [comics, setComics] = useState<Comic[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);

    // Fetch filters on mount
    useEffect(() => {
        getGenres().then(setGenres).catch(console.error);
    }, []);

    // Fetch Comics when filters change
    useEffect(() => {
        setLoading(true);
        const params = {
            search: query,
            status: status === "Any" ? undefined : status,
            type: type === "Any" ? undefined : type,
            sort_by: sortBy,
            order: order,
            genre_ids: includedGenres.join(","),
            exclude_genre_ids: excludedGenres.join(","),
        };

        getComics(params)
            .then(res => {
                setComics(res.items);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [query, status, type, sortBy, order, includedGenres, excludedGenres]);

    // Update URL
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (status !== "Any") params.set("status", status);
        if (type !== "Any") params.set("type", type);
        params.set("sort_by", sortBy);
        params.set("order", order);
        if (includedGenres.length > 0) params.set("genre_ids", includedGenres.join(","));
        if (excludedGenres.length > 0) params.set("exclude_genre_ids", excludedGenres.join(","));

        router.push(`/browse?${params.toString()}`);
    };

    // Tri-State Handler
    const toggleGenre = (id: number) => {
        if (includedGenres.includes(id)) {
            // State 2 (Included) -> State 3 (Excluded)
            setIncludedGenres(prev => prev.filter(g => g !== id));
            setExcludedGenres(prev => [...prev, id]);
        } else if (excludedGenres.includes(id)) {
            // State 3 (Excluded) -> State 1 (Neutral)
            setExcludedGenres(prev => prev.filter(g => g !== id));
        } else {
            // State 1 (Neutral) -> State 2 (Included)
            setIncludedGenres(prev => [...prev, id]);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] pt-20 pb-12">
            <div className="container mx-auto px-4">

                {/* Search Bar & Advanced Toggle */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors border flex items-center gap-2 ${showFilters ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'}`}
                    >
                        <Funnel size={18} weight={showFilters ? "fill" : "regular"} />
                        Advanced Filters
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Sort By</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                        >
                                            <option value="updated_at">Latest Update</option>
                                            <option value="created_at">Added Date</option>
                                            <option value="title">Alphabetical</option>
                                            <option value="rating">Rating</option>
                                            <option value="view_count">Popularity</option>
                                        </select>
                                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={12} />
                                    </div>
                                    <button
                                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                                        className="bg-zinc-800 border border-zinc-700 rounded px-3 text-zinc-400 hover:text-white"
                                        title={order === "asc" ? "Ascending" : "Descending"}
                                    >
                                        {order === "asc" ? <CaretUp size={16} /> : <CaretDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="Any">Any</option>
                                        <option value="manhwa">Manhwa</option>
                                        <option value="manga">Manga</option>
                                        <option value="manhua">Manhua</option>
                                    </select>
                                    <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={12} />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="Any">Any</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="hiatus">Hiatus</option>
                                    </select>
                                    <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={12} />
                                </div>
                            </div>

                            {/* Genres Selector */}
                            <div className="lg:col-span-4 space-y-2 border-t border-zinc-800 pt-4 mt-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Genres</label>
                                    {(includedGenres.length > 0 || excludedGenres.length > 0) && (
                                        <button
                                            onClick={() => { setIncludedGenres([]); setExcludedGenres([]); }}
                                            className="text-xs text-zinc-500 hover:text-white"
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
                                    {genres.map(genre => {
                                        const isIncluded = includedGenres.includes(genre.id);
                                        const isExcluded = excludedGenres.includes(genre.id);

                                        return (
                                            <button
                                                key={genre.id}
                                                onClick={() => toggleGenre(genre.id)}
                                                className={`text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2 group ${isIncluded
                                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    : isExcluded
                                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 decoration-red-500/50 line-through'
                                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                                    }`}
                                            >
                                                {/* Visual Indicator */}
                                                <div className={`w-3 h-3 flex items-center justify-center rounded-sm text-[10px] font-bold shrink-0 ${isIncluded ? 'bg-green-500 text-black' :
                                                    isExcluded ? 'bg-red-500 text-white' :
                                                        'bg-zinc-700 group-hover:bg-zinc-600'
                                                    }`}>
                                                    {isIncluded && "+"}
                                                    {isExcluded && "-"}
                                                </div>
                                                <span className={isExcluded ? "opacity-75" : ""}>{genre.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={applyFilters}
                                className="bg-primary hover:bg-green-400 text-black font-bold py-2 px-8 rounded-lg transition-colors shadow-lg shadow-green-500/20"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {loading ? "Searching..." : `${comics.length} Results`}
                    </h2>
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button className="p-2 rounded bg-zinc-800 text-white shadow-sm"><SquaresFour size={20} /></button>
                        <button className="p-2 rounded text-zinc-500 hover:text-white"><List size={20} /></button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-zinc-900 rounded-lg mb-3"></div>
                                <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : comics.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {comics.map((comic) => (
                            <Link href={`/comic/${comic.slug}`} key={comic.id} className="group block">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 group-hover:ring-zinc-600 transition-all mb-3 ml-0">
                                    {comic.cover_url ? (
                                        <img
                                            src={comic.cover_url}
                                            alt={comic.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-zinc-700">No Cover</div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase border border-white/10">
                                            {comic.type}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center justify-between text-xs text-white">
                                            <span>⭐ {comic.rating?.toFixed(1) || "-"}</span>
                                            <span className="text-zinc-300">{comic.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1" title={comic.title}>
                                        {comic.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                        {comic.genres?.map(g => g.name).join(", ")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-600 border border-zinc-800 rounded-lg bg-zinc-900/20">
                        <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium text-zinc-400">No comics found matching your criteria.</p>
                        <button onClick={() => {
                            setQuery(""); setStatus("Any"); setType("Any");
                            setIncludedGenres([]); setExcludedGenres([]); applyFilters();
                        }} className="mt-4 text-primary hover:underline">
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
