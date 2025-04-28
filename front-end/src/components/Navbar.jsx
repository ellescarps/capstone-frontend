import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";


function Navbar({ setSearch, search }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);


    useEffect( () => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categories`);
                const json = await response.json();
                setCategories(json);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        }; 
        fetchCategories();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);  
        setSearch(e.target.value);    
      };
    
    

const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${categoryName.toLowerCase()}`)
};

const getCategoryIcon = (name) => {
    const icons = {
         clothing: "👗",
         "home goods": "🏠",
         furniture: "🛋️",
         "kitchen & appliances": "🍳",
         books: "📚",
         electronics: "🔋",
         "bathroom needs": "🚽",
         "mobility aids & assistive devices": "🩼",
         food: "🥙",
         "pet supplies": "🐶",
         "sporting goods": "🏀",
         "toys & games": "🧸",
         "musical instruments": "🎸",
         "health & beauty": "💆"
    };
    return icons[name.toLowerCase()] || "📦";
};


return (
        <header className="navbar">
            <div className="navbar-container">
                <a href="/"><h1 className="site-title">the People's Marketspace</h1></a>
            </div>     
            
                <input
                 type="text"
                 placeholder="search for what you need here 📬"
                 value={searchQuery}
                 onChange={handleSearchChange}
                 className="search-bar"
                 />
      

            <div className="category-scroll-container">
            {categories.map( (category) => (
                <button
                    key={category.id}
                    className="category-icon"
                    onClick={ () => handleCategoryClick(category.name)}
                >
                    <span className="emoji"> {getCategoryIcon(category.name)} </span>
                    {/* <span className="label"> {category.name} </span> */}
                </button>
            ))}
            </div>
            
        </header>

);
}

export default Navbar



  {/* <select 
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="category-dropdown"
            >

                <option value=""> Select Category </option>
                {categories.map((category) => (
                    <option key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                    </option>
                ))}
            </select> */}