export default function ComicLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-80 w-full animate-pulse bg-zinc-900">
                <div className="container relative mx-auto flex h-full items-end gap-6 px-4 pb-6">
                    <div className="-mb-20 h-64 w-44 animate-pulse rounded-lg bg-zinc-800" />
                    <div className="flex-1 space-y-4 pb-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-zinc-700" />
                        <div className="h-10 w-96 animate-pulse rounded bg-zinc-700" />
                        <div className="flex gap-4">
                            <div className="h-6 w-16 animate-pulse rounded bg-zinc-700" />
                            <div className="h-6 w-20 animate-pulse rounded bg-zinc-700" />
                            <div className="h-6 w-16 animate-pulse rounded bg-zinc-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Buttons */}
                        <div className="flex gap-3">
                            <div className="h-12 w-40 animate-pulse rounded-lg bg-zinc-800" />
                            <div className="h-12 w-32 animate-pulse rounded-lg bg-zinc-800" />
                            <div className="h-12 w-24 animate-pulse rounded-lg bg-zinc-800" />
                        </div>

                        {/* Synopsis */}
                        <div className="space-y-3">
                            <div className="h-6 w-24 animate-pulse rounded bg-zinc-800" />
                            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="h-40 animate-pulse rounded-lg bg-zinc-800" />
                    </div>
                </div>
            </div>
        </div>
    );
}
