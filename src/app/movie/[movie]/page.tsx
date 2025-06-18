import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const MovieDetailClient = dynamic(() => import('@/components/MovieDetailClient'), {
  ssr: false,
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function MovieDetailPage({ params }: { params: { movie: string } }) {
  const id = params.movie;

  const [movieRes, trailerRes, castRes, commentsRes, ratingRes] = await Promise.all([
    fetch(`${baseUrl}/movies/${id}/details`),
    fetch(`${baseUrl}/movies/${id}/trailer`),
    fetch(`${baseUrl}/movies/${id}/credits`),
    fetch(`${baseUrl}/comments/movie/${id}`),
    fetch(`${baseUrl}/ratings/movie/${id}`),
  ]);

  if (!movieRes.ok) return notFound();

  const movie = await movieRes.json();
  const trailerData = await trailerRes.json();
  const castData = await castRes.json();
  const comments = await commentsRes.json();
  const rating = await ratingRes.json();

  return (
    <MovieDetailClient
      movie={movie}
      trailerKey={trailerData.trailerKey || null}
      cast={castData.cast || []}
      comments={comments}
      averageRating={rating.average || null}
      ratingCount={rating.count || 0}
    />
  );
}