"use client";

import { ChatCircle } from "@phosphor-icons/react";

export default function CommentsContent() {
    return (
        <div className="text-center py-20 text-zinc-500">
            <ChatCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No comments yet.</p>
        </div>
    );
}
