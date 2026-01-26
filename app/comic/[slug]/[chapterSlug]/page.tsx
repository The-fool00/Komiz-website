import Link from "next/link";
import { ArrowLeft, ArrowRight, House, List, GearSix } from "@phosphor-icons/react/dist/ssr";
import { getChapterBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

interface ReaderPageProps {
    params: Promise<{ slug: string; chapterSlug: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
    const { slug, chapterSlug } = await params;

    let chapter;
    try {
        chapter = await getChapterBySlug(slug, chapterSlug);
    } catch (e) {
        console.error("Failed to load chapter", e);
        notFound();
    }

    const pages = chapter.images && chapter.images.length > 0 ? chapter.images : [];
    const chapterNum = chapter.chapter_num;

    // TODO: logic for next/prev chapters. 
    // For now, simple assumption or disabled links until API supports fetching adjacent chapters context 
    // or we fetch the full list here.

    return (
        <div className="min-h-screen bg-black">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent p-4">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/comic/${slug}`}
                        className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-3 py-2 text-sm text-white hover:bg-zinc-700"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                    <Link
                        href="/"
                        className="rounded-lg bg-zinc-800/80 p-2 text-white hover:bg-zinc-700"
                    >
                        <House size={20} />
                    </Link>
                </div>

                <div className="text-center">
                    <h1 className="text-sm font-medium text-white/80">
                        {chapter.title || `Chapter ${chapterNum}`}
                    </h1>
                    {chapter.group && (
                        <p className="text-xs text-zinc-500">{chapter.group.name}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-zinc-800/80 p-2 text-white hover:bg-zinc-700">
                        <List size={20} />
                    </button>
                    <button className="rounded-lg bg-zinc-800/80 p-2 text-white hover:bg-zinc-700">
                        <GearSix size={20} />
                    </button>
                </div>
            </nav>

            {/* Reader Content - Long Strip Mode */}
            <div className="mx-auto max-w-3xl pt-20 pb-32">
                {pages.length > 0 ? (
                    pages.map((page, index) => (
                        <div key={index} className="relative w-full">
                            <img
                                src={page}
                                alt={`Page ${index + 1}`}
                                className="w-full"
                                loading={index < 3 ? "eager" : "lazy"}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex h-64 items-center justify-center text-zinc-500">
                        No pages found for this chapter.
                    </div>
                )}

                {/* End of Chapter */}
                <div className="py-16 text-center">
                    <p className="mb-4 text-zinc-500">End of Chapter {chapterNum}</p>
                    <div className="flex justify-center gap-4">
                        {/* 
                           TODO: Implement Next/Prev navigation correctly.
                           Requires knowing the slug of adjacent chapters.
                        */}
                        <Link
                            href={`/comic/${slug}`}
                            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white hover:bg-zinc-700"
                        >
                            <List size={16} />
                            Chapter List
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex-1 px-4">
                    <div className="h-1 w-full rounded-full bg-zinc-800">
                        <div className="h-1 w-1/3 rounded-full bg-primary" />
                    </div>
                    <div className="mt-1 text-center text-xs text-zinc-500">
                        {pages.length} Pages
                    </div>
                </div>
            </nav>
        </div>
    );
}
