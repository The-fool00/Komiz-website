"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MagnifyingGlass,
    ListDashes,
    CaretDown,
    ArrowDown,
    ArrowUp
} from "@phosphor-icons/react";
import { formatShortTime } from "@/lib/time";
import { Chapter } from "@/lib/mockdata"; // Use shared interface or redefine

// Re-defining interface to avoid importing from "mockdata" if it causes issues, 
// but strictly we should share types. Assuming mockdata exports it.
export interface ChapterProps {
    id: string;
    chapter_num: number;
    title: string;
    updated_at: string;
    group_name: string;
    likes?: number;
}

export default function ChapterList({ chapters, slug }: { chapters: ChapterProps[], slug: string }) {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const toggleSort = () => {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    };

    const sortedChapters = [...chapters].sort((a, b) => {
        return sortOrder === "asc"
            ? a.chapter_num - b.chapter_num
            : b.chapter_num - a.chapter_num;
    });

    return (
        <div className="mt-10">
            {/* Header / Search Controls */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Go to chap..."
                        className="w-full rounded bg-zinc-800 border border-zinc-700 py-1.5 px-3 text-sm text-white focus:outline-none focus:border-zinc-600"
                    />
                    <MagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                </div>
                <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700">
                        <ListDashes size={16} />
                    </button>
                    <button className="flex h-8 items-center gap-2 rounded bg-zinc-800 px-3 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-700">
                        All <CaretDown size={12} weight="fill" />
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <button
                    onClick={toggleSort}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                >
                    {sortOrder === "desc" ? (
                        <ArrowDown size={14} weight="bold" />
                    ) : (
                        <ArrowUp size={14} weight="bold" />
                    )}
                    Chapter
                </button>
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-1 cursor-default">
                        Group
                    </div>
                    <div className="flex items-center gap-1 cursor-default">
                        Updated
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="rounded-lg bg-zinc-900/40 border border-zinc-800/50 overflow-hidden max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                {sortedChapters.map((chapter) => (
                    <Link
                        key={chapter.id}
                        href={`/comic/${slug}/${chapter.chapter_num}`}
                        className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/50 transition-colors group"
                    >
                        {/* Left: Chapter Title */}
                        <div className="text-sm font-medium text-zinc-200 group-hover:text-primary transition-colors">
                            {chapter.title}
                        </div>

                        {/* Right: Meta (Group, Time) */}
                        <div className="flex items-center gap-6 text-xs text-zinc-500">
                            <span className="w-20 text-right truncate text-zinc-600 group-hover:text-zinc-400">{chapter.group_name}</span>

                            <div className="flex items-center gap-1 min-w-[2.5rem] justify-end">
                                <span>{formatShortTime(chapter.updated_at)}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
