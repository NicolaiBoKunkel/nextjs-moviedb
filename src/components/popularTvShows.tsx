'use client';
import { useState, useEffect } from "react";
import TvCard from "./tvCard";

interface Tv {
    id: number;
    original_name: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
}

const TvList = () => { // component name to TvList
    const [tvShows, setTvShows] = useState<Tv[]>([]); // variable names

    useEffect(() => {
        fetchTvShows(); // Call fetchTvShows 
    }, []);

    const fetchTvShows = async () => { // function name
        try {
            const apiKey = 'e46278258cc52ec12ec6d0d0582c89b7';
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1` // Fetch popular TV shows
            );
            const data = await response.json();
            if (data.results) {
                setTvShows(data.results);
            }
        } catch (error) {
            console.error("Error fetching TV shows:", error); // Update error message
        }
    };

    return (
        <div className="row">
            {tvShows.map((tvShow) => ( // Map through tvShows 
                <TvCard key={tvShow.id} tv={tvShow} /> // Render TvCard components 
            ))}
        </div>
    );
};

export default TvList;
