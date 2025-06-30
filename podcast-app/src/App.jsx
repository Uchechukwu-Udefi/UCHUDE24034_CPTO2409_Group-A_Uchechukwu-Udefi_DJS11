import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Layout from './components/Layout';
import Home from './pages/Home';
import PodcastList from './pages/podcasts/PodcastList';
import PodcastDetails from './pages/podcasts/PodcastDetails.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path='/podcasts' element={<PodcastList />} />
        <Route path='/podcasts/:id' element={<PodcastDetails />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
