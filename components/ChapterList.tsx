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

// API-compatible chapter interface with group object
interface GroupInfo {
    id: string;
    name: string;
    slug?: string;
}

export interface ChapterProps {
    id: string;
    chapter_num: number;
    title: string | null;
    created_at: string;
    group_id?: string | null;
    group?: GroupInfo | null;
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

    // Build reader URL: /comic/{slug}/chapter-{num}-{groupId}
    const buildChapterUrl = (chapter: ChapterProps) => {
        if (!chapter.group_id) return "#"; // Fallback if no group assigned
        return `/comic/${slug}/chapter-${chapter.chapter_num}-${chapter.group_id}`;
    };

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
                    <div className="w-24 text-right">Group</div>
                    <div className="w-16 text-right">Uploaded</div>
                </div>
            </div>

            {/* List */}
            <div className="rounded-lg bg-zinc-900/40 border border-zinc-800/50 overflow-hidden max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                {sortedChapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/50 transition-colors"
                    >
                        {/* Left: Chapter Title (clickable) */}
                        <Link
                            href={buildChapterUrl(chapter)}
                            className="text-sm font-medium text-zinc-200 hover:text-primary transition-colors"
                        >
                            {chapter.title || `Chapter ${chapter.chapter_num}`}
                        </Link>

                        {/* Right: Meta (Group clickable, Time) */}
                        <div className="flex items-center gap-6 text-xs">
                            {chapter.group ? (
                                <Link
                                    href={`/group/${chapter.group.slug || chapter.group.id}`}
                                    className="w-24 text-right truncate text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {chapter.group.name}
                                </Link>
                            ) : (
                                <span className="w-24 text-right truncate text-zinc-600">-</span>
                            )}

                            <div className="w-16 text-right text-zinc-500">
                                {formatShortTime(chapter.created_at)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
