import useSWR from 'swr';

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
        throw new Error("An error occurred while fetching the data.");
    }
    const data = await response.json();
    return data.results || [];
};

export const usePopularMovies = () => {
    const { data, error } = useSWR<Movie[]>(`${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error
    };
};

export const useHighestRatedMovies = () => {
    const { data, error } = useSWR<Movie[]>(`${baseUrl}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error
    };
};

export const usePopularTvShows = () => {
    const { data, error } = useSWR<Tv[]>(`${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error
    };
};





