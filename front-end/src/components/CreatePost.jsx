import React, { useState, useContext, useEffect } from 'react';
import { API_URL } from "../API";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';


function CreatePost() { 
    const { user, token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [shippingOption, setShippingOption] = useState('');
    const [shippingResponsibility, setShippingResponsibility] = useState('');
    const [image, setImage] = useState(null);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [type, setType] = useState('post');  
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 


    const navigate = useNavigate();
    const location = useLocation();
    


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const postType = params.get('type');
        if (postType === 'callout' || postType === 'post') {
            setType(postType);
        }

        // / NEW: Scroll to top and force background repaint
    window.scrollTo(0, 0); // Always scroll to top
    const wrapper = document.querySelector('.create-post-wrapper');
    if (wrapper) {
      wrapper.style.backgroundImage = 'none'; 
      setTimeout(() => {
        wrapper.style.backgroundImage = "url('stars.jpg')";
      }, 10); 
    }

    }, [location]);

 
    if (!user) {
        navigate('/login'); 
        return null; 
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
      
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('shippingOption', shippingOption);
        formData.append('shippingResponsibility', shippingResponsibility);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('type', type);
        
        if (image) {
          formData.append('image', image);
        }
      
        try {
          const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
              // Don't set Content-Type - let browser set it with boundary
            },
            body: formData
          });
      
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || data.message || "Failed to create post");
          }
      
          alert("Post created successfully!");
          navigate('/');
        } catch (error) {
          console.error("Post creation failed:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };








    const handleUseLocation = async () => {
        const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
                );
                const json = await response.json();
                const place = json.results[0];

                const detectedCity = place.components.city || place.components.town || place.components.village || "Unknown City";
                const detectedCountry = place.components.country;

                    // Block colonized or unsupported locations
                const BLOCKED_COUNTRIES = ["Israel"];
                const BLOCKED_CITIES = ["Tel Aviv"];

                const normalizedCity = detectedCity.toLowerCase();
                const normalizedCountry = detectedCountry.toLowerCase();

                const isBlocked =
                    BLOCKED_COUNTRIES.some((country) => country.toLowerCase() === normalizedCountry) ||
                    BLOCKED_CITIES.some((city) => city.toLowerCase() === normalizedCity);

                if (isBlocked) {
                    setError("This location is not supported.");
                    return;
                }

                setCity(detectedCity || "");
                setCountry(detectedCountry || "");
                setError(null);
        } catch (error) {
            setError("Error with location access");
        }
    }, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
            setError("Permission to access location was denied.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            setError("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
            setError("Location request timed out.");
        } else {
            setError("An unknown error occurred while fetching your location.");
        }
    });
};


    return (
        <div className="create-post-wrapper">
        <div className="create-post">
            <h1 className="create-post-title">Create a New Post</h1>
            <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                        className="form-select" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home Goods">Home Goods</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Kitchen & Appliances">Kitchen & Appliances</option>
                        <option value="Books">Books</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Bathroom Needs">Bathroom Needs</option>
                        <option value="Mobility Aids & Assistive Devices">Mobility Aids & Assistive Devices</option>
                        <option value="Food">Food</option>
                        <option value="Pet Supplies">Pet Supplies</option>
                        <option value="Sporting Goods">Sporting Goods</option>
                        <option value="Toys & Games">Toys & Games</option>
                        <option value="Musical Instruments">Musical Instruments</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                    </select>
                </div>


                <div className="form-group">
                    <label className="form-label">Shipping Option</label>
                    <select 
                    className="form-select" 
                    value={shippingOption} 
                    onChange={(e) => setShippingOption(e.target.value)} 
                    required
                >
                    <option value="">Select Shipping Option</option>
                    <option value="pickup">PICKUP</option>
                    <option value="shipping">SHIPPING</option>
                    <option value="dropoff">DROPOFF</option>
                </select>
                </div>
                <div className="form-group">
                <label className="form-label">Shipping Responsibility</label>
                    <select 
                        className="form-select" 
                        value={shippingResponsibility} 
                        onChange={(e) => setShippingResponsibility(e.target.value)} 
                        required
                    >
                        <option value="">Select Responsibility</option>
                        <option value="seller">GIVER</option>
                        <option value="buyer">RECEIVER</option>
                        <option value="shared">SHARED</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>

                <button type="button" onClick={handleUseLocation}>
                Use My Location
                </button>

                {error && <p className="error-message">{error}</p>} {/* Display error message */}

                <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="post">Post</option>
                        <option value="callout">Callout</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Image</label>
                    <input className="form-input" type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <button className="submit-btn" type="submit">Submit</button>
            </form>
        </div>
    </div>
    );
}

export default CreatePost;