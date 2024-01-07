import React from 'react'
import './MovieCard.css'
import { Link } from 'react-router-dom';

const IMG_API = "https://image.tmdb.org/t/p/w1280";

export const MovieCard = ({id,title,poster_path,overview,vote_average}) => {
  const setVoteClass = (vote) => {
    if(vote >= 8) {
      return "green";
    } else if(vote >= 6) {
      return "orange";
    } else {
      return "red";
    }
  }
  
  return (
    <>
    <Link to={`/movie/${id}`} style={{textDecoration:"none", color:"white"}}>
      <div className='movie-card'>
          <img src={IMG_API+poster_path} alt={title}/>
        
        <div className='movie-info'>
          <h3>{title}</h3>
          <span className={`tag ${setVoteClass(vote_average)}`}>{vote_average}</span>
        </div>
        <div className='movie-card-desc'>
          <h2>Overview</h2>
          <p>{overview.slice(0,250)+"..."}</p>
        </div>
      </div>
    </Link>
    </>
    
  )
}
