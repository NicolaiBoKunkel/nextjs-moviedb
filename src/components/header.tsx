'use client';

import { useEffect, useState } from "react";
import Link from 'next/link'; 
import Image from 'next/image';
import NavLink from "./nav-link";
import SearchBar from "./SearchBar";
import logoImg from '/public/movie_black2.jpg';
import { getCurrentUser } from "@/lib/apis/authApi";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-teal-500 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
      
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-6 flex-wrap">
        <Link href="/">
          <div className="rounded-full overflow-hidden">
            <Image src={logoImg} alt="movie img" priority width="75" height="75" />
          </div>
        </Link>
        <div className="flex gap-4 text-lg text-white font-semibold">
          <NavLink href="/popularMovies">Popular Movies</NavLink>
          <NavLink href="/highestRatedMovies">Highest Rated</NavLink>
          <NavLink href="/popularTv">TV</NavLink>
          <NavLink href="/aboutUs">About</NavLink>
        </div>
      </div>

      {/* Right: Search + Auth */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto justify-end">
        <div className="w-full sm:w-80">
          <SearchBar />
        </div>

        {/* Auth Controls */}
        <div className="text-white text-sm flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={`/user/${user.username}`}
                className="hidden sm:inline font-medium underline hover:text-white"
              >
                Welcome, {user.username}!
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-teal-700 font-bold px-3 py-1 rounded hover:bg-teal-100"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
