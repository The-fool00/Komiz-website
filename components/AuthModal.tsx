"use client";

import { useState } from "react";
import { X, Envelope, Lock, User, Spinner } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: any, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.komiz.dev/v1";

        // Use NO trailing slashes to match backend definition and avoid 307 Redirects
        const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;

        try {
            let body;
            let headers: any = { "Content-Type": "application/json" };

            if (isLogin) {
                // OAuth2PasswordRequestForm expects form data
                const formData = new URLSearchParams();
                formData.append("username", email); // Backend uses this field for email/username
                formData.append("password", password);
                body = formData;
                headers = { "Content-Type": "application/x-www-form-urlencoded" };
            } else {
                body = JSON.stringify({ username, email, password });
            }

            const res = await fetch(url, {
                method: "POST",
                headers,
                body,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Authentication failed");
            }

            if (isLogin) {
                const token = data.access_token;
                // Fetch User Me
                const meRes = await fetch(`${API_BASE}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const meData = await meRes.json();
                onLoginSuccess(meData, token);
                onClose();
            } else {
                // Register success, switch to login or auto login?
                // Let's auto login or just ask to login
                setIsLogin(true);
                setError("Account created! Please log in.");
                setLoading(false);
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#121212] border border-zinc-800 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="p-8 pb-0 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? "Welcome Back!" : "Join KomiZ"}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {isLogin ? "Login to access your library" : "Create an account to track your reading"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="rounded bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500 text-center">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-zinc-500" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 pl-10 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Username"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">
                            {isLogin ? "Email or Username" : "Email"}
                        </label>
                        <div className="relative">
                            <Envelope className="absolute left-3 top-3 text-zinc-500" size={20} />
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 pl-10 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={isLogin ? "Enter email or username" : "name@example.com"}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-zinc-500" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 pl-10 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3 font-bold text-black hover:bg-green-400 transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        {loading && <Spinner className="animate-spin" size={20} />}
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                {/* Footer Toggle */}
                <div className="bg-zinc-900/50 p-4 text-center text-sm text-zinc-400 border-t border-zinc-800">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="font-bold text-primary hover:underline hover:text-green-400 transition-colors"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}
