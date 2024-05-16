'use client'
import { useState, useEffect } from "react";
import { getHighestRatedMovies } from "@/store/apis/movieApi";
import MovieCard from "./movieCard";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

const HighRatedMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const moviesData = await getHighestRatedMovies();
        setMovies(moviesData);
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default HighRatedMovies;