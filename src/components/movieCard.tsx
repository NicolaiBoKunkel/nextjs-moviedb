"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

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

    const handlePlayTrailer = () => {
        if (trailerKey) {
            window.open(trailerBaseUrl + trailerKey);
        } else {
            console.log('No trailer found');
        }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-teal-100">
            <div className="px-6 py-4">
                <Link href={`/movie/${movie.id}`}>
                    <img src={posterBasePath + movie.poster_path} className="rounded" alt={movie.title} />
                </Link>
                <div className="mt-4">
                    <Link href={`/movie/${movie.id}`}>
                        <h5 className="font-bold text-xl mb-2">{movie.title.substring(0, 200)}</h5>
                    </Link>
                    <div className="flex items-center mb-2">

                        <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                        </svg>

                        <span className="ml-1">{movie.vote_average}</span>
                    </div>
                    <p className="text-gray-700">{movie.overview.substring(0, 125).concat('....')}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="fas fa-calendar-alt text-gray-500"> {movie.release_date}</span>
                        <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" onClick={handlePlayTrailer}>Play trailer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
