import Image from "next/image";
import Link from "next/link";

interface ComicCardProps {
  rank?: number;
  title: string;
  cover: string;
  chapter: string;
  time: string;
  slug: string;
  variant?: "overlay" | "standard";
  group?: string;
}

export default function ComicCard({ rank, title, cover, chapter, time, slug, variant = "overlay", group }: ComicCardProps) {
  if (variant === "standard") {
    return (
      <Link href={`/comic/${slug}`} className="group block w-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-md">
          {/* Cover Image */}
          <Image
            src={(cover?.startsWith("http") || cover?.startsWith("/")) ? cover : "/placeholder.png"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Rank Badge */}
          {rank && (
            <div className="absolute top-0 right-2 z-10 w-8 bg-black pt-1 pb-3 text-center">
              <span className="text-xl font-bold italic text-white drop-shadow-md leading-none">{rank}</span>
              <div className="absolute -bottom-1.5 left-0 right-0 h-2 bg-black [clip-path:polygon(0_0,50%_100%,100%_0)]" />
            </div>
          )}
        </div>

        {/* Info Below */}
        <div className="mt-2">
          <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-medium text-zinc-300">{chapter}</span>
            <span className="capitalize">{time}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/comic/${slug}`} className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg">
      {/* Cover Image */}
      <div className="absolute inset-0">
        <Image
          src={(cover?.startsWith("http") || cover?.startsWith("/")) ? cover : "/placeholder.png"}
          alt={title}
          fill
          className="object-cover transition-opacity group-hover:opacity-80"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      {/* Rank Badge */}
      {rank && (
        <div className="absolute top-0 right-2 z-10 w-8 bg-black pt-1 pb-3 text-center">
          <span className="text-xl font-bold italic text-white drop-shadow-md leading-none">{rank}</span>
          <div className="absolute -bottom-1.5 left-0 right-0 h-2 bg-black [clip-path:polygon(0_0,50%_100%,100%_0)]" />
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-6">
        <h3 className="mb-0.5 line-clamp-2 text-sm font-bold text-white shadow-black drop-shadow-sm leading-tight text-center">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-zinc-300 font-medium">
          <span className="text-primary">{chapter}</span>
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
}
