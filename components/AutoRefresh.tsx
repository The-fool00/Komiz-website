"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRefresh() {
    const router = useRouter();

    useEffect(() => {
        // Refresh the page data every 5 seconds
        const interval = setInterval(() => {
            router.refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
