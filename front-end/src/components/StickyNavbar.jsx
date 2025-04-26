import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function StickyNavbar() {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return <div className="navbar-loading">Loading...</div>;

    return (
        <div className="sticky-bottom-navbar">
            <Link to="/">🌌 Home</Link>
            <Link to="/posts">📦 Posts </Link>
            <Link to="/callouts">📢 Callouts</Link>

            { user ? (
                <>
                      <Link to={`/account/${user.id}`}>☺️ Profile</Link>
                      <button onClick={ () => {
                        logout();
                        navigate("/login");
                      }}  
                       > 
                        ✌️ Logout 
                        </button>
                </>
            ) : (
                
                <button onClick={ () => navigate("/login")}> 🗝️ Login </button>
            )}
            
        </div>
    );
}

export default StickyNavbar