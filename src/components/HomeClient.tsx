'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MovieCard from '@/components/movieCard';
import TvCard from '@/components/tvCard';
import { getDiscoveredMovies, getDiscoveredTvShows, Movie, Tv } from '@/lib/apis/movieApi';
import homeImg from '/public/home.jpg';

export default function HomeClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Tv[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscover = async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          getDiscoveredMovies(),
          getDiscoveredTvShows(),
        ]);
        setMovies(movieData.slice(0, 8));
        setTvShows(tvData.slice(0, 8));
      } catch (err) {
        console.error('Error fetching discover data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscover();
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      <Image
        src={homeImg}
        alt="background"
        fill
        className="object-cover object-center z-0"
        priority
      />

      <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />

      <div className="relative z-20 pt-4 pb-12 px-4 max-w-6xl mx-auto">
        {!loading && (
          <div className="bg-black bg-opacity-50 rounded-md p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              TMDB with Next.js
            </h1>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span>Fresh selection of Movies for you</span>
            </h2>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact />
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span>Fresh selection of TV Shows for you</span>
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {tvShows.map((tv) => (
                <TvCard key={tv.id} tv={tv} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
