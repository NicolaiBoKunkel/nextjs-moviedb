import { getPopularMovies } from "@/lib/apis/movieApi";
import MovieCard from "./movieCard";

const PopularMovies = async () => {
    const movies = await getPopularMovies();

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

export default PopularMovies;





