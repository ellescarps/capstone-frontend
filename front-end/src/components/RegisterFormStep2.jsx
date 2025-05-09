import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";

function RegisterFormStep2({ formData, setFormData, prevStep, error, setError }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const navigate = useNavigate();


    const shippingOptions = ["PICKUP", "SHIPPING", "DROPOFF"];
    const responsibilities = ["GIVER", "RECEIVER", "SHARED"];



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
                const data = await response.json();
                const place = data.results[0];

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

                setFormData((prev) => ({
                    ...prev,
                    city: detectedCity || "",
                    country: detectedCountry || "",
                }));
                setError(null);
            } catch (error) {
                setError("Could not determine location");
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
    }

    const uploadToCloudinary = async () => {
        const json = new FormData();
        json.append("file", selectedFile);
        json.append("upload_preset", "profile_pics");
        setUploading(true);

        const response = await fetch("https://api.cloudinary.com/v1_1/daikzjbhw/image/upload", {
            method: "POST",
            body: json,
        });

        const fileData = await response.json();
        setUploading(false);
        return fileData.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.city || !formData.country) {
            setError("Please fill out all required fields");
            return;
        }
    
        let finalProfilePicUrl = formData.profilePicUrl;
    
        if (selectedFile) {
            try {
                finalProfilePicUrl = await uploadToCloudinary();
            } catch (error) {
                setError("Image upload failed. Please try again.");
                return;
            }
        }
    
       
        const finalData = {
            ...formData,
            profilePicUrl: finalProfilePicUrl,
            city: formData.city?.trim() || "Enter your city",      
            country: formData.country?.trim() || "Enter your Country", 
            shippingResponsibility: formData.shippingResponsibility ?? "SHARED", 
            shippingOption: formData.shippingOption ?? "PICKUP",  
            userId: formData.userId
          };
    
          try {
            setError(null); 
            setUploading(true);

            const response = await fetch(`${API_URL}/register-step2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error in Step 2 registration");
            }

            alert("Registration successful!");
            navigate("/");
        } catch (error) {
            setError(error.message || "Something went wrong during registration");
        } finally {
            setUploading(false); 
        }
    };

    return (
        <div className="form-container">
        <form onSubmit={handleSubmit} className="register-form">
            <h1 className="form-title">Register: Step 2/2</h1>

            <div className="form-group">
                <label htmlFor="profilePic" className="form-label">Profile Picture (optional):</label>
                <input
                    type="file"
                    accept="image/*"
                    id="profilePic"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="form-input"
                />
                {selectedFile && (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="image-preview"
                    />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="city" className="form-label">City:</label>
                <input
                    type="text"
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="enter city"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="country" className="form-label">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={formData.country || ""}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="enter country"
                    className="form-input"
                />
            </div>

            <button type="button" onClick={handleUseLocation} className="secondary-button">
                Use My Location
            </button> 
                <br /> <br />
            <div className="form-group">
                <label htmlFor="shippingOption" className="form-label">Shipping Option (optional):</label>
                <select
                    id="shippingOption"
                    value={formData.shippingOption || ""}
                    onChange={(e) => setFormData({ ...formData, shippingOption: e.target.value })}
                    className="form-select"
                >
                    <option value="">Select an option</option>
                    {shippingOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="shippingResponsibility" className="form-label">Shipping Responsibility (optional):</label>
                <select
                    id="shippingResponsibility"
                    value={formData.shippingResponsibility || ""}
                    onChange={(e) => setFormData({ ...formData, shippingResponsibility: e.target.value })}
                    className="form-select"
                >
                    <option value="">Select one</option>
                    {responsibilities.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="form-group checkbox-group">
            <label htmlFor="terms" className="form-label">
                <input id="terms" name="terms" type="checkbox" checked={agreedToTerms} 
                onChange={(e) => setAgreedToTerms(e.target.checked)} required />
                I agree to the <a href="/terms" target="_blank">Terms and Privacy Policy</a>
            </label>
            </div>

            <div className="button-group">       
            <button type="button" onClick={prevStep} className="secondary-button">Back</button>
            <button type="submit" disabled={uploading || !agreedToTerms} className="submit-button">
                {uploading ? "Uploading..." : "Complete Registration"}
            </button>
            </div>

            {error && <p className="error">{error}</p>}
        </form>
        </div>
    );
}

export default RegisterFormStep2;
