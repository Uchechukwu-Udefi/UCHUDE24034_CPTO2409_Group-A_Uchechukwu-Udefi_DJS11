import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { fetchPreviews } from '/server';
import GenreList from "../genre/GenreList";

export default function ShowList() {

    const [previews, setPreviews] = useState([]);
    
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

    if (previews.length === 0) return <p>Loading shows...</p>;

    return(
        <div className="show-list">
        
            <h2>The best stories and ideas all in one place</h2>

            <GenreList />

            <h2>Explore all shows (A-Z)</h2>
            <div className="show-list-container">
              {previews.map(preview => (
              <div key={preview.id} className="show-list-item">
                  <img src={preview.image} alt={preview.title} />
                  <h3>{preview.title}</h3>
                  <Link to={`/shows/${preview.id}`}>View Details</Link>
              </div>
              ))}
            </div>
            
        </div>
    )
}