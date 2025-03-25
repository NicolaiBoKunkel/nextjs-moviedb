'use client';
import { useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';

interface Tv {
  id: number;
  original_name: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  original_language: string;
}

const TvDetailPage = () => {
  const { tv: id } = useParams();
  const [tv, setTv] = useState<Tv | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/tv/${id}/details`)
        .then(res => res.json())
        .then(setTv)
        .catch(err => console.error("Error fetching TV show:", err));
    }
  }, [id]);

  if (!tv) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tv.original_name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.original_name} />
      <p>{tv.overview}</p>
      <p>First Air Date: {tv.first_air_date}</p>
      <p>Rating: {tv.vote_average}</p>
      <p>Original language: {tv.original_language}</p>
    </div>
  );
};

export default TvDetailPage;
