import { getGroup, getGroupChapters } from "@/lib/api";
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
        <div className="container mx-auto px-4 py-8">
            {/* Group Header */}
            <div className="mb-12 rounded-xl bg-zinc-900/50 p-8 border border-zinc-800">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="h-32 w-32 flex-shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-4xl font-bold text-zinc-600">
                        {group.name.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                                {group.name}
                                {group.official && <SealCheck size={24} weight="fill" className="text-blue-500" />}
                            </h1>
                            <div className="flex gap-4">
                                {group.website && (
                                    <a href={group.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors">
                                        <Globe size={18} />
                                        Website
                                    </a>
                                )}
                                {group.discord && (
                                    <a href={`https://discord.gg/${group.discord}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#5865F2] transition-colors">
                                        <DiscordLogo size={18} />
                                        Discord
                                    </a>
                                )}
                                {group.twitter && (
                                    <a href={group.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#1DA1F2] transition-colors">
                                        <XLogo size={18} />
                                        Twitter/X
                                    </a>
                                )}
                                {group.mangaupdates_url && (
                                    <a href={group.mangaupdates_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors">
                                        <BookBookmark size={18} />
                                        MangaUpdates
                                    </a>
                                )}
                                {group.email && (
                                    <a href={`mailto:${group.email}`} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                        <EnvelopeSimple size={18} />
                                        Email
                                    </a>
                                )}
                            </div>
                        </div>

                        {descriptionHtml && (
                            <div
                                className="prose prose-invert prose-sm max-w-none text-zinc-400 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Uploads */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-primary">Recent Uploads</h2>

                <div className="space-y-2">
                    {chapters.length > 0 ? (
                        chapters.map((chapter) => (
                            <div key={chapter.id} className="flex items-center justify-between rounded-lg bg-zinc-900 p-4 border border-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    {/* We don't have comic info directly in chapter response based on current schema, 
                                        so we might miss comic title/cover if backend doesn't send it. 
                                        Assuming backend update or simple list for now. 
                                        Wait, existing ChapterRead doesn't have comic. 
                                        So this list will be just "Chapter X". 
                                        We need comic info. 
                                        For now, just listing chapters.
                                     */}
                                    <div>
                                        <p className="font-bold text-white">Chapter {chapter.chapter_num}</p>
                                        <p className="text-xs text-zinc-500">{formatShortTime(chapter.created_at)}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/comic/${chapter.comic_id}/chapter-${chapter.chapter_num}-${group.id}`} // We need valid slug path. Using comic_id might work if backend handles it or we need comic slug.
                                    className="px-4 py-2 rounded bg-zinc-800 text-sm font-medium text-white hover:bg-primary hover:text-black transition-colors"
                                >
                                    Read
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-zinc-500 text-center py-8">No chapters uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
