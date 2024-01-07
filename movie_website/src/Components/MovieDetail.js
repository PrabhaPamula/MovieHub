import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './movieDetails.css'
import { IoMdAdd } from "react-icons/io";
import Axios from 'axios';

import config from './config.js';

const TMDB_API_KEY = config.TMDB_API_KEY;

export const MovieDetail = () => {
  const [currentMovieDetail, setMovie] = useState()
    const { id } = useParams()

    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      Axios.get("http://localhost:8001")
      .then((response) => {
              console.log(response);
              if(response.data.Status === "Success") {
                setAuth(true);
              } else {
                setAuth(false);
              }
  
          }).then(err => console.log(err));
    }, [])

    const handleAddToWatchlist = async () => {
        if(auth) {
            try {
                const response = await Axios.post("http://localhost:8001/addToWatchlist",{id})
                if(response.data.Status === "Success") {
                    alert("Movie add to watchlist");
                } else {
                    alert(response.data.Error);
                }
            } catch(error) {
                console.log("Error: ",error.message);
            }

        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getData()
        window.scrollTo(0,0)
    }, [])

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(data => setMovie(data))
    }

  return (
    <>
      <div className="movie">
            <div className="backimg">
                <img className="backdropimg" src={`https://image.tmdb.org/t/p/w1280${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} />
            </div>
            <div className="movie_details">
                <div className="details_left">
                    <div className="mposter_container">
                        <img className="mposter " src={`https://image.tmdb.org/t/p/w1280${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
                    </div>
                    <div className='beside-poster'>
                        <div className='mtitle'>
                            <div className="nname">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                            <div className="mtagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        </div>
                        <div className='watchlist-btn'>
                            <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
                        </div>
                    </div>
                    
                </div>
                <div className='additionaldetails'>
                    <div className='general'>
                        <div className="mrating">
                            Voting Average : 
                            {currentMovieDetail ? currentMovieDetail.vote_average: ""} 
                            <span className="movie__voteCount">{currentMovieDetail ? " ( " + currentMovieDetail.vote_count + " votes )" : ""}</span>
                        </div>  
                        <div className="mruntime">Runtime: {currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="mreleasedate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                    </div>
                    
                    <div className="mgenrecontainer">
                        {
                            currentMovieDetail && currentMovieDetail.genres
                            ? 
                            currentMovieDetail.genres.map(genre => (
                                <><span className="mgenre" id={genre.id}>{genre.name}</span></>
                            )) 
                            : 
                            ""
                        }
                    </div>
                </div>
                <div className="overviewtext">
                    <div className="synopsisText">Synopsis</div>
                    <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                </div>

                <h3 className="moviedesctitle">Useful Links</h3>
                <div className="movielinks">
                    {
                        currentMovieDetail && currentMovieDetail.homepage && <a href={currentMovieDetail.homepage} target="_blank" style={{textDecoration: "none"}}><p><span className="btnhome">Homepage <i className="newTab fas fa-external-link-alt"></i></span></p></a>
                    }
                    {
                        currentMovieDetail && currentMovieDetail.imdb_id && <a href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id} target="_blank" style={{textDecoration: "none"}}><p><span className="btnimdb">IMDb <i className="newTab fas fa-external-link-alt"></i></span></p></a>
                    }
                </div>
                
            </div>

            <div className='movie_additional'>
                <h3 className="moviedesctitle">Production companies</h3>
                <div className="productions">
                    {
                        currentMovieDetail && currentMovieDetail.production_companies && currentMovieDetail.production_companies.map(company => (
                            <>
                                {
                                    company.logo_path 
                                    && 
                                    <span className="productionCompanyImage">
                                        <img className="movie__productionComapany" src={"https://image.tmdb.org/t/p/original" + company.logo_path} />
                                        <span>{company.name}</span>
                                    </span>
                                }
                            </>
                        ))
                    }
                </div>
            </div>

        </div>
    </>
  )
}
