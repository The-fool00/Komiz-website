"use client";

import { useState } from "react";
import { ArrowsClockwise, Spinner } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UpdateAllButton() {
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const router = useRouter();

    const handleUpdate = async () => {
        if (!confirm("This will start a background process to update ALL comics from MangaUpdates. It may take a long time. Are you sure?")) return;

        setLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.komiz.dev/v1";
            const res = await fetch(`${API_BASE}/comics/refresh-all`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message); // "Background update started..."
            } else {
                alert("Failed to start update process");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating comics");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
        >
            {loading ? <Spinner className="animate-spin" size={20} /> : <ArrowsClockwise size={20} weight="bold" />}
            Update All
        </button>
    );
}
