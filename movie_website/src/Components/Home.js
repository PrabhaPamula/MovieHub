import React, { useEffect, useState } from 'react'
import { MovieList } from './MovieList'
import { SearchList } from './SearchList'
import config from './config';

const TMDB_API_KEY = config.TMDB_API_KEY;

const SEARCH_API=`https://api.themoviedb.org/3/search/movie?&api_key=${TMDB_API_KEY}&query=`;
const DEFAULT_FEATURED_API =`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`;

export const Home = () => {


  return (
    <div>
        <MovieList/>
    </div>
  )
}
