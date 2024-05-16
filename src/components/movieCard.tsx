"use client"
import { useState, useEffect } from "react";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}


function MovieCard({ movie }: { movie: Movie }) {
    const [trailerKey, setTrailerKey] = useState(null);
    const posterBasePath = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
    const trailerBaseUrl = 'https://www.youtube.com/watch?v=';


    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=e46278258cc52ec12ec6d0d0582c89b7`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    setTrailerKey(data.results[0].key);
                }
            })
            .catch(error => console.log('Error fetching trailer:', error));
    }, [movie.id]);

    //håndter trailer i nyt tab
    const handlePlayTrailer = () => {
        if (trailerKey) {
            window.open(trailerBaseUrl + trailerKey);
        } else {
            console.log('No trailer found');
        }
    };

    // JSX
    return (

        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-teal-100">
            <div className="px-6 py-4">
                <img src={posterBasePath + movie.poster_path} className="" alt="..." />
                <div className="">
                    <h5 className="font-bold text-xl mb-2"><span>{movie.title.substring(0, 200)}</span></h5>
                    <span className="far fa-star" aria-hidden="true"></span><span className="ml-1">{movie.vote_average}</span>
                    <p>{movie.overview.substring(0, 125).concat('....')}</p>
                    <div className="d-flex justify-content-between p-0">
                        <span className="far fa-calendar" aria-hidden="true"> {movie.release_date}</span>
                        <span className="far fa-play-circle play-icon" onClick={handlePlayTrailer}>Play trailer</span>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MovieCard;