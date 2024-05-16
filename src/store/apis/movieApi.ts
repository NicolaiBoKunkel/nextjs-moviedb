const apiKey = 'e46278258cc52ec12ec6d0d0582c89b7';
const baseUrl = 'https://api.themoviedb.org/3';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

interface Tv {
    id: number;
    original_name: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
}

export const getPopularMovies = async (): Promise<Movie[]> => {
    try {
        const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
};

export const getPopularTvShows = async (): Promise<Tv[]> => {
    try {
        const response = await fetch(`${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching popular TV shows:", error);
        return [];
    }
};

