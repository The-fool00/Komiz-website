"use client";

import { IoLibraryOutline } from "react-icons/io5";
import Link from "next/link";

export default function LibraryContent() {
    return (
        <div className="text-center py-20 text-zinc-500">
            <IoLibraryOutline size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-white mb-2">Your Library is empty</h3>
            {/* TODO: Check if viewing your own profile or others */}
            <p>Start adding comics to your library to track them here.</p>
            <Link href="/browse" className="inline-block mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors">
                Browse Comics
            </Link>
        </div>
    );
}
