'use client'
import { useState, useEffect } from "react";
import { getPopularMovies } from "@/store/apis/movieApi";
import MovieCard from "./movieCard";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

const PopularMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const moviesData = await getPopularMovies();
        setMovies(moviesData);
    };

    return (
        <div>
            <h2>Popular Movies</h2>
            <div className="row">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default PopularMovies;

