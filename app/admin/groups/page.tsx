import { getGroups } from "@/lib/api";
import Link from "next/link";
import { Users, Link as LinkIcon } from "@phosphor-icons/react/dist/ssr";
import AddGroupButton from "@/components/admin/AddGroupButton";

export default async function AdminGroupsPage() {
    const groups = await getGroups();

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white">Manage Groups</h1>
                    <AddGroupButton />
                </div>
                <Link
                    href="/admin"
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
                >
                    Back to Dashboard
                </Link>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 text-xs font-bold uppercase text-zinc-500">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Website</th>
                            <th className="px-6 py-3">Official</th>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <tr key={group.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-zinc-500" />
                                            {group.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {group.website ? (
                                            <a
                                                href={group.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-400 hover:underline"
                                            >
                                                <LinkIcon size={14} />
                                                Visit
                                            </a>
                                        ) : (
                                            <span className="text-zinc-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {group.official ? (
                                            <span className="rounded bg-green-500/10 px-2 py-1 text-xs font-bold text-green-500">
                                                Official
                                            </span>
                                        ) : (
                                            <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-bold text-zinc-500">
                                                Fan Group
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                                        {group.id}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/group/${group.slug}`}
                                            className="font-medium text-primary hover:text-green-400"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                    No scanlation groups found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
