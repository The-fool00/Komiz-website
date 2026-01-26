import { getGroup, getGroupChapters } from "@/lib/api";
import { MangaUpdatesIcon } from "@/components/icons/MangaUpdatesIcon";
import { Globe, DiscordLogo, XLogo, BookBookmark, EnvelopeSimple, SealCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatShortTime } from "@/lib/time";
import { marked } from "marked";

interface GroupPageProps {
    params: Promise<{ name: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
    const { name } = await params;

    let group;
    try {
        group = await getGroup(name);
    } catch (e) {
        notFound();
    }

    const chapters = await getGroupChapters(name);
    const descriptionHtml = group.description ? await marked(group.description) : null;

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-6 pb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <span className="text-xl">←</span> Back to Home
                </Link>
            </div>

            <div className="container mx-auto px-4 pb-12">
                {/* Group Header Card */}
                <div
                    className="relative mb-12 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl"
                    style={{
                        backgroundColor: "#121212",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='324' height='38.9' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='2' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                >
                    {/* Gradient Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/90 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 p-10 md:p-14">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div className="h-32 w-32 rounded-2xl bg-zinc-800 shadow-xl flex items-center justify-center text-5xl font-black text-white/20 border-2 border-zinc-700/50">
                                {group.name.charAt(0)}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 pt-2">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    {group.name}
                                </h1>
                                {group.official && (
                                    <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-500 border border-blue-500/20">
                                        <SealCheck size={16} weight="fill" />
                                        OFFICIAL
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {group.website && (
                                    <a href={group.website} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-primary hover:text-black transition-all">
                                        <Globe size={18} weight="bold" />
                                        Website
                                    </a>
                                )}
                                {group.discord && (
                                    <a href={`https://discord.gg/${group.discord}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-[#5865F2]/10 px-4 py-2 text-sm font-bold text-[#5865F2] hover:bg-[#5865F2] hover:text-white border border-[#5865F2]/20 transition-all">
                                        <DiscordLogo size={18} weight="fill" />
                                        Discord
                                    </a>
                                )}
                                {group.twitter && (
                                    <a href={group.twitter} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-[#1DA1F2]/10 px-4 py-2 text-sm font-bold text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white border border-[#1DA1F2]/20 transition-all">
                                        <XLogo size={18} weight="bold" />
                                        Twitter
                                    </a>
                                )}
                                {group.mangaupdates_url && (
                                    <a href={group.mangaupdates_url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-500 hover:bg-orange-500 hover:text-white border border-orange-500/20 transition-all">
                                        <MangaUpdatesIcon size={18} />
                                        MangaUpdates
                                    </a>
                                )}
                                {group.email && (
                                    <a href={`mailto:${group.email}`}
                                        className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white hover:text-black transition-all">
                                        <EnvelopeSimple size={18} weight="bold" />
                                        Email
                                    </a>
                                )}
                            </div>

                            {descriptionHtml && (
                                <div
                                    className="prose prose-invert max-w-2xl text-zinc-400 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Split: Chapters & Stats/Sidebar potentially? For now just chapters cleanly */}
                <div className="max-w-5xl mx-auto">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="h-8 w-1.5 rounded-full bg-primary block"></span>
                                Recent Uploads
                            </h2>
                            <span className="text-sm font-medium text-zinc-500">{chapters.length} releases</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {chapters.length > 0 ? (
                                chapters.map((chapter) => (
                                    <div key={chapter.id} className="group relative flex items-center justify-between rounded-xl bg-zinc-900/50 p-4 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 font-bold text-sm">
                                                CH
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg group-hover:text-primary transition-colors">Chapter {chapter.chapter_num}</p>
                                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{formatShortTime(chapter.created_at)}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/comic/${chapter.comic_id}/chapter-${chapter.chapter_num}-${group.id}`}
                                            className="relative z-10 px-6 py-2.5 rounded-lg bg-zinc-800 text-sm font-bold text-white hover:bg-primary hover:text-black transition-all shadow-lg shadow-black/20"
                                        >
                                            Read Chapter
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
                                    <p className="text-zinc-500 font-medium">No chapters uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
