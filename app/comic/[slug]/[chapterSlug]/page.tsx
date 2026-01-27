import Link from "next/link";
import { ArrowLeft, ArrowRight, House, GearSix } from "@phosphor-icons/react/dist/ssr";
import { getChapterBySlug, getComic } from "@/lib/api";
import { notFound } from "next/navigation";

interface ReaderPageProps {
    params: Promise<{ slug: string; chapterSlug: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
    const { slug, chapterSlug } = await params;

    const [chapter, comic] = await Promise.all([
        getChapterBySlug(slug, chapterSlug).catch(() => null),
        getComic(slug).catch(() => null)
    ]);

    if (!chapter || !comic) {
        notFound();
    }

    const pages = chapter.images || [];
    const chapterNum = chapter.chapter_num;

    // Find adjacent chapters
    // TODO: The API should ideally provide prev/next links. 
    // For now, we manually sort the chapters from comic detail to find adjacent ones.
    const allChapters = comic.chapters?.sort((a, b) => a.chapter_num - b.chapter_num) || [];
    const currentIndex = allChapters.findIndex((c) => c.chapter_num === chapterNum);

    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    // Helper to build chapter URL: /comic/{slug}/chapter-{num}-{groupId}
    const buildChapterUrl = (c: typeof allChapters[number]) => {
        if (!c.group_id) return "#"; // Should not happen if data is clean
        return `/comic/${slug}/chapter-${c.chapter_num}-${c.group_id}`;
    };

    return (
        <div className="min-h-screen bg-black text-zinc-200">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 p-3 shadow-lg transition-transform duration-300">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/comic/${slug}`}
                        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <Link
                        href="/"
                        className="rounded-lg bg-zinc-800 p-2 text-white hover:bg-zinc-700 transition-colors"
                        title="Home"
                    >
                        <House size={20} />
                    </Link>
                </div>

                <div className="text-center flex-1 mx-4 truncate">
                    <h1 className="text-sm sm:text-base font-semibold text-white truncate">
                        {comic.title}
                    </h1>
                    <p className="text-xs text-zinc-400">
                        {chapter.title ? `${chapter.chapter_num} - ${chapter.title}` : `Chapter ${chapter.chapter_num}`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Settings / Menu Placeholders */}
                    <button className="hidden sm:block rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                        <GearSix size={20} />
                    </button>
                </div>
            </nav>

            {/* Reader Content - Long Strip Mode */}
            <main className="mx-auto max-w-4xl pt-20 pb-32 min-h-screen">
                {pages.length > 0 ? (
                    <div className="flex flex-col">
                        {pages.map((page, index) => (
                            <div key={index} className="relative w-full">
                                <img
                                    src={page}
                                    alt={`Page ${index + 1}`}
                                    className="w-full h-auto block"
                                    loading={index < 3 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <p className="text-lg">No pages found for this chapter.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 text-primary hover:underline">
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* End of Chapter Actions */}
                <div className="py-16 text-center space-y-6">
                    <p className="text-zinc-500 font-medium">End of Chapter {chapterNum}</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                        {prevChapter && (
                            <Link
                                href={buildChapterUrl(prevChapter)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-95"
                            >
                                <ArrowLeft size={16} />
                                Previous Chapter
                            </Link>
                        )}

                        {nextChapter ? (
                            <Link
                                href={buildChapterUrl(nextChapter)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-black hover:bg-green-400 shadow-lg shadow-green-500/20 transition-all active:scale-95"
                            >
                                Next Chapter
                                <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <Link
                                href={`/comic/${slug}`}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-8 py-3 text-white hover:bg-zinc-700 border border-zinc-700"
                            >
                                Return to Series
                            </Link>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3">
                <div className="flex-1">
                    {prevChapter ? (
                        <Link
                            href={buildChapterUrl(prevChapter)}
                            className="flex w-fit items-center gap-2 rounded-lg py-2 px-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Prev</span>
                        </Link>
                    ) : (
                        <span className="flex w-fit items-center gap-2 py-2 px-3 text-sm text-zinc-600 cursor-not-allowed">
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Prev</span>
                        </span>
                    )}
                </div>

                <div className="px-4 text-center">
                    <span className="text-xs font-mono text-zinc-500">
                        {pages.length} Pages
                    </span>
                </div>

                <div className="flex-1 flex justify-end">
                    {nextChapter ? (
                        <Link
                            href={buildChapterUrl(nextChapter)}
                            className="flex w-fit items-center gap-2 rounded-lg py-2 px-3 text-sm font-bold text-primary hover:text-green-400 hover:bg-zinc-800 transition-colors"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <span className="flex w-fit items-center gap-2 py-2 px-3 text-sm text-zinc-600 cursor-not-allowed">
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight size={16} />
                        </span>
                    )}
                </div>
            </nav>
        </div>
    );
}
