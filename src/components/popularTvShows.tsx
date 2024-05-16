'use client';
import { useState, useEffect } from "react";
import { getPopularTvShows } from "@/store/apis/movieApi";
import TvCard from "./tvCard";

interface Tv {
    id: number;
    original_name: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
}

const PopularTvShows = () => {
    const [tvShows, setTvShows] = useState<Tv[]>([]);

    useEffect(() => {
        fetchTvShows();
    }, []);

    const fetchTvShows = async () => {
        const tvShowsData = await getPopularTvShows();
        setTvShows(tvShowsData);
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvShows.map((tvShow) => (
                    <TvCard key={tvShow.id} tv={tvShow} />
                ))}
            </div>
        </div>
    );
};

export default PopularTvShows;

