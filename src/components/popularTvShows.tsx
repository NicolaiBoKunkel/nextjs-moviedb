'use client';

import { usePopularTvShows } from "@/lib/apis/movieApi";
import TvCard from "./tvCard";

const PopularTvShows = () => {
    const { data: tvShows, isLoading, isError } = usePopularTvShows();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvShows && tvShows.map((tvShow) => (
                    <TvCard key={tvShow.id} tv={tvShow} />
                ))}
            </div>
        </div>
    );
};

export default PopularTvShows;


