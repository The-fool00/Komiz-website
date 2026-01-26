"use client";

import { useEffect, useState } from "react";
import { Key } from "@phosphor-icons/react";

export default function ProfileContent() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">User ID</label>
                    <input
                        type="text"
                        value={user?.id || "N/A"}
                        disabled
                        className="w-full rounded bg-zinc-800/50 border border-zinc-700 px-4 py-3 text-zinc-400 focus:outline-none cursor-not-allowed"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Username</label>
                    <input
                        type="text"
                        value={user?.username || ""}
                        readOnly
                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Email Address</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Display Name</label>
                    <input
                        type="text"
                        defaultValue={user?.username || ""}
                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                        <Key size={18} />
                        Change Password
                    </button>
                </div>

                <div className="pt-4">
                    <button className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-green-400 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
