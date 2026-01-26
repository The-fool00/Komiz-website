"use client";

import { use, useEffect, useState } from "react";
import { User, ChatCircle, Gear, SignOut, Camera } from "@phosphor-icons/react";
import { IoLibraryOutline, IoLibrary } from "react-icons/io5";
import md5 from "blueimp-md5";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function UserLayout({ params, children }: { params: Promise<{ id: string }>, children: React.ReactNode }) {
    const { id } = use(params);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Ideally fetch user by ID from API if viewing others,
        // but for now relying on local user for "Edit Profile" context.
        // User requested URL structure.
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [id]);

    const gravatarUrl = user ? `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp` : "/placeholder-user.jpg";

    // Determine active tab based on URL
    // URL: /users/[id]/[tab]
    const currentTab = pathname.split("/").pop();

    const tabs = [
        { name: "Profile", path: "profile", icon: User },
        { name: "Library", path: "library", icon: IoLibraryOutline },
        { name: "Comments", path: "comments", icon: ChatCircle },
        { name: "Settings", path: "settings", icon: Gear },
    ];

    return (
        <div className="min-h-screen bg-[#121212] pb-20">
            {/* Banner */}
            <div className="profile-banner h-48 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]/90"></div>

                <div className="container mx-auto px-4 h-full flex items-end relative z-10">
                    <div className="flex items-end gap-6 translate-y-12 w-full">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full border-4 border-[#121212] overflow-hidden bg-zinc-800">
                                <img src={gravatarUrl} alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-black shadow-lg hover:bg-green-400 transition-colors" title="Change Avatar">
                                <Camera size={18} weight="bold" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="mb-4 flex-1">
                            <h1 className="text-3xl font-bold text-white mb-1">{user?.username || "Guest User"}</h1>
                            <p className="text-zinc-400 text-sm">@{user?.username || "guest"}</p>
                        </div>

                        <div className="mb-8 hidden md:block">
                            <button className="flex items-center gap-2 px-4 py-2 rounded border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm font-medium">
                                <SignOut size={16} />
                                LOGOUT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mt-16 border-b border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const isActive = currentTab === tab.path || (tab.path === "profile" && pathname.endsWith(id));
                            // Handle root /users/[id] defaulting to profile potentially

                            let Icon = tab.icon;
                            if (tab.name === "Library") {
                                Icon = isActive ? IoLibrary : IoLibraryOutline;
                            }

                            return (
                                <Link
                                    key={tab.name}
                                    href={`/users/${id}/${tab.path}`}
                                    className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${isActive
                                            ? "text-white"
                                            : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                >
                                    {tab.name === "Library" ? (
                                        <Icon size={20} />
                                    ) : (
                                        <Icon size={20} weight={isActive ? "fill" : "regular"} />
                                    )}
                                    {tab.name}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}
