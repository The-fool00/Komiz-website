
import Link from "next/link";
import {
    Users,
    Books,
    Files,
    Database
} from "@phosphor-icons/react/dist/ssr";

async function getStats() {
    // Determine API Base URL properly, ensuring server-side fetch works.
    // In server component, process.env.NEXT_PUBLIC_API_URL is available at build time, 
    // but for runtime we might fallback to localhost if containerized.
    // However, client-side fetches use the public URL. Server-side in Next.js?
    // Let's use the env var.
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/v1";

    try {
        const res = await fetch(`${API_BASE}/utils/health`, { next: { revalidate: 0 } });
        // Health check might not return stats.
        // For now mock stats or fetch from various endpoints?
        // Let's mock for the initial dashboard to ensure UI structure.
        return {
            users: 154,
            comics: 42,
            chapters: 1028,
            storage: "4.2 GB"
        };
    } catch (e) {
        return null;
    }
}

export default async function AdminDashboard() {
    const stats = await getStats() || { users: 0, comics: 0, chapters: 0, storage: "0 GB" };

    const cards = [
        { name: "Total Users", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Total Comics", value: stats.comics, icon: Books, color: "text-green-500", bg: "bg-green-500/10" },
        { name: "Total Chapters", value: stats.chapters, icon: Files, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { name: "Storage Used", value: stats.storage, icon: Database, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon size={24} weight="fill" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-400">{card.name}</p>
                                <p className="text-2xl font-bold text-white">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Groups Management Card Link */}
                <Link href="/admin/groups" className="block group">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:bg-zinc-800/80">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                <Users size={24} weight="fill" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">Scanlation Groups</p>
                                <p className="text-sm font-bold text-white mt-1">Manage Groups &rarr;</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-64">
                    <h3 className="font-bold text-white mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-full text-zinc-500">
                        Chart / Activity Log Placeholder
                    </div>
                </div>

                {/* System Status Placeholder */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-64">
                    <h3 className="font-bold text-white mb-4">System Status</h3>
                    <div className="flex items-center justify-center h-full text-zinc-500">
                        System Health / Services Status
                    </div>
                </div>
            </div>
        </div>
    );
}
