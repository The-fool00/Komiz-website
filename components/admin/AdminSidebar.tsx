
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SquaresFour,
    Users,
    Books,
    Files, // Chapters
    ShieldCheck, // Groups
    Gear,
    SignOut,
    ArrowLeft
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: "Overview", href: "/admin", icon: SquaresFour },
        { name: "Comics", href: "/admin/comics", icon: Books },
        { name: "Chapters", href: "/admin/chapters", icon: Files },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Groups", href: "/admin/groups", icon: ShieldCheck },
        { name: "Settings", href: "/admin/settings", icon: Gear },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-[#0f1115]">
            <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tighter text-white">
                        Komi<span className="text-primary">Z</span>
                        <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-500">Admin</span>
                    </span>
                </Link>
            </div>

            <div className="flex h-full flex-col justify-between py-6">
                <nav className="space-y-1 px-3">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-black"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                            >
                                <link.icon size={20} weight={isActive ? "fill" : "regular"} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-1 px-3 pb-20">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Site
                    </Link>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                    >
                        <SignOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
