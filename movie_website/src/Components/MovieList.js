import React, { useEffect, useState } from 'react'
import { MovieCard } from './MovieCard';
import './MovieList.css'
import { useParams } from 'react-router-dom';
import config from './config';

const TMDB_API_KEY = config.TMDB_API_KEY;

export const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const {type} = useParams();

    const DEFAULT_FEATURED_API =`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=${TMDB_API_KEY}&language=en-US`;

    const getMovies = (API) => {
        fetch(API)
        .then((res) => res.json())
        .then((data) => {
            setMovieList(data.results);
        })
    }
    console.log(movieList);

    useEffect(() => {
        if(type !== 'search') {
            getMovies(DEFAULT_FEATURED_API);
        }
    },[type])

  return (
    <>
    <div className='movie-list-conatiner'>
        {
            movieList.map((movie) => (
                <MovieCard key={movie.id} {...movie}/>
            ))
        }
    </div>
    </>
  )
}
