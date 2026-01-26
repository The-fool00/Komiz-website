
import { getComics } from "@/lib/api";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import RefreshStubsButton from "@/components/admin/RefreshStubsButton";

export default async function AdminComicsPage() {
    const comics = await getComics({ size: 20 });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Comics</h1>
                <div className="flex gap-4">
                    <RefreshStubsButton />
                    <Link
                        href="/admin/comics/new"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-black hover:bg-green-400 transition-colors"
                    >
                        <Plus size={20} weight="bold" />
                        Add Comic
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950 text-xs font-bold uppercase text-zinc-500">
                        <tr>
                            <th className="px-6 py-4">Cover</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {comics.items.map((comic) => (
                            <tr key={comic.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="relative h-12 w-8 overflow-hidden rounded bg-zinc-800">
                                        <Image
                                            src={comic.cover_url || "/placeholder.png"}
                                            alt={comic.title}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-white">{comic.title}</td>
                                <td className="px-6 py-4">
                                    <span className="capitalize">{comic.status}</span>
                                </td>
                                <td className="px-6 py-4">{new Date(comic.created_at || "").toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-blue-500 hover:text-blue-400 transition-colors">
                                            <PencilSimple size={20} />
                                        </button>
                                        <button className="p-2 text-red-500 hover:text-red-400 transition-colors">
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {comics.items.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No comics found.</div>
                )}
            </div>
        </div>
    );
}
