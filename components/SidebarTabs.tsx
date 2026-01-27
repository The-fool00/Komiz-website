"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Comic } from "@/lib/api";

export default function SidebarTabs({ recent, completed }: { recent: Comic[], completed: Comic[] }) {
    const [tab, setTab] = useState<"recent" | "completed">("recent");

    const comics = tab === "recent" ? recent : completed;

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2 flex items-center gap-4 border-b border-zinc-800 pb-2">
                <button
                    onClick={() => setTab("recent")}
                    className={`text-sm font-bold uppercase transition-colors ${tab === "recent" ? "text-white border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    Recently Added
                </button>
                <button
                    onClick={() => setTab("completed")}
                    className={`text-sm font-bold uppercase transition-colors ${tab === "completed" ? "text-white border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    Complete Series
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {comics.map((comic) => (
                    <Link href={`/comic/${comic.slug}`} key={comic.id} className="flex gap-3 group">
                        {/* Thumbnail */}
                        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded bg-zinc-800 shadow-sm">
                            <Image
                                src={(comic.cover_url?.startsWith("http") || comic.cover_url?.startsWith("/")) ? comic.cover_url : "/placeholder.png"}
                                alt={comic.title}
                                fill
                                className="object-cover transition-opacity group-hover:opacity-80"
                                sizes="64px"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="mb-1 text-[10px] font-bold uppercase text-zinc-500">{comic.type}</div>
                            <h4 className="line-clamp-2 text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">
                                {comic.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                <span className={`${comic.status.toLowerCase() === 'completed' ? 'text-blue-400' : 'text-green-400'}`}>
                                    {comic.status}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-500">{comic.last_chapter ? `Ch.${comic.last_chapter.chapter_num}` : "-"}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
