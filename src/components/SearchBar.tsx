'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchMedia } from "@/lib/apis/movieApi";
import Image from "next/image";

let debounceTimer: ReturnType<typeof setTimeout>;

/**
 * SearchBar component that allows users to search for movies or TV shows.
 * It fetches results from the TMDB API and displays suggestions as the user types.
 */

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const data = await searchMedia(query);
        const filtered = data.filter(
          (item: { media_type: string }) =>
            item.media_type === "movie" || item.media_type === "tv"
        );
        setResults(filtered);
        setShowSuggestions(true);
        setError("");
      } catch (err) {
        setError("Search failed");
        setResults([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (item: any) => {
    setResults([]);
    setShowSuggestions(false);
    setQuery("");
    if (item.media_type === "movie") {
      router.push(`/movie/${item.id}`);
    } else if (item.media_type === "tv") {
      router.push(`/tv/${item.id}`);
    }
  };

  const getYear = (date: string | undefined) =>
    date ? new Date(date).getFullYear() : "";

  const getPoster = (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w92${path}` : "/placeholder.png";

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        placeholder="Search for Movies or TV Shows..."
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowSuggestions(true)}
        className="border p-2 rounded w-full"
      />

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {showSuggestions && results.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 bg-white border rounded shadow mt-2 max-h-96 overflow-y-auto">
          {results.map((item) => (
            <li
              key={`${item.media_type}-${item.id}`}
              className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <div className="relative w-12 h-18 min-w-[48px]">
                <Image
                  src={getPoster(item.poster_path)}
                  alt={item.title || item.original_name}
                  fill
                  className="object-cover rounded"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="font-medium">
                  {item.media_type === "movie"
                    ? item.title
                    : item.original_name}{" "}
                  ({getYear(item.release_date || item.first_air_date)})
                </div>
                <div className="text-sm text-gray-500">({item.media_type})</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
