import { Link, NavLink } from "react-router-dom"
export default function Header() {

     const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <header>
            <Link className="site-link" to="/"><img className="site-logo" src='../assets/images/u-tune_logo_3.png'/></Link>
            <nav>
                <NavLink to="/favourites"  style={ ({isActive}) => isActive ? activeStyles : null }>❤️ Favourites</NavLink>
                <NavLink to="/preview" style={ ({isActive}) => isActive ? activeStyles : null }>🌐 Explore</NavLink>
                <NavLink to="/search" style={ ({isActive}) => isActive? activeStyles : null }>🔍 Search</NavLink>
                <Link to="login" className="login-link">
                    <img src="../assets/images/avatar-icon.png" className="login-icon"/>
                </Link>
            </nav> 
        </header>
    )
}