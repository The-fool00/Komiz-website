import Image from "next/image";
import Link from "next/link";

interface UpdateCardProps {
    title: string;
    cover: string;
    chapter: string;
    time: string;
    slug: string;
}

export default function UpdateCard({ title, cover, chapter, time, slug }: UpdateCardProps) {
    return (
        <Link href={`/comic/${slug}`} className="group block w-full">
            {/* Cover Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-md">
                <Image
                    src={(cover?.startsWith("http") || cover?.startsWith("/")) ? cover : "/placeholder.png"}
                    alt={title}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-80"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
                {/* Shadow overlay for depth if needed, but per reference it looks clean */}
            </div>

            {/* Info Row */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-medium px-0.5">
                <span className="text-zinc-400">{chapter}</span>
                <span>{time}</span>
            </div>

            {/* Title */}
            <h3 className="mt-1 text-center text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors px-1">
                {title}
            </h3>
        </Link>
    );
}
