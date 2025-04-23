import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function StickyNavbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="sticky-bottom-navbar">
            <Link to="/">🌌 Home</Link>
            <Link to="/posts">📦 Posts </Link>
            <Link to="/callouts">📢 Callouts</Link>

            { user ? (
                <>
                      <Link to="/me">☺️ Profile</Link>
                      <button onClick={logout}> ✌️ Logout </button>
                </>
            ) : (
                
                <button onClick={ () => navigate("/login")}> 🗝️ Login </button>
            )}
            
        </div>
    );
}

export default StickyNavbar