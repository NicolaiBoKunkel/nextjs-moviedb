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
}

const TvDetailPage = () => {
  const { tv: id } = useParams(); // Get the id from useParams
  const [tv, setTv] = useState<Tv | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=e46278258cc52ec12ec6d0d0582c89b7`)
        .then(response => response.json())
        .then(data => {
          setTv(data);
        })
        .catch(error => console.log('Error fetching TV show:', error));
    }
  }, [id]);

  if (!tv) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tv.original_name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.original_name} />
      <p>{tv.overview}</p>
      <p>First Air Date: {tv.first_air_date}</p>
      <p>Rating: {tv.vote_average}</p>
    </div>
  );
};

export default TvDetailPage;
