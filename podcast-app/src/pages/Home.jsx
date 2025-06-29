import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { fetchPreviews } from '/server';

export default function Home() {
   
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
    
        loadHomeData(); // Call it here
      }, []); // Empty dependency array = run once on mount
    
      return (
        <div className="home-container">

            <h2>Featured podcast for you</h2>
            
          {previews.map(preview => (
            <div key={preview.id}>
               <img src={preview.image} alt={preview.title} style={{ width: '100px', height: '100px' }} />
              <h2>{preview.title}</h2>
              <p>{preview.description}</p>
            </div>
          ))}

          <Link to="vans">More</Link>
        </div>
      );

}