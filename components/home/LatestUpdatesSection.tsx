import UpdateCard from "@/components/UpdateCard";
import { getComics } from "@/lib/api";
import { formatShortTime } from "@/lib/time";
import Link from "next/link";

export default async function LatestUpdatesSection() {
    const { items } = await getComics({ page: 1, size: 12, sort_by: "latest" });

    return (
        <div>
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-2">
                <h2 className="text-xl font-bold text-white">Latest Updates</h2>
                <Link href="/browse?sort_by=updated_at" className="text-xs font-bold text-zinc-500 hover:text-white uppercase">View All</Link>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {items.map((comic) => (
                    <UpdateCard
                        key={comic.id}
                        title={comic.title}
                        cover={comic.cover_url || "/placeholder.png"}
                        chapter={comic.last_chapter ? `Chap ${comic.last_chapter.chapter_num}` : "-"}
                        time={comic.last_chapter?.created_at ? formatShortTime(comic.last_chapter.created_at) : (comic.updated_at ? formatShortTime(comic.updated_at) : comic.status)}
                        slug={comic.slug}
                        group={comic.last_chapter?.group?.name || "-"}
                    />
                ))}
            </div>
        </div>
    );
}
