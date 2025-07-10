import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { fetchPreviews } from '/server';
import GenreList from "../genre/GenreList";
import Loading from "../../components/LoadingSpinner";

export default function ShowList() {

    const [previews, setPreviews] = useState([]);
    const [sortOption, setSortOption] = useState('A-Z');
    
      useEffect(() => {
        async function loadHomeData() {
          try {
            const data = await fetchPreviews();
            setPreviews(data);
          } catch (error) {
            console.error("Error loading home data:", error);
          }
        }
    
        loadHomeData();
      }, []);

    // Sorting logic
    const getSortedPreviews = () => {
        return previews.slice().sort((a, b) => {
            switch (sortOption) {
                case 'A-Z':
                    return a.title.localeCompare(b.title);
                case 'Z-A':
                    return b.title.localeCompare(a.title);
                case 'most-recent':
                    return new Date(b.updated) - new Date(a.updated);
                case 'least-recent':
                    return new Date(a.updated) - new Date(b.updated);
                default:
                    return 0;
            }
        });
    };

    if (previews.length === 0) return <Loading />;

    return(
        <div className="show-list">
        
            <div className="show-list-intro">
               <h2>The best stories and ideas all in one place</h2>
            </div>

            <GenreList />

            <h2>Explore all shows</h2>
            <div className="shows-sort-options">
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="A-Z">Title (A-Z)</option>
                    <option value="Z-A">Title (Z-A)</option>
                    <option value="most-recent">Most Recently Updated</option>
                    <option value="least-recent">Oldest Updated</option>
                </select>
            </div>

            <div className="show-list-container">
              {getSortedPreviews().map(preview => (
                  <div key={preview.id} className="show-list-item">
                    <img src={preview.image} alt={preview.title} />
                    <h3>{preview.title}</h3>
                    <strong>{preview.seasons} Seasons</strong>
                    <Link to={`/shows/${preview.id}`}>View More Details</Link>
                  </div>
              ))}
            </div>
            
        </div>
    )
}