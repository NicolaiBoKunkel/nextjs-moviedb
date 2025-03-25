"use client";

import { useEffect, useState } from "react";
import { getPopularMovies, Movie } from "@/lib/apis/movieApi";
import MovieCard from "./movieCard";

const PopularMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getPopularMovies();
                setMovies(data);
            } catch (err) {
                setError("Failed to load movies");
                console.error(err);
            }
        };

        fetchMovies();
    }, []);

    if (error) return <div>{error}</div>;
    if (!movies.length) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default PopularMovies;
