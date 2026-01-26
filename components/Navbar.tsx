"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import md5 from "blueimp-md5";
import {
  MagnifyingGlass,
  Funnel,
  List,
  Shuffle,
  User,
  SignIn,
  SignOut,
  Books,
  ClockCounterClockwise,
  PuzzlePiece,
  Gear
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { getComics, Comic } from "@/lib/api";
import AuthModal from "./AuthModal";

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-500 text-black font-semibold rounded-sm px-0.5">{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function Navbar() {
  const router = useRouter();

  // Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Comic[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check local storage for auth
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        try {
          const res = await getComics({ search: query, size: 5 });
          setResults(res.items);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error", error);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);


  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setShowDropdown(false);
      router.push(`/browse?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setShowDropdown(false);
    setQuery("");
  }

  const handleLoginSuccess = (userData: any, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const gravatarUrl = user ? `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp` : "";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#121212]/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-white">
              Komi<span className="text-primary">Z</span>
            </span>
          </Link>

          {/* Center: Search */}
          <div className="hidden flex-1 items-center justify-center px-8 md:flex relative z-50" ref={dropdownRef}>
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search comic..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length > 1) setShowDropdown(true);
                }}
                onKeyDown={handleSearch}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                className={`w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 pl-10 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${showDropdown ? 'rounded-b-none border-b-0' : ''}`}
              />
              <MagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />

              {!showDropdown && (
                <Link href="/browse" className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-600">
                  <Funnel size={12} weight="fill" />
                  FILTER
                </Link>
              )}

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 bg-[#0f1115] border border-zinc-700 border-t-0 rounded-b-md shadow-2xl overflow-hidden">
                  <div
                    onClick={() => {
                      router.push(`/browse?search=${encodeURIComponent(query)}`);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50"
                  >
                    <MagnifyingGlass size={20} />
                    <span className="text-sm">Advanced search for <strong className="text-white">{query}</strong></span>
                  </div>

                  {results.length > 0 ? (
                    <div className="flex flex-col">
                      {results.map((comic) => (
                        <Link
                          key={comic.id}
                          href={`/comic/${comic.slug}`}
                          onClick={clearSearch}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/30 last:border-0"
                        >
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-sm bg-zinc-800">
                            <Image src={comic.cover_url || "/placeholder.png"} alt={comic.title} fill className="object-cover" sizes="36px" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-medium text-zinc-200 truncate">
                              <HighlightMatch text={comic.title} query={query} />
                            </h4>
                            <p className="text-xs text-zinc-500 truncate">
                              {comic.alt_titles?.[0]?.title ?? comic.type ?? "Comic"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-xs text-zinc-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white">
              <List size={24} />
            </button>
            <button className="text-zinc-400 hover:text-white">
              <Shuffle size={24} />
            </button>

            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-700 hover:border-zinc-500 transition-colors focus:outline-none"
                >
                  <img
                    src={gravatarUrl}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-zinc-800 bg-[#121212] shadow-xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white truncate">{user.username}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <User size={18} />
                        Edit Profile
                      </Link>
                      <Link href="/library" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <Books size={18} />
                        Library
                      </Link>
                      <Link href="/history" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <ClockCounterClockwise size={18} />
                        History
                      </Link>
                    </div>
                    <div className="border-t border-zinc-800 py-1">
                      <Link href="/import-export" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <PuzzlePiece size={18} />
                        Import & Export
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                        <Gear size={18} />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                      >
                        <SignOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 rounded bg-primary px-4 py-1.5 text-sm font-bold text-black hover:bg-green-400"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
