"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useRef } from "react";
import ComicCard from "./ComicCard";
import { Comic } from "@/lib/api";
import { formatShortTime } from "@/lib/time";

interface ComicCarouselProps {
    title: string;
    comics: Comic[];
    showRank?: boolean;
    variant?: "overlay" | "standard" | "followed";
}

export default function ComicCarousel({ title, comics, showRank = false, variant = "overlay" }: ComicCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8; // Scroll 80% of view
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (comics.length === 0) return null;

    return (
        <div>
            <div className="mb-4 flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <CaretLeft size={16} weight="bold" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <CaretRight size={16} weight="bold" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-1 -mx-1 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {comics.map((comic, index) => (
                    <div key={comic.id} className="w-[140px] sm:w-[150px] md:w-[160px] flex-shrink-0 snap-start">
                        <ComicCard
                            rank={showRank ? index + 1 : undefined}
                            title={comic.title}
                            cover={comic.cover_url || "/placeholder.png"}
                            chapter={comic.last_chapter ? `Chap ${comic.last_chapter.chapter_num}` : "-"}
                            time={comic.last_chapter?.created_at ? formatShortTime(comic.last_chapter.created_at) : "-"}
                            slug={comic.slug}
                            variant={variant}
                            group={comic.last_chapter?.group?.name || "-"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
