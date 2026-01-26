"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        async function initAuth() {
            if (storedToken) {
                try {
                    // Fetch fresh user data
                    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.komiz.dev/v1";
                    const res = await fetch(`${API_BASE}/auth/me`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                        setToken(storedToken);
                        // Update local storage with fresh data
                        localStorage.setItem("user", JSON.stringify(userData));
                    } else {
                        // Token invalid or expired
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                        setUser(null);
                    }
                } catch (e) {
                    console.error("Failed to fetch user data", e);
                    // Fallback to stored user if fetch fails (offline?) or clear?
                    // Safer to clear or keep as is? Let's keep as is but try to parse stored user as fallback
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) setUser(JSON.parse(storedUser));
                }
            }
            setIsLoading(false);
        }

        initAuth();
    }, []);

    const login = (userData: User, newToken: string) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
