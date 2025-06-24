'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/apis/authApi';
import { getFavorites } from '@/lib/apis/favoriteApi';
import { deleteAccount } from '@/lib/apis/userApi';
import ParallaxPage from '@/components/ParallaxPage';
import MovieCard from '@/components/movieCard';
import TvCard from '@/components/tvCard';
import homeImg from '/public/home.jpg';

/**
 * UserProfilePage component displays the user's profile information,
 */

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getCurrentUser(token)
      .then(async (userInfo) => {
        setUser(userInfo);

        const favData = await getFavorites(token);
        const detailedFavorites = await Promise.all(
          favData.favorites.map(async (fav: { mediaId: number; mediaType: string }) => {
            try {
              const res = await fetch(
                `${baseUrl}/${fav.mediaType === 'movie' ? 'movies' : 'tv'}/${fav.mediaId}/details`
              );
              const data = await res.json();
              return { ...data, mediaType: fav.mediaType };
            } catch {
              return null;
            }
          })
        );

        setFavorites(detailedFavorites.filter(Boolean));
      })
      .catch(() => setError('Could not load user info or favorites'));
  }, []);

  const handleFavoriteToggled = (id: number, mediaType: string) => {
    setFavorites((prev) => prev.filter((item) => !(item.id === id && item.mediaType === mediaType)));
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirmed = confirm('Are you sure you want to permanently delete your account?');
    if (!confirmed) return;

    try {
      await deleteAccount(token);
      localStorage.removeItem('token');
      router.push('/');
    } catch (err) {
      alert('An error occurred while deleting your account.');
    }
  };

  if (error) {
    return (
      <ParallaxPage backgroundImage={homeImg.src} title="User Profile">
        <div className="p-4 text-red-500">{error}</div>
      </ParallaxPage>
    );
  }

  if (!user) {
    return (
      <ParallaxPage backgroundImage={homeImg.src} title="User Profile">
        <div className="p-4 text-gray-500">Loading user...</div>
      </ParallaxPage>
    );
  }

  return (
    <ParallaxPage backgroundImage={homeImg.src} title={`👤 Profile: ${user.username}`}>
      <div className="mb-6">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-6">
          <strong>Favorites:</strong> {favorites.length} saved items
        </p>

        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-6"
        >
          Delete My Account
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">⭐ Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven’t favorited any content yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((item: any) =>
            item.mediaType === 'movie' ? (
              <MovieCard
                key={`movie-${item.id}`}
                movie={item}
                onFavoriteToggled={() => handleFavoriteToggled(item.id, 'movie')}
              />
            ) : (
              <TvCard
                key={`tv-${item.id}`}
                tv={item}
                onFavoriteToggled={() => handleFavoriteToggled(item.id, 'tv')}
              />
            )
          )}
        </div>
      )}
    </ParallaxPage>
  );
}
