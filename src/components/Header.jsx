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
                <Link className="site-link" to="/"><img src="/u-tune_logo_1.png" alt="Logo 1" className="site-logo"/></Link>
                <Link className="site-title" to="/"><img src="/u-tune_logo_2.png" alt="Logo 2" className="site-title"/></Link>
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