'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/apis/authApi';
import { getFavorites } from '@/lib/apis/favoriteApi';
import { deleteAccount } from '@/lib/apis/userApi';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
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
          favData.favorites.map(async (fav: { mediaId: number; mediaType: string }) => {
            try {
              const res = await fetch(`${baseUrl}/${fav.mediaType === "movie" ? "movies" : "tv"}/${fav.mediaId}/details`);
              const data = await res.json();
              return { ...data, mediaType: fav.mediaType };
            } catch {
              return null;
            }
          })
        );

        setFavorites(detailedFavorites.filter(Boolean));
      })
      .catch(() => setError("Could not load user info or favorites"));
  }, []);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmed = confirm("Are you sure you want to permanently delete your account?");
    if (!confirmed) return;

    try {
      await deleteAccount(token);
      localStorage.removeItem("token");
      router.push('/');
    } catch (err) {
      alert("An error occurred while deleting your account.");
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4 text-gray-500">Loading user...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">👤 Profile: {user.username}</h1>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-6"><strong>Favorites:</strong> {favorites.length} saved items</p>

      <button
        onClick={handleDeleteAccount}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-6"
      >
        Delete My Account
      </button>

      <h2 className="text-2xl font-semibold mb-4">⭐ Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven&rsquo;t favorited any content yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((item: any) => (
            <Link key={`${item.mediaType}-${item.id}`} href={`/${item.mediaType}/${item.id}`} className="block">
              <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-lg transition">
                <div className="relative w-full h-[278px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                    alt={item.title || item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="font-semibold">{item.title || item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.release_date || item.first_air_date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
