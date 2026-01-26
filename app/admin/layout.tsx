
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/");
            } else if (user.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
                Loading...
            </div>
        );
    }

    if (!user || user.role !== "admin") return null;

    return (
        <div className="flex min-h-screen bg-[#121212]">
            <AdminSidebar />
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
