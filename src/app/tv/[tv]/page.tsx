'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from '@/lib/apis/favoriteApi';

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

interface Comment {
  _id: string;
  username: string;
  userId: string;
  text: string;
  createdAt: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TvDetailPage = () => {
  const { tv: id } = useParams();
  const [tv, setTv] = useState<Tv | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setUserId(data.id || data._id);
      });
  }, [token]);

  useEffect(() => {
    if (!id) return;

    fetch(`${baseUrl}/tv/${id}/details`).then((res) => res.json()).then(setTv);
    fetch(`${baseUrl}/tv/${id}/trailer`).then((res) => res.json()).then((data) => {
      if (data.trailerKey) setTrailerKey(data.trailerKey);
    });
    fetch(`${baseUrl}/tv/${id}/credits`).then((res) => res.json()).then((data) => {
      if (data.cast) setCast(data.cast.slice(0, 12));
    });
    fetch(`${baseUrl}/comments/tv/${id}`).then((res) => res.json()).then(setComments);

    if (token) {
      getFavorites(token).then((data) => {
        setIsFavorite(
          data.favorites.some((f: any) => f.mediaId === Number(id) && f.mediaType === 'tv')
        );
      });
      fetch(`${baseUrl}/ratings/tv/${id}`)
        .then((res) => res.json())
        .then(({ average, count }) => {
          setAverageRating(average);
          setRatingCount(count);
        });
    }
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) return alert('Please log in to favorite this show.');
    try {
      if (isFavorite) {
        await removeFavorite(Number(id), 'tv', token);
        setIsFavorite(false);
      } else {
        await addFavorite(Number(id), 'tv', token);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleRatingSubmit = async () => {
    if (!token || !userRating) return;
    await fetch(`${baseUrl}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId: Number(id), mediaType: 'tv', rating: userRating }),
    });
    const updated = await fetch(`${baseUrl}/ratings/tv/${id}`).then((res) => res.json());
    setAverageRating(updated.average);
    setRatingCount(updated.count);
  };

  const handleDeleteRating = async () => {
    if (!token) return;
    await fetch(`${baseUrl}/ratings/tv/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserRating(null);
    const updated = await fetch(`${baseUrl}/ratings/tv/${id}`).then((res) => res.json());
    setAverageRating(updated.average);
    setRatingCount(updated.count);
  };

  const handleCommentSubmit = async () => {
    if (!token || !newComment.trim()) return;
    const res = await fetch(`${baseUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId: Number(id), mediaType: 'tv', text: newComment }),
    });
    const data = await res.json();
    setComments((prev) => [data.comment, ...prev]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    await fetch(`${baseUrl}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (!tv) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="relative w-full bg-gray-100 min-h-screen">
      {tv.backdrop_path && (
        <div
          className="w-full h-[400px] bg-cover bg-center brightness-75"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
        />
      )}

      <div className={`max-w-5xl mx-auto px-4 ${tv.backdrop_path ? '-mt-48' : 'pt-10'} relative z-10`}>
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative w-full md:w-1/3 h-[450px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
              alt={tv.original_name}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="p-6 space-y-3 flex-1">
            <h1 className="text-3xl font-bold">{tv.original_name}</h1>
            {tv.tagline && <p className="italic text-teal-600">&ldquo;{tv.tagline}&rdquo;</p>}
            <p className="text-gray-700">{tv.overview}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>First Air Date:</strong> {tv.first_air_date}</p>
              <p><strong>TMDB Rating:</strong> ⭐ {tv.vote_average}</p>
              <p><strong>User Rating:</strong> ⭐ {averageRating ?? 'N/A'} ({ratingCount} ratings)</p>
              <p><strong>Language:</strong> {tv.original_language?.toUpperCase()}</p>
              <p><strong>Genres:</strong> {tv.genres.map(g => g.name).join(', ')}</p>
              <p><strong>Seasons:</strong> {tv.number_of_seasons}</p>
              <p><strong>Episodes:</strong> {tv.number_of_episodes}</p>
              {tv.episode_run_time.length > 0 && (
                <p><strong>Avg Runtime:</strong> ⏱️ {tv.episode_run_time[0]} min</p>
              )}
            </div>

            <div className="flex gap-4 flex-wrap mt-4">
              <button
                onClick={toggleFavorite}
                className={`px-4 py-2 rounded font-semibold transition hover:bg-red-300 ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200'
                }`}
              >
                {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
              </button>

              {trailerKey && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`)}
                  className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
                >
                  ▶️ Watch Trailer
                </button>
              )}
            </div>

            {token && (
              <div className="pt-4">
                <h3 className="font-semibold mb-1">Your Rating</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={userRating ?? ''}
                    onChange={(e) => setUserRating(Number(e.target.value))}
                    className="w-16 p-1 border rounded"
                  />
                  <button onClick={handleRatingSubmit} className="px-3 py-1 bg-teal-600 text-white rounded">
                    Submit
                  </button>
                  {userRating && (
                    <button onClick={handleDeleteRating} className="px-3 py-1 text-sm text-red-500 underline">
                      Remove Rating
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <div className="bg-white mt-6 p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">🎭 Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cast.map((person) => (
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

        <div className="bg-white mt-6 p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">💬 Comments</h2>
          {token && (
            <div className="mb-4">
              <textarea
                className="w-full border p-2 rounded mb-2"
                rows={3}
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit} className="px-4 py-2 bg-teal-600 text-white rounded">
                Post Comment
              </button>
            </div>
          )}
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => {
                const canDelete = userId && String(userId) === String(comment.userId);
                return (
                  <li key={comment._id} className="bg-gray-50 p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{comment.username}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.text}</p>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 text-sm mt-1 underline"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TvDetailPage;
