import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa"
import BackToTopButton from "./BackTotopButton";

export default function Footer() {

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#2DD4BF"
    };

    return (
        <footer>
            <nav className="footer-nav">
                <NavLink to="/" style={({ isActive }) => isActive ? activeStyles : null}> <FaHome /> </NavLink>
                <BackToTopButton />
            </nav>

            <div className="footer-copyright">
                &#169; 2025 #PODCAST APP
            </div>
        </footer>
    );
}