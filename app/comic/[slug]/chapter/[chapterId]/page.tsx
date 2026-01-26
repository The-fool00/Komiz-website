import Link from "next/link";
import { ArrowLeft, ArrowRight, House, List, GearSix } from "@phosphor-icons/react/dist/ssr";

interface ReaderPageProps {
    params: Promise<{ slug: string; chapterId: string }>;
}

// Mock chapter pages - in production, fetch from API
const MOCK_PAGES = [
    "https://picsum.photos/800/1200?random=1",
    "https://picsum.photos/800/1200?random=2",
    "https://picsum.photos/800/1200?random=3",
    "https://picsum.photos/800/1200?random=4",
    "https://picsum.photos/800/1200?random=5",
];

export default async function ReaderPage({ params }: ReaderPageProps) {
    const { slug, chapterId } = await params;

    // In production: fetch chapter data from API
    const chapterNum = parseInt(chapterId) || 1;
    const pages = MOCK_PAGES;

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
                    <h1 className="text-sm font-medium text-white/80">Chapter {chapterNum}</h1>
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
                {pages.map((page, index) => (
                    <div key={index} className="relative w-full">
                        <img
                            src={page}
                            alt={`Page ${index + 1}`}
                            className="w-full"
                            loading={index < 3 ? "eager" : "lazy"}
                        />
                    </div>
                ))}

                {/* End of Chapter */}
                <div className="py-16 text-center">
                    <p className="mb-4 text-zinc-500">End of Chapter {chapterNum}</p>
                    <div className="flex justify-center gap-4">
                        {chapterNum > 1 && (
                            <Link
                                href={`/comic/${slug}/chapter/${chapterNum - 1}`}
                                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white hover:bg-zinc-700"
                            >
                                <ArrowLeft size={16} />
                                Previous
                            </Link>
                        )}
                        <Link
                            href={`/comic/${slug}/chapter/${chapterNum + 1}`}
                            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-green-400"
                        >
                            Next Chapter
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4">
                <Link
                    href={chapterNum > 1 ? `/comic/${slug}/chapter/${chapterNum - 1}` : "#"}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 ${chapterNum > 1
                            ? "bg-zinc-800/80 text-white hover:bg-zinc-700"
                            : "cursor-not-allowed bg-zinc-900/50 text-zinc-600"
                        }`}
                >
                    <ArrowLeft size={16} />
                    Prev
                </Link>

                <div className="flex-1 px-4">
                    <div className="h-1 w-full rounded-full bg-zinc-800">
                        <div className="h-1 w-1/3 rounded-full bg-primary" />
                    </div>
                    <div className="mt-1 text-center text-xs text-zinc-500">
                        Page 1 / {pages.length}
                    </div>
                </div>

                <Link
                    href={`/comic/${slug}/chapter/${chapterNum + 1}`}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-black hover:bg-green-400"
                >
                    Next
                    <ArrowRight size={16} />
                </Link>
            </nav>
        </div>
    );
}
