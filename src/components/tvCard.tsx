"use client"
import { useState, useEffect } from "react";

interface Tv {
    id: number;
    original_name: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
}

function TvCard({ tv }: { tv: Tv}) {
    //definer variabler
    const [trailerKey, setTrailerKey] = useState(null);
    const posterBasePath = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
    const trailerBaseUrl = 'https://www.youtube.com/watch?v=';

    //fetch request for trailer efter TV ID
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=e46278258cc52ec12ec6d0d0582c89b7`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    setTrailerKey(data.results[0].key);
                }
            })
            .catch(error => console.log('Error fetching trailer:', error));
    }, [tv.id]);

    const handlePlayTrailer = () => {
        if (trailerKey) {
            window.open(trailerBaseUrl + trailerKey);
        } else {
            console.log('No trailer found');
        }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <img src={posterBasePath + (tv.poster_path || '')} className="" alt="..." />
                <div className="">
                    <h5 className="font-bold text-xl mb-2"><span>{tv.original_name ? tv.original_name.substring(0, 200) : ''}</span></h5>
                    <span className="far fa-star" aria-hidden="true"></span><span className="ml-1">{tv.vote_average}</span>
                    <p>{tv.overview ? tv.overview.substring(0, 125).concat('....') : ''}</p>
                    <div className="d-flex justify-content-between p-0">
                        <span className="far fa-calendar" aria-hidden="true"> {tv.first_air_date}</span>
                        <span className="far fa-play-circle play-icon" onClick={handlePlayTrailer}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TvCard;