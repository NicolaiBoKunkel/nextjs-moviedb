"use client";

import { useEffect, useState } from "react";
import { getHighestRatedMovies } from "@/lib/apis/movieApi";
import MovieCard from "./movieCard";
import type { Movie } from "@/lib/apis/movieApi";

const HighRatedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getHighestRatedMovies();
        setMovies(data);
      } catch (err) {
        setError("Failed to load highest-rated movies");
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  if (error) return <div>{error}</div>;
  if (!movies.length) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Highest Rated Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default HighRatedMovies;
