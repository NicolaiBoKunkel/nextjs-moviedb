'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { addFavorite, removeFavorite } from "@/lib/apis/favoriteApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const posterBasePath = 'https://image.tmdb.org/t/p/original/';
  const trailerBaseUrl = 'https://www.youtube.com/watch?v=';

  useEffect(() => {
    fetch(`${baseUrl}/movies/${movie.id}/trailer`)
      .then(res => res.json())
      .then(data => {
        if (data.trailerKey) setTrailerKey(data.trailerKey);
      })
      .catch(error => console.log('Error fetching trailer:', error));

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${baseUrl}/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.favorites.some((fav: any) => fav.mediaId === movie.id && fav.mediaType === "movie")) {
          setIsFavorite(true);
        }
      })
      .catch(error => console.log("Error checking favorites:", error));
  }, [movie.id]);

  const handlePlayTrailer = () => {
    if (trailerKey) {
      window.open(trailerBaseUrl + trailerKey);
    } else {
      console.log('No trailer found');
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to favorite movies.");

    try {
      if (isFavorite) {
        await removeFavorite(movie.id, "movie", token);
      } else {
        await addFavorite(movie.id, "movie", token);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-teal-100">
      <div className="px-6 py-4">
        <Link href={`/movie/${movie.id}`}>
          <div className="w-[185px] h-[278px] relative">
            <Image
              src={posterBasePath + movie.poster_path}
              alt={movie.title}
              fill
              className="object-contain rounded"
              sizes="(max-width: 640px) 100vw, 185px"
            />
          </div>
        </Link>
        <div className="mt-4">
          <Link href={`/movie/${movie.id}`}>
            <h5 className="font-bold text-xl mb-2">{movie.title.substring(0, 200)}</h5>
          </Link>
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-yellow-300 me-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <span className="ml-1">{movie.vote_average}</span>
          </div>
          <p className="text-gray-700">{movie.overview.substring(0, 125).concat('....')}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="fas fa-calendar-alt text-gray-500">{movie.release_date}</span>
            <div className="flex gap-2">
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded"
                onClick={handlePlayTrailer}
              >
                Trailer
              </button>
              <button
                onClick={toggleFavorite}
                className={`py-1 px-3 rounded font-semibold ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
              >
                {isFavorite ? '★' : '☆'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
