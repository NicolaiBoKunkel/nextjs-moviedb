'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addFavorite, removeFavorite, getFavorites } from '@/lib/apis/favoriteApi';

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

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const MovieDetailPage = () => {
  const { movie: id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`${baseUrl}/movies/${id}/details`)
        .then(res => res.json())
        .then(setMovie)
        .catch(err => console.error("Error fetching movie:", err));

      fetch(`${baseUrl}/movies/${id}/trailer`)
        .then(res => res.json())
        .then(data => {
          if (data.trailerKey) setTrailerKey(data.trailerKey);
        })
        .catch(err => console.error("Error fetching trailer:", err));

      fetch(`${baseUrl}/movies/${id}/credits`)
        .then(res => res.json())
        .then(data => setCast(data.cast))
        .catch(err => console.error("Error fetching cast:", err));
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    getFavorites(token)
      .then(data => {
        setIsFavorite(data.favorites.some((fav: any) => fav.mediaId === Number(id) && fav.mediaType === "movie"));
      })
      .catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to favorite this movie.");

    try {
      if (isFavorite) {
        await removeFavorite(Number(id), "movie", token);
        setIsFavorite(false);
      } else {
        await addFavorite(Number(id), "movie", token);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (!movie) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      {movie.backdrop_path && (
        <div
          className="w-full h-[400px] bg-cover bg-center brightness-75"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        />
      )}

      <div className={`max-w-5xl mx-auto px-4 ${movie.backdrop_path ? "-mt-48" : "pt-10"} relative z-10`}>
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative w-full md:w-1/3 h-[450px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="p-6 space-y-3 flex-1">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="italic text-teal-600">&ldquo;{movie.tagline}&rdquo;</p>
            <p className="text-gray-700">{movie.overview}</p>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>TMDB Rating:</strong> ⭐ {movie.vote_average}</p>
              <p><strong>Runtime:</strong> ⏱️ {movie.runtime} minutes</p>
              <p><strong>Language:</strong> {movie.original_language?.toUpperCase() || "N/A"}</p>
              <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
            </div>

            <button
              onClick={toggleFavorite}
              className={`mt-4 px-4 py-2 rounded font-semibold transition ${
                isFavorite ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              {isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
            </button>

            {trailerKey && (
              <button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`)}
                className="ml-4 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                ▶️ Watch Trailer
              </button>
            )}

            {movie.production_companies.length > 0 && (
              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-1">Production Companies</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company) => (
                    <div key={company.name} className="flex items-center gap-2">
                      {company.logo_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                          alt={company.name}
                          width={50}
                          height={30}
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

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="bg-white mt-6 p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">🎭 Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cast.slice(0, 12).map(member => (
                <Link key={member.id} href={`/person/${member.id}`}>
                  <div className="text-center hover:shadow-lg bg-gray-50 p-2 rounded">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${member.profile_path}`}
                        alt={member.name}
                        width={120}
                        height={160}
                        className="rounded mx-auto"
                      />
                    ) : (
                      <div className="w-[120px] h-[160px] bg-gray-300 rounded mx-auto" />
                    )}
                    <p className="font-medium mt-2">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
