'use client';

import { useHighestRatedMovies } from "@/lib/apis/movieApi";
import MovieCard from "./movieCard";

const HighRatedMovies = () => {
    const { data: movies, isLoading, isError } = useHighestRatedMovies();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies && movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default HighRatedMovies;
