import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { MovieDetail } from './Components/MovieDetail';
import { Home } from './Components/Home';
import { Header } from './Components/Header';
import { MovieList } from './Components/MovieList';
import { SearchList } from './Components/SearchList';
import { useState } from 'react';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import { WatchListCard } from './Components/WatchListCard';
import { Watchlist } from './Components/Watchlist';

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log(query);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Header onSearch={handleSearch}/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="movie/:id" element={<MovieDetail />}></Route>
          <Route path="movies/:type" element={<MovieList/>}></Route>
          <Route path="search" element={<SearchList searchQuery={searchQuery}/>} />
          <Route path="/*" element={<h1>Error Page</h1>}></Route>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/watchlist' element={<Watchlist/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
