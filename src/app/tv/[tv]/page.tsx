'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addFavorite, removeFavorite, getFavorites } from '@/lib/apis/favoriteApi';

interface Tv {
  id: number;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  original_language: string;
  genres: { id: number; name: string }[];
  tagline: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  production_companies: { name: string; logo_path: string | null }[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TvDetailPage = () => {
  const { tv: id } = useParams();
  const [tv, setTv] = useState<Tv | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${baseUrl}/tv/${id}/details`)
      .then(res => res.json())
      .then(setTv)
      .catch(err => console.error("Error fetching TV show:", err));

    fetch(`${baseUrl}/tv/${id}/trailer`)
      .then(res => res.json())
      .then(data => {
        if (data.trailerKey) setTrailerKey(data.trailerKey);
      });

    fetch(`${baseUrl}/tv/${id}/credits`)
      .then(res => res.json())
      .then(data => {
        if (data.cast) setCast(data.cast.slice(0, 12)); // limit display
      });

    const token = localStorage.getItem("token");
    if (!token) return;

    getFavorites(token)
      .then(data => {
        setIsFavorite(data.favorites.some((f: any) => f.mediaId === Number(id) && f.mediaType === "tv"));
      });
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to favorite this show.");

    try {
      if (isFavorite) {
        await removeFavorite(Number(id), "tv", token);
        setIsFavorite(false);
      } else {
        await addFavorite(Number(id), "tv", token);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (!tv) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      {/* Backdrop */}
      {tv.backdrop_path && (
        <div
          className="w-full h-[400px] bg-cover bg-center brightness-75"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
        />
      )}

      {/* Content */}
      <div className={`max-w-5xl mx-auto px-4 ${tv.backdrop_path ? "-mt-48" : "pt-10"} relative z-10`}>
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Poster */}
          <div className="relative w-full md:w-1/3 h-[450px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
              alt={tv.original_name}
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Info */}
          <div className="p-6 space-y-3 flex-1">
            <h1 className="text-3xl font-bold">{tv.original_name}</h1>
            {tv.tagline && <p className="italic text-teal-600">&ldquo;{tv.tagline}&rdquo;</p>}

            <p className="text-gray-700">{tv.overview}</p>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>First Air Date:</strong> {tv.first_air_date}</p>
              <p><strong>TMDB Rating:</strong> ⭐ {tv.vote_average}</p>
              <p><strong>Language:</strong> {tv.original_language?.toUpperCase()}</p>
              <p><strong>Genres:</strong> {tv.genres.map(g => g.name).join(', ')}</p>
              <p><strong>Seasons:</strong> {tv.number_of_seasons}</p>
              <p><strong>Episodes:</strong> {tv.number_of_episodes}</p>
              {tv.episode_run_time.length > 0 && (
                <p><strong>Avg Runtime:</strong> ⏱️ {tv.episode_run_time[0]} min</p>
              )}
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
                className="ml-4 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
              >
                ▶️ Watch Trailer
              </button>
            )}

            {/* Production Companies */}
            {tv.production_companies.length > 0 && (
              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-1">Production Companies</h3>
                <div className="flex flex-wrap gap-4">
                  {tv.production_companies.map((company) => (
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
              {cast.map(person => (
                <Link key={person.id} href={`/person/${person.id}`}>
                  <div className="text-center hover:shadow-lg bg-gray-50 p-2 rounded">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                        alt={person.name}
                        width={120}
                        height={160}
                        className="rounded mx-auto"
                      />
                    ) : (
                      <div className="w-[120px] h-[160px] bg-gray-300 rounded mx-auto" />
                    )}
                    <p className="font-medium mt-2">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.character}</p>
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

export default TvDetailPage;
