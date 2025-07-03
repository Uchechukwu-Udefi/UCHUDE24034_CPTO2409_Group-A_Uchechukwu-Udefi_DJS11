import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Layout from './components/Layout';
import Home from './pages/Home';
import ShowList from './pages/shows/ShowList.jsx';
import ShowDetails from './pages/shows/ShowDetails.jsx';
import Favorites from './pages/shows/FavoriteShows.jsx';
import Genre from './pages/genre/Genre.jsx';
import GenreList from './pages/genre/GenreList.jsx';
import Season from './pages/shows/Seasons.jsx';
import Episode from './pages/shows/Episodes.jsx';





function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path='/shows' element={<ShowList />} />
        <Route path='/shows/:id' element={<ShowDetails />} />
        <Route path="/shows/:id/season/:seasonNumber" element={<Season />} />
        <Route path="/shows/:id/season/:seasonNumber/episode/:episodeId" element={<Episode />} />


        <Route path='/favouriteshows' element={<Favorites />} />
        
        <Route path="/genre" element={<GenreList />} />
        <Route path="/genre/:genreId" element={<Genre />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
