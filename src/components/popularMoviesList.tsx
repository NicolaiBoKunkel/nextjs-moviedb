'use client';
import { useState, useEffect } from "react";
import MovieCard from "./movieCard";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const apiKey = 'e46278258cc52ec12ec6d0d0582c89b7';
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
            );
            const data = await response.json();
            if (data.results) {
                setMovies(data.results);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    return (
        <div className="row">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
