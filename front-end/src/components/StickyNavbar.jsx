import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import SearchIcon from '@mui/icons-material/Search';

function StickyNavbar() {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return <div className="navbar-loading">Loading...</div>;

    return (
        <div className="sticky-bottom-navbar">
            <Link to="/">🌌 Home</Link>
            <Link to="/search" className="search-icon-link">
                <SearchIcon />
            </Link>

            { user ? (
                <>
                      <Link to="/postcall">📮 Post/Call</Link>
                      <Link to="/inbox">💌 Inbox</Link>
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