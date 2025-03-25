"use client";

import { useEffect, useState } from "react";
import { getPopularTvShows } from "@/lib/apis/movieApi";
import TvCard from "./tvCard";
import type { Tv } from "@/lib/apis/movieApi";

const PopularTvShows = () => {
  const [tvShows, setTvShows] = useState<Tv[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const data = await getPopularTvShows();
        setTvShows(data);
      } catch (err) {
        setError("Failed to load TV shows");
        console.error(err);
      }
    };

    fetchTvShows();
  }, []);

  if (error) return <div>{error}</div>;
  if (!tvShows.length) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tvShows.map((tvShow) => (
        <TvCard key={tvShow.id} tv={tvShow} />
      ))}
    </div>
  );
};

export default PopularTvShows;
