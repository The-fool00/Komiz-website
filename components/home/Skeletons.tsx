export function CarouselSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-zinc-800 animate-pulse" />
            <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] w-40 shrink-0 rounded-lg bg-zinc-900 animate-pulse" />
                ))}
            </div>
        </div>
    );
}

export function GridSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="h-8 w-48 rounded bg-zinc-800 animate-pulse" />
                <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] w-full rounded-lg bg-zinc-900 animate-pulse" />
                ))}
            </div>
        </div>
    );
}

export function SidebarSkeleton() {
    return (
        <div className="h-[500px] w-full rounded-lg bg-zinc-900 animate-pulse" />
    );
}
