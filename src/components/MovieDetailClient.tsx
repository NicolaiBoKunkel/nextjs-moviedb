'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "@/lib/apis/favoriteApi";

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

interface Comment {
  _id: string;
  username: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface Props {
  movie: Movie;
  trailerKey: string | null;
  cast: CastMember[];
  comments: Comment[];
  averageRating: number | null;
  ratingCount: number;
}

/**
 * MovieDetailClient component that displays detailed information about a movie,
 * including its poster, backdrop, overview, release date, genres, cast, user ratings,
 */

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MovieDetailClient({
  movie,
  trailerKey,
  cast,
  comments,
  averageRating,
  ratingCount,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(averageRating);
  const [count, setCount] = useState<number>(ratingCount);
  const [allComments, setAllComments] = useState(comments);
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
      })
      .catch(() => {});

    getFavorites(token).then((data) => {
      setIsFavorite(data.favorites.some(
        (fav: any) => fav.mediaId === movie.id && fav.mediaType === 'movie'
      ));
    });
  }, [token, movie.id]);

  const fetchRatingStats = async () => {
    const res = await fetch(`${baseUrl}/ratings/movie/${movie.id}`);
    const data = await res.json();
    setAverage(data.average);
    setCount(data.count);
  };

    useEffect(() => {
    fetchRatingStats();
  }, []);


  const toggleFavorite = async () => {
    if (!token) return alert('Please log in to favorite this movie.');
    try {
      if (isFavorite) {
        await removeFavorite(movie.id, 'movie', token);
        setIsFavorite(false);
      } else {
        await addFavorite(movie.id, 'movie', token);
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
      body: JSON.stringify({ mediaId: movie.id, mediaType: 'movie', rating: userRating }),
    });
    fetchRatingStats();
  };

  const handleDeleteRating = async () => {
    if (!token) return;
    await fetch(`${baseUrl}/ratings/movie/${movie.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserRating(null);
    fetchRatingStats();
  };

  const handleCommentSubmit = async () => {
    if (!token || !newComment.trim()) return;
    const res = await fetch(`${baseUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId: movie.id, mediaType: 'movie', text: newComment }),
    });
    const data = await res.json();
    setAllComments((prev) => [data.comment, ...prev]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    await fetch(`${baseUrl}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (!movie) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-top bg-fixed"
      style={{
        backgroundImage: movie.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : undefined,
        backgroundColor: '#f3f4f6',
      }}
    >
      <div className={`max-w-5xl mx-auto px-4 ${movie.backdrop_path ? 'pt-52' : 'pt-10'} relative z-10`}>
        <div className="flex flex-col md:flex-row backdrop-blur-sm bg-white/80 shadow-xl rounded-lg overflow-hidden">
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
              <p><strong>User Rating:</strong> ⭐ {average ?? "N/A"} ({count} ratings)</p>
              <p><strong>Runtime:</strong> ⏱️ {movie.runtime} minutes</p>
              <p><strong>Language:</strong> {movie.original_language?.toUpperCase() || 'N/A'}</p>
              <p><strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>
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
          <div className="backdrop-blur-sm bg-white/80 mt-6 p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">🎭 Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cast.slice(0, 12).map((member) => (
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

        <div className="backdrop-blur-sm bg-white/80 mt-6 p-6 rounded shadow-md">
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
          {allComments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {allComments.map((comment) => {
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
}
