import { Link, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Create a ref for the nav

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#2DD4BF"
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // auto-close on link click
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <header>
            <Link className="site-link" to="/">
                <img src="/favicon.svg" alt="Logo 1" className="site-logo" />
            </Link>
            <Link className="site-title" to="/">
                <img src="/u-tune_logo_2.png" alt="Logo 2" className="site-title" />
            </Link>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaRegWindowClose /> : <GiHamburgerMenu />}
            </button>
            <nav ref={menuRef} className={menuOpen ? 'open' : ''}>
                <NavLink to="/shows" end style={({ isActive }) => isActive ? activeStyles : null} onClick={handleLinkClick}>🌐 Explore</NavLink>
                <NavLink to="/history" end style={({ isActive }) => isActive ? activeStyles : null} onClick={handleLinkClick}>🧭 History</NavLink>
                <NavLink to="/favourites" style={({ isActive }) => isActive ? activeStyles : null} onClick={handleLinkClick}>❤️ Favourites</NavLink>
                <NavLink to="/search" style={({ isActive }) => isActive ? activeStyles : null} onClick={handleLinkClick}>🔍 Search</NavLink>
                <Link to="/login" className="login-link" onClick={handleLinkClick}>
                    <FaRegUserCircle />
                </Link>
            </nav>
        </header>
    );
}
