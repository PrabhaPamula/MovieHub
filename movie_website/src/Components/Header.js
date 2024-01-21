import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdMenu } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import './Header.css'
import config from './config';
import Axios from 'axios'

const TMDB_API_KEY = config.TMDB_API_KEY;

export const Header = ({onSearch}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [sidebar, setSidebar] = useState(false)
  const [theme, setTheme] = useState("dark-theme");

  const toggleTheme = () => {
    if(theme === "dark-theme") {
      setTheme("light-theme");
      isDark(false);
    } else {
      setTheme("dark-theme");
      isDark(true);
    }
  }

  useEffect(() => {
    document.body.className = theme;
  },[theme]);

  const [dark,isDark] = useState(true)

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

  const handleLogout = () => {
    Axios.get("http://localhost:8001/logout")
    .then(res => {
      // window.location.reload(true);
      setAuth(false);
      navigate('/');
    }).catch(err => console.log(err));
  }

  const handleWatchListClick = () => {
    if(auth) {
      navigate("/watchlist");
    } else {
      navigate("/login");
    }
  }

  const tmdbEndpoint = 'https://api.themoviedb.org/3/search/movie';

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${tmdbEndpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      const movieSuggestions = data.results.map(result => result.title);
      setSuggestions(movieSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };


  const handleOnSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    if(searchTerm) {
      onSearch(searchTerm);
      setSearchTerm("");
      // setSuggestions([]);
      navigate(`/search?q=${searchTerm}`);
      

    }
  }

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
    fetchSuggestions(e.target.value);
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]); 
    onSearch(suggestion); 
    setSearchTerm("");
    navigate(`/search?q=${suggestion}`);
  };

  const handleInputBlur = () => {
    // Hide suggestions when the input loses focus
    setSuggestions([]);
  };


  return (
    <>
        <div className="header">
            <div className="headerLeft">
                <Link to="/" className='logo'>Movie<span>Hub</span></Link>
                <form onSubmit={handleOnSubmit}>
                  <div className='search-bar-container'>
                    <input 
                    className="search" 
                    type='search' 
                    placeholder='Search...' 
                    value={searchTerm} 
                    onChange={handleOnChange}/>
                    {suggestions.length > 0 && (
                      <ul className='suggestions-list'>
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className='suggestion' onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                </form>
                


            </div>

              <div className={`headerRight  ${sidebar ? "nav-links-sidebar" : "nav-links"}`} onClick={() => setSidebar(false)}>
                <Link to="/movies/popular" className="nav1" style={{textDecoration: "none"}}><span>Popular</span></Link>
                <Link to="/movies/top_rated" className="nav1" style={{textDecoration: "none"}}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" className="nav1" style={{textDecoration: "none"}}><span>Upcoming</span></Link>
                <button onClick={handleWatchListClick} className="nav1"><span>Watchlist</span></button>
                <div className='change-theme' onClick={() => toggleTheme()}>
                  {dark ? <MdOutlineDarkMode/> : <MdOutlineLightMode />}
                </div>
                {
                  auth ?
                  <button className='header-btn' onClick={handleLogout}><span>Logout</span></button>
                  :
                  <Link className='header-btn' to="/login"><span>Login</span></Link>
                }
                
              </div>
            
            <button className='navbar-item-icon' onClick={() => setSidebar(!sidebar)}>
                {sidebar ? <MdOutlineClose /> : <MdMenu />}
            </button>
        </div>
    </>
  )
}
