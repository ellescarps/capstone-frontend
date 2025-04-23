import React, { useState, useEffect } from "react";
import { API_URL } from "../API";

function RegisterFormStep2( { formData, setFormData, nextStep, prevStep }) {
    const [locations, setLocations] = useState([]);
    const [locationId, setLocationId] = useState(formData.locationId || "");
    const [profilePicUrl, setProfilePicUrl] = useState(formData.profilePicUrl || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [shippingOption, setShippingOption] = useState(formData.shippingOption || "");
    const [shippingResponsibility, setShippingResponsibility] = useState(formData.shippingResponsibility || "");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const shippingOptions = ["PICKUP", "SHIPPING", "DROPOFF"];
    const responsibilities = ["GIVER", "RECEIVER", "SHARED"];
    

    useEffect( () => {
        async function fetchLocations() {
            try {
                const response = await fetch(`${API_URL}/locations`);
                const json = await response.json();
                setLocations(json);
            } catch (error) {
                console.error("Failed to fetch locations", error);
            }
            }
            fetchLocations();
    }, []);

    const handleUseLocation = async (e) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch(`${API_URL}/locations/nearby?lat=${latitude}&lng=${longitude}`);
                const json = await response.json();
                if (json?.id) {
                    setLocationId(json.data);
                }
            } catch (error) {
                setError("Could not get nearby location");
            }
        });
    };

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

        if(!locationId || !shippingResponsibility) {
            setError("Please fill out all required fields");
            return;
        }

        let finalProfilePicUrl = profilePicUrl;

    if (selectedFile) {
      try {
        finalProfilePicUrl = await uploadToCloudinary();
      } catch (error) {
        setError("Image upload failed.");
        return;
      }
    }

        setFormData({
            ...formData,
            profilePicUrl: finalProfilePicUrl,
            locationId: parseInt(locationId),
            shippingOption,
            shippingResponsibility,
        });

        setError(null);
        nextStep();
    };

return (
    <form onSubmit={handleSubmit}>
        <h1>Register: Step 2/2</h1>

        <div>
            <label htmlFor="profilePic">Profile Picture (optional):</label>
            <input 
            type="file" 
            accept="image/*"
            id="profilePic"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            {selectedFile && (
            <img
             src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            style={{ width: '200px', marginTop: '10px' }}
            />
)}
        </div>

        <div>
            <label htmlFor="location">Location:</label>
            <select 
            id="location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            >
                <option value="">Select a location</option>
                  {locations.map((loc) => (
                     <option key={loc.id} value={loc.id}>
                     {loc.name}
                    </option>
                ))}
            </select>
            <button type="button" onClick={handleUseLocation}>
                Use My Location
             </button>
        </div>

       
      <div>
        <label htmlFor="shippingOption">Shipping Option (optional):</label>
        <select
          id="shippingOption"
          value={shippingOption}
          onChange={(e) => setShippingOption(e.target.value)}
        >
          <option value="">Select an option</option>
          {shippingOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="shippingResponsibility">Shipping Responsibility:</label>
        <select
          id="shippingResponsibility"
          value={shippingResponsibility}
          onChange={(e) => setShippingResponsibility(e.target.value)}
          required
        >
          <option value="">Select one</option>
          {responsibilities.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <button type="button" onClick={prevStep}>Back</button>
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Complete Registration"}
      </button>
      {error && <p className="error">{error}</p>}

    </form>
);
}

export default RegisterFormStep2