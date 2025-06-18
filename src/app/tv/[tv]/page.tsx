import dynamic from 'next/dynamic';
import { notFound } from "next/navigation";

const TvDetailClient = dynamic(() => import("@/components/TvDetailClient"), {
  ssr: false,
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function TvDetailPage({ params }: { params: { tv: string } }) {
  const id = params.tv;

  const [tvRes, trailerRes, castRes, commentsRes, ratingRes] = await Promise.all([
    fetch(`${baseUrl}/tv/${id}/details`),
    fetch(`${baseUrl}/tv/${id}/trailer`),
    fetch(`${baseUrl}/tv/${id}/credits`),
    fetch(`${baseUrl}/comments/tv/${id}`),
    fetch(`${baseUrl}/ratings/tv/${id}`),
  ]);

  if (!tvRes.ok) return notFound();

  const tv = await tvRes.json();
  const trailerData = await trailerRes.json();
  const castData = await castRes.json();
  const comments = await commentsRes.json();
  const rating = await ratingRes.json();

  return (
    <TvDetailClient
      tv={tv}
      trailerKey={trailerData.trailerKey || null}
      cast={castData.cast?.slice(0, 12) || []}
      comments={comments}
      averageRating={rating.average || null}
      ratingCount={rating.count || 0}
    />
  );
}
