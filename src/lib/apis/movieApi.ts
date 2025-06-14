// Use environment variable in production, fallback to localhost for development
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

export interface Tv {
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
    return data;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
    return await fetcher(`${baseUrl}/movies/popular`);
};
  
export const getHighestRatedMovies = async (): Promise<Movie[]> => {
    return await fetcher(`${baseUrl}/movies/top-rated`);
};
  
export const getPopularTvShows = async (): Promise<Tv[]> => {
    return await fetcher(`${baseUrl}/tv/popular`);
};

export const getHighestRatedTvShows = async (): Promise<Tv[]> => {
    return await fetcher(`${baseUrl}/tv/top-rated`);
};

export const searchMedia = async (query: string) => {
    return await fetcher(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
};
