import { getComic } from "@/lib/api";
import { mockChapters } from "@/lib/mockdata";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatShortTime } from "@/lib/time";
import { ArrowLeft, Star, BookOpen, Heart, ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import ChapterList from "@/components/ChapterList";
import { marked } from "marked";

interface ComicPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ComicPage({ params }: ComicPageProps) {
    const { slug } = await params;

    let comic;
    try {
        comic = await getComic(slug);
    } catch (e) {
        notFound();
    }

    // Format alt titles as inline string with bullet separator
    const altTitlesString = comic.alt_titles?.map(a => a.title).join(" • ") || "";

    // Parse markdown description to HTML
    const descriptionHtml = comic.description
        ? await marked.parse(comic.description, { breaks: true })
        : "No description available.";

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>

            {/* Main Content - Flex container with top alignment */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Cover Image */}
                    <div className="shrink-0">
                        <div className="relative w-48 md:w-56 overflow-hidden rounded-lg shadow-2xl ring-2 ring-zinc-800">
                            {comic.cover_url ? (
                                <img
                                    src={comic.cover_url}
                                    alt={comic.title}
                                    className="w-full h-auto object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[2/3] w-full items-center justify-center bg-zinc-800 text-zinc-600">
                                    No Cover
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Title, Meta, Buttons, Synopsis (vertical stack) */}
                    <div className="flex-1 min-w-0">
                        {/* Top Info Wrapper - enforce min-height to push Synopsis below cover level */}
                        <div className="flex flex-col justify-start lg:min-h-[21rem]">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-white md:text-4xl">{comic.title}</h1>

                            {/* Alt Titles - Scrollable container, max 3 lines */}
                            {altTitlesString && (
                                <div className="mt-2 max-h-[4.5rem] overflow-y-auto scrollbar-thin">
                                    <p className="text-sm text-zinc-500 leading-6">
                                        {altTitlesString}
                                    </p>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-zinc-300">
                                    <Star size={18} weight="fill" className="text-yellow-500" />
                                    {comic.rating?.toFixed(1) || "N/A"}
                                </span>
                                <span className="rounded bg-primary/20 px-2.5 py-1 text-xs font-bold uppercase text-primary">
                                    {comic.status}
                                </span>
                                <span className="uppercase text-zinc-500">{comic.type}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-green-400 transition-colors">
                                    <BookOpen size={20} weight="bold" />
                                    Start Reading
                                </button>
                                <button className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-white hover:bg-zinc-700 transition-colors">
                                    <Heart size={20} />
                                    Add to Library
                                </button>
                                <button className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-3 text-white hover:bg-zinc-700 transition-colors">
                                    <ShareNetwork size={20} />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Synopsis - Directly under buttons but pushed down */}
                        <div className="mt-6">
                            <h2 className="mb-3 text-lg font-bold text-white">Synopsis</h2>
                            <div
                                className="prose prose-sm prose-invert max-w-none prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline [&_a:hover]:underline prose-strong:text-white"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />
                        </div>

                        <ChapterList chapters={mockChapters} slug={slug} />
                    </div>

                    {/* Right: Info Block - Fixed max-width sidebar */}
                    <div className="w-full lg:w-80 lg:max-w-[350px] shrink-0">
                        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5 space-y-3 text-sm">
                            <div className="flex gap-2">
                                <span className="text-zinc-500 w-20 shrink-0">Type:</span>
                                <span className="text-white capitalize">{comic.type}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-zinc-500 w-20 shrink-0">Status:</span>
                                <span className="text-white capitalize">{comic.status}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-zinc-500 w-20 shrink-0">Rating:</span>
                                <span className="text-white">{comic.rating?.toFixed(1) || "N/A"}</span>
                            </div>

                            {/* Genres */}
                            {comic.genres && comic.genres.length > 0 && (
                                <div className="flex gap-2">
                                    <span className="text-zinc-500 w-20 shrink-0">Genres:</span>
                                    <span className="text-primary leading-normal">
                                        {comic.genres.map((g: any) => g.name).join(", ")}
                                    </span>
                                </div>
                            )}

                            {/* Authors */}
                            {comic.creators && comic.creators.some(c => c.role === 'Author') && (
                                <div className="flex gap-2">
                                    <span className="text-zinc-500 w-20 shrink-0">Authors:</span>
                                    <span className="text-white leading-normal">
                                        {comic.creators.filter(c => c.role === 'Author').map(c => c.name).join(", ")}
                                    </span>
                                </div>
                            )}

                            {/* Artists */}
                            {comic.creators && comic.creators.some(c => c.role === 'Artist') && (
                                <div className="flex gap-2">
                                    <span className="text-zinc-500 w-20 shrink-0">Artists:</span>
                                    <span className="text-white leading-normal">
                                        {comic.creators.filter(c => c.role === 'Artist').map(c => c.name).join(", ")}
                                    </span>
                                </div>
                            )}

                            {/* External Links */}
                            {comic.referrers && comic.referrers.length > 0 && (
                                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                                    <span className="text-zinc-500 w-20 shrink-0">Referrers:</span>
                                    <div className="flex gap-2 flex-wrap items-center">
                                        {comic.referrers.map((ref, i) => (
                                            <a
                                                key={i}
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="opacity-70 hover:opacity-100 transition-opacity"
                                                title={ref.source}
                                            >
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain_url=${ref.url}&sz=32`}
                                                    alt={ref.source}
                                                    className="size-5 rounded-sm"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Related Series Block */}
                        {comic.related_series && comic.related_series.length > 0 && (
                            <div className="mt-6 rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
                                <h3 className="mb-4 text-sm font-bold text-white uppercase">Related Series</h3>
                                <div className="space-y-4">
                                    {comic.related_series.map((rel) => (
                                        <Link
                                            key={rel.id}
                                            href={rel.related_comic ? `/comic/${rel.related_comic.slug}` : "#"}
                                            className={`flex gap-3 group ${!rel.related_comic ? "pointer-events-none" : ""}`}
                                        >
                                            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded bg-zinc-800 shadow-sm border border-zinc-700/50">
                                                {rel.related_comic?.cover_url ? (
                                                    <img
                                                        src={rel.related_comic.cover_url}
                                                        alt={rel.title}
                                                        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs text-zinc-600">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="mb-1 text-[10px] font-bold uppercase text-primary">
                                                    {rel.relation_type}
                                                </div>
                                                <h4 className="line-clamp-2 text-xs font-bold text-white group-hover:text-zinc-300 transition-colors">
                                                    {rel.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
