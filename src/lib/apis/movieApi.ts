// Use environment variable in production, fallback to localhost for development
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Common types
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

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: Array<{
    id: number;
    media_type: string;
    title?: string;
    name?: string;
    poster_path: string | null;
  }>;
}

export interface TMDBResponse<T> {
  page: number;
  total_pages: number;
  results: T[];
  total_results: number;
}

// Internal fetcher
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while trying to fetch the data.");
  }
  return await response.json();
};


// Popular Movies
export const getPopularMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return await fetcher(`${baseUrl}/movies/popular?page=${page}`);
};

// Top Rated Movies
export const getHighestRatedMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return await fetcher(`${baseUrl}/movies/top-rated?page=${page}`);
};

// Popular TV Shows
export const getPopularTvShows = async (page: number = 1): Promise<TMDBResponse<Tv>> => {
  return await fetcher(`${baseUrl}/tv/popular?page=${page}`);
};

// Top Rated TV Shows
export const getHighestRatedTvShows = async (page: number = 1): Promise<TMDBResponse<Tv>> => {
  return await fetcher(`${baseUrl}/tv/top-rated?page=${page}`);
};

// Popular People
export const getPopularPeople = async (page: number = 1): Promise<TMDBResponse<Person>> => {
  return await fetcher(`${baseUrl}/people/popular?page=${page}`);
};

// Search (remains unpaginated for now — you can expand later if needed)
export const searchMedia = async (query: string) => {
  return await fetcher(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
};


// Discover Movies
export const getDiscoveredMovies = async (): Promise<Movie[]> => {
  return await fetcher(`${baseUrl}/discover/movies`);
};

// Discover TV Shows
export const getDiscoveredTvShows = async (): Promise<Tv[]> => {
  return await fetcher(`${baseUrl}/discover/tv`);
};
