import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Layout from './components/Layout';
import Home from './pages/Home';
import ShowList from './pages/shows/ShowList.jsx';
import ShowDetails from './pages/shows/ShowDetails.jsx';
import FavouriteShows from './pages/shows/FavouriteShows.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path='/shows' element={<ShowList />} />
        <Route path='/shows/:id' element={<ShowDetails />} />
        <Route path='/shows/favouriteshows' element={<FavouriteShows />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
