import { genreMap } from "/server";
import { Link } from "react-router-dom";

export default function GenreList() {
  return (
   <div className="genre-container">
  <h1>Explore by Genres</h1>
  <div className="genre-list">
    {Object.entries(genreMap).map(([id, name]) => (
      <Link to={`/genre/${id}`} key={id} className="genre-list-link">
        {name}
      </Link>
    ))}
  </div>
</div>

  );
}
