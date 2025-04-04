'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/apis/authApi';
import { getFavorites } from '@/lib/apis/favoriteApi';

const TMDB_API_KEY = 'e46278258cc52ec12ec6d0d0582c89b7';

export default function UserProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser(token)
      .then(async (userInfo) => {
        setUser(userInfo);

        const favData = await getFavorites(token);
        const detailedFavorites = await Promise.all(
          favData.favorites.map(async (id: number) => {
            const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
            const movie = await movieRes.json();
            return movie;
          })
        );

        setFavorites(detailedFavorites);
      })
      .catch(() => setError("Could not load user info or favorites"));
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4 text-gray-500">Loading user...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">👤 Profile: {user.username}</h1>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-6"><strong>Favorites:</strong> {favorites.length} saved movies</p>

      <h2 className="text-2xl font-semibold mb-4">🎬 Favorite Movies</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven't favorited any movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((movie: any) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
              <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-lg transition">
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full"
                />
                <div className="p-2 text-center">
                  <p className="font-semibold">{movie.title}</p>
                  <p className="text-sm text-gray-500">{movie.release_date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
