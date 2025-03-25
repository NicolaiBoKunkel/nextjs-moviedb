'use client';

import Link from 'next/link'; 
import Image from 'next/image';
import NavLink from "./nav-link";
import SearchBar from "./SearchBar"; // <-- import the component
import logoImg from '/public/movie_black2.jpg';

export default function Header() {
  return (
    <nav className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-teal-500 p-6 gap-4">
      
      {/* Logo and navigation */}
      <div className="flex items-center space-x-4 w-full lg:w-auto">
        <Link href="/">
          <div className="rounded-full overflow-hidden">
            <Image src={logoImg} alt="movie img" priority width="75" height="75" />
          </div>
        </Link>
        <div className="space-x-4 text-xl">
          <NavLink href="/popularMovies">Popular Movies</NavLink>
          <NavLink href="/highestRatedMovies">Highest Rated Movies</NavLink>
          <NavLink href="/popularTv">TV</NavLink>
          <NavLink href="/aboutUs">About</NavLink>
        </div>
      </div>

      {/* Search bar */}
      <div className="w-full lg:w-96">
        <SearchBar />
      </div>

    </nav>
  );
}
