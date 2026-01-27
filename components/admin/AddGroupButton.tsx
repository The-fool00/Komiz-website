"use client";

import { useState } from "react";
import { Plus, Check, X, Spinner } from "@phosphor-icons/react";
import { importGroup } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddGroupButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await importGroup(id.trim());
            setId("");
            setIsOpen(false);
            router.refresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to import group");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:bg-green-400"
            >
                <Plus size={16} weight="bold" />
                Add Group
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Import Group</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-xs font-bold uppercase text-zinc-500">
                            MangaDex Group UUID
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="e.g. 00e03853-1b96-4f41-9542-c71b8692033b"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-xs text-red-500">{error}</p>
                        )}
                        <p className="mt-2 text-xs text-zinc-500">
                            Paste the UUID from the MangaDex group URL. The system will automatically scrape details.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !id.trim()}
                            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner size={16} className="animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Check size={16} weight="bold" />
                                    Import Group
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
