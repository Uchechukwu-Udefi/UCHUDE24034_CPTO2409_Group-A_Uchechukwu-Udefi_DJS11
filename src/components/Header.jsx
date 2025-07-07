import { Link, NavLink } from "react-router-dom"
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";

export default function Header() {

    const [menuOpen, setMenuOpen] = useState(false);

     const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#2DD4BF"
    }

    const handleLinkClick = () => {
        setMenuOpen(false); // auto-close on link click
    };

    return (
        <header>
                <Link className="site-link" to="/"><img className="site-logo" src='public/u-tune_logo_1.png' alt="U-Tune Logo"/></Link>
                <Link className="site-title" to="/"><img className="site-title" src='public/u-tune_logo_2.png' alt="U-Tune Title"/></Link>
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
                <nav className={menuOpen ? 'open' : ''}>
                    <NavLink to="/favouriteshows"  style={ ({isActive}) => isActive ? activeStyles : null } onClick={handleLinkClick}>❤️ Favourites</NavLink>
                    <NavLink to="/shows" end style={ ({isActive}) => isActive ? activeStyles : null } onClick={handleLinkClick}>🌐 Explore</NavLink>
                    <NavLink to="/search" style={ ({isActive}) => isActive? activeStyles : null } onClick={handleLinkClick}>🔍 Search</NavLink>
                    <Link to="/login" className="login-link" onClick={handleLinkClick}>
                        <FaRegUserCircle />
                    </Link>
                </nav> 
        </header>
    )
}