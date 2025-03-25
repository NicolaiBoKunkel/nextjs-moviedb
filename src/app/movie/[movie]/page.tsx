'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  original_language: string;
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

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
      <p>Original language: {movie.original_language}</p>
    </div>
  );
};

export default MovieDetailPage;
