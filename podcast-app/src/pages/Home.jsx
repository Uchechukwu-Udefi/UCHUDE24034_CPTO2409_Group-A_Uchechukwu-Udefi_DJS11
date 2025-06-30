import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { fetchPreviews } from '/server';
import { useMemo } from 'react';

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
    
        loadHomeData();
      }, []);;
    

    const randomFour = useMemo(() => {
        return [...previews].sort(() => 0.5 - Math.random()).slice(0, 4);
    }, [previews]);

    return (
    <div className="home-container">
        <div className="home-intro">
            <h1>The #1 Podcast Platform, Specially Made For You.</h1>
                <p>Dive into a world of endless adventures with UTune.</p>
                <p>Whether you're relaxing, learning, or exploring new ideas, we've got the perfect podcasts for you.</p>
                <p>Discover content that resonates your way.</p>  
        </div>

        <h1>Featured podcast for you</h1>
        <div className="home-preview-card">
            {randomFour.map(preview => (
        <div key={preview.id} className="preview-card">
            <img
            src={preview.image}
            alt={preview.title}
            />
            <h3>{preview.title}</h3>
            <p>{preview.author}</p>
        </div>
        ))}
        </div>
        

        <Link to="">Explore More</Link>
    </div>
);

}