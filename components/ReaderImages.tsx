"use client";

interface ReaderImagesProps {
    pages: string[];
    slug: string;
    groupId: string;
    chapterNum: number;
}

export default function ReaderImages({ pages, slug, groupId, chapterNum }: ReaderImagesProps) {
    // Build pretty proxy URL
    const getPrettyProxyUrl = (pageIndex: number) => {
        const pageNum = pageIndex + 1; // 1-indexed
        return `https://proxy.komiz.dev/v1/proxy/${slug}/${groupId}/ch-${chapterNum}/${pageNum}.webp`;
    };

    return (
        <div className="flex flex-col">
            {pages.map((_, index) => (
                <img
                    key={index}
                    src={getPrettyProxyUrl(index)}
                    alt={`Page ${index + 1}`}
                    className="w-full h-auto block"
                    loading={index < 5 ? "eager" : "lazy"}
                    decoding="async"
                />
            ))}
        </div>
    );
}
