import React, { useEffect, useState } from 'react'
import { MovieList } from './MovieList'
import { SearchList } from './SearchList'

const SEARCH_API="https://api.themoviedb.org/3/search/movie?&api_key=3362e13b6c276e43bf2ec6e5b12f4e5b&query=";
const DEFAULT_FEATURED_API =`https://api.themoviedb.org/3/movie/popular?api_key=3362e13b6c276e43bf2ec6e5b12f4e5b&language=en-US`;

export const Home = () => {


  return (
    <div>
        <MovieList/>
    </div>
  )
}
