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

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("An error occurred while trying to fetch the data.");
    }
    const data = await response.json();
    return data.results || [];
};

export const getPopularMovies = async (): Promise<Movie[]> => {
    return await fetcher(`${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
};

export const getHighestRatedMovies = async (): Promise<Movie[]> => {
    return await fetcher(`${baseUrl}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
};

export const getPopularTvShows = async (): Promise<Tv[]> => {
    return await fetcher(`${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`);
};





