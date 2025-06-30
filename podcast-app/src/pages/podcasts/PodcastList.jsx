import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { fetchPreviews } from '/server';

export default function PodcastList() {

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

    return(
        <div className="podcast-list">
        
            <h2>The best stories and ideas all in one place</h2>
            
            <div className="podcast-list-container">
              {previews.map(preview => (
              <div key={preview.id} className="podcast-list-item">
                  <img src={preview.image} alt={preview.title} />
                  <h2>{preview.title}</h2>
                  <Link to={`/podcasts/${preview.id}`}>View Details</Link>
              </div>
              ))}
            </div>
            
        </div>
    )
}