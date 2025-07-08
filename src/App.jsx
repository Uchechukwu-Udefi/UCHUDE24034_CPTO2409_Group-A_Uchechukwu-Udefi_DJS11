import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Layout from './components/Layout';
import Home from './pages/Home';
import ShowList from './pages/shows/ShowList.jsx';
import ShowDetails from './pages/shows/ShowDetails.jsx';
import Favorites from './pages/shows/FavoriteShows.jsx';
import Genre from './pages/genre/Genre.jsx';
import GenreList from './pages/genre/GenreList.jsx';
import Season from './pages/shows/Seasons.jsx';
import EpisodePlayer from './pages/shows/Episodes.jsx';
import { PlaybackProvider } from './context/PlaybackContext.jsx';
import GlobalPlayer from './components/GlobalPlayer.jsx';
import Search from './components/Search.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';




function App() {

  return (
    <BrowserRouter>
      <PlaybackProvider>

        <Routes>
          <Route path="/" element={<Layout />}>
        <Route path='/search' element={<Search />} />
        <Route index element={<Home />} />
        <Route path='/shows' element={<ShowList />} />
        <Route path='/shows/:id' element={<ShowDetails />} />
        <Route path="/shows/:id/season/:seasonNumber" element={<Season />} />
        <Route path="/shows/:id/season/:seasonNumber/episode/:episodeId" element={<EpisodePlayer />} />


        <Route path='/favouriteshows' element={<Favorites />} />
        
        <Route path="/genre" element={<GenreList />} />
        <Route path="/genre/:genreId" element={<Genre />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        </Route>
      </Routes>

        <GlobalPlayer />
    </PlaybackProvider>
  </BrowserRouter>
);
}

export default App
