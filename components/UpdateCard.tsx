import Image from "next/image";
import Link from "next/link";

interface UpdateCardProps {
    title: string;
    cover: string;
    chapter: string;
    time: string;
    slug: string;
    group?: string;
}

export default function UpdateCard({ title, cover, chapter, time, slug, group }: UpdateCardProps) {
    return (
        <Link href={`/comic/${slug}`} className="group block w-full">
            {/* Cover Image */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-md">
                <Image
                    src={(cover?.startsWith("http") || cover?.startsWith("/")) ? cover : "/placeholder.png"}
                    alt={title}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-90"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
            </div>

            {/* Info Below */}
            <div className="mt-2 space-y-0.5">
                <div className="text-sm font-bold text-white">{chapter}</div>
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-zinc-400 font-medium truncate max-w-[60%]">{group || "-"}</span>
                    <span className="text-zinc-500 text-[10px]">•</span>
                    <span className="text-zinc-400 truncate">{time}</span>
                </div>
            </div>
            <h3 className="mt-1 line-clamp-1 text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                {title}
            </h3>
        </Link>
    );
}
