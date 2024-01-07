import React, { useState, useEffect } from 'react'
import { MovieCard } from './MovieCard';
import config from './config';

const TMDB_API_KEY = config.TMDB_API_KEY;


export const SearchList = ({searchQuery}) => {
    const [movieList, setMovieList] = useState([]);
    console.log(searchQuery);
    console.log(movieList);

    const [error, setError] = useState(null);

  const getMovies = (API) => {
    fetch(API)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMovieList(data.results);
        setError(null); // Reset error state on successful fetch
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setMovieList([]);
        setError("Error fetching data. Please try again."); // Set an error message
      });
  };
  
    const SEARCH_API=`https://api.themoviedb.org/3/search/movie?&api_key=${TMDB_API_KEY}&query=`;

    useEffect(() => {
        if(searchQuery) {
            getMovies(SEARCH_API+searchQuery);
        } 
    },[searchQuery])
    
  return (
    <>
     {error ? (
        <div className='error-message'>{error}</div>
      ) : (
        <div className='movie-list-conatiner'>
          {movieList.length > 0 ? (
            movieList.map((movie) => <MovieCard key={movie.id} {...movie} />)
          ) : (
            <div className='no-results-message'>
              No movies found. Please enter a valid search query.
            </div>
          )}
        </div>
      )}
    </>
  )
}
