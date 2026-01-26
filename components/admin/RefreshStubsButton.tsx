"use client";

import { useState } from "react";
import { DownloadSimple, Spinner } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RefreshStubsButton() {
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const router = useRouter();

    const handleRefresh = async () => {
        if (!confirm("This will fetch metadata for all stub comics. It might take a while. Continue?")) return;

        setLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.komiz.dev/v1";
            const res = await fetch(`${API_BASE}/comics/refresh-stubs`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                router.refresh();
            } else {
                alert("Failed to refresh stubs");
            }
        } catch (e) {
            console.error(e);
            alert("Error refreshing stubs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
        >
            {loading ? <Spinner className="animate-spin" size={20} /> : <DownloadSimple size={20} weight="bold" />}
            Load Stubs
        </button>
    );
}
