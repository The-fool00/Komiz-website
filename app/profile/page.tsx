"use client";

import { useState, useEffect } from "react";
import { User, Books, ChatCircle, Gear, SignOut, Camera, Key } from "@phosphor-icons/react";
import md5 from "blueimp-md5";
import Link from "next/link";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const gravatarUrl = user ? `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp` : "/placeholder-user.jpg";

    const tabs = [
        { name: "Profile", icon: User },
        { name: "Library", icon: Books },
        { name: "Comments", icon: ChatCircle },
        { name: "Settings", icon: Gear },
    ];

    return (
        <div className="min-h-screen bg-[#121212] pb-20">
            {/* Banner */}
            <div className="profile-banner h-48 w-full relative">
                {/* Overlay gradient for better text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]/90"></div>

                <div className="container mx-auto px-4 h-full flex items-end relative z-10">
                    {/* Profile Header Block overlapped */}
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

                        {/* Logout Button (Top Right of container) */}
                        <div className="mb-8 hidden md:block">
                            <button className="flex items-center gap-2 px-4 py-2 rounded border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm font-medium">
                                <SignOut size={16} />
                                LOGOUT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation - Below Banner */}
            <div className="mt-16 border-b border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.name
                                        ? "text-white"
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                <tab.icon size={20} weight={activeTab === tab.name ? "fill" : "regular"} />
                                {tab.name}
                                {activeTab === tab.name && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-8">
                {activeTab === "Profile" && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Edit Profile Form */}
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
                )}

                {activeTab === "Library" && (
                    <div className="text-center py-20 text-zinc-500">
                        <Books size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-white mb-2">Your Library is empty</h3>
                        <p>Start adding comics to your library to track them here.</p>
                        <Link href="/browse" className="inline-block mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors">
                            Browse Comics
                        </Link>
                    </div>
                )}
                {activeTab === "Comments" && (
                    <div className="text-center py-20 text-zinc-500">
                        <ChatCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No comments yet.</p>
                    </div>
                )}
                {activeTab === "Settings" && (
                    <div className="text-center py-20 text-zinc-500">
                        <Gear size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Settings panel coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
