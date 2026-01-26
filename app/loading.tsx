export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Skeleton Announcement */}
            <div className="mb-8 h-20 animate-pulse rounded-lg bg-zinc-800" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-3">
                    <div className="mb-4 h-8 w-48 animate-pulse rounded bg-zinc-800" />

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div
                                key={i}
                                className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-800"
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-1">
                    <div className="mb-4 h-8 w-32 animate-pulse rounded bg-zinc-800" />

                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-20 w-14 animate-pulse rounded bg-zinc-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                                    <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                                    <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
