'use client';
import { useParams } from 'next/navigation'; // Use useParams from next/navigation
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

const MovieDetailPage = () => {
  const { movie: id } = useParams(); // Get the id from useParams
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=e46278258cc52ec12ec6d0d0582c89b7`)
        .then(response => response.json())
        .then(data => {
          setMovie(data);
        })
        .catch(error => console.log('Error fetching movie:', error));
    }
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
};

export default MovieDetailPage;
