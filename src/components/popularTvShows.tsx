"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPopularTvShows, Tv } from "@/lib/apis/movieApi";
import TvCard from "./tvCard";

interface TMDBResponse<T> {
  page: number;
  total_pages: number;
  results: T[];
  total_results: number;
}

const PopularTvShows = () => {
  const [data, setData] = useState<TMDBResponse<Tv> | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchTvShows = async () => {
      setIsLoading(true);
      try {
        const result = await getPopularTvShows(currentPage);
        setData(result);
      } catch (err) {
        setError("Failed to load TV shows");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTvShows();
  }, [currentPage]);

  const goToPage = (page: number) => {
    router.push(`/popularTv?page=${page}`);
  };

  if (error) return <div>{error}</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center bg-teal-100 text-teal-800 px-6 py-3 rounded shadow mb-6">Popular TV Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.results.map((tvShow) => (
          <TvCard key={tvShow.id} tv={tvShow} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="bg-white text-teal-700 font-bold px-3 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-center">
          Page {currentPage}
        </span>
        <button
          disabled={currentPage >= data.total_pages}
          onClick={() => goToPage(currentPage + 1)}
          className="bg-white text-teal-700 font-bold px-3 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularTvShows;
