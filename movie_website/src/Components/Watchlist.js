import React, { useEffect, useState } from 'react'
import { WatchListCard } from './WatchListCard';
import config from './config.js';
import Axios from 'axios';

const TMDB_API_KEY = config.TMDB_API_KEY;

export const Watchlist = () => {
    const [watchlist,setWatchlist] = useState([]);
    Axios.defaults.withCredentials = true;

    // const DEFAULT_API = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`;

    useEffect(() => {
      const fetchWatchlistData = async () => {
        try {
          const response = await Axios.get('http://localhost:8001/watchlist');
          if (response.data.Status === 'Success') {
            const movieIds = response.data.Watchlist;
            const movieDetails = await fetchMovieDetails(movieIds);
            setWatchlist(movieDetails);
          } else {
            console.error('Error fetching watchlist data:', response.statusText);
          }
          console.log(watchlist);
        } catch (error) {
          console.error('Error fetching watchlist data:', error.message);
        }
      };
  
      fetchWatchlistData();
    }, []);

    const fetchMovieDetails = async (movieIds) => {
      const movieDetailsPromises = movieIds.map(async (movieId) => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const movieData = await response.json();
          console.log(movieData);
          return movieData;
        } catch (error) {
          console.error('Error fetching movie details:', error.message);
          return null;
        }
      });
    
      const movieDetails = await Promise.all(movieDetailsPromises);
      return movieDetails.filter(movie => movie !== null);
    };
    

  return (
    <>
    <div className='watch-list-conatiner mt-4 mb-20'>
        {
            watchlist.map((movie) => (
                <WatchListCard key={movie.id} {...movie}/>
            ))
        }
    </div>
    </>
  )
}
