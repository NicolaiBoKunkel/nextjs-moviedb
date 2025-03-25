'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  original_language: string;
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  production_companies: { name: string; logo_path: string | null }[];
}

const MovieDetailPage = () => {
  const { movie: id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/movies/${id}/details`)
        .then(res => res.json())
        .then(setMovie)
        .catch(err => console.error("Error fetching movie:", err));
    }
  }, [id]);

  if (!movie) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
  {/* Backdrop (only if available) */}
  {movie.backdrop_path && (
    <div
      className="w-full h-[400px] bg-cover bg-center brightness-75"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    />
  )}

  {/* Dynamic margin depending on whether backdrop exists */}
  <div className={`max-w-5xl mx-auto px-4 ${movie.backdrop_path ? "-mt-48" : "pt-10"} relative z-10`}>
    <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full md:w-1/3 object-cover"
      />

      {/* Info */}
      <div className="p-6 space-y-3 flex-1">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        {movie.tagline && <p className="italic text-teal-600">"{movie.tagline}"</p>}

        <p className="text-gray-700">{movie.overview}</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
          <p><strong>Runtime:</strong> ⏱️ {movie.runtime} minutes</p>
          <p><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        </div>

        {movie.production_companies.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700 mb-1">Production Companies</h3>
            <div className="flex flex-wrap gap-4">
              {movie.production_companies.map((company) => (
                <div key={company.name} className="flex items-center gap-2">
                  {company.logo_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                      alt={company.name}
                      className="h-6"
                    />
                  )}
                  <span className="text-sm">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default MovieDetailPage;
