import React from "react";

function RegisterComplete({ formData, goHome }) {
    return (
        <div className="register-complete">
            <h1>Registration Complete!</h1>
            <p>Thank you for registering!</p>

            <div className="summary"></div>
            <h2>Your Information:</h2>
            <p> <strong>Profile Picture:</strong> <img src={formData.profilePicUrl} alt="Profile" style={{ width: 100, height: 100 }}/> </p>
            <p> <strong>Location:</strong> {formData.locationId} </p>
            <p> <strong>Shipping Option:</strong> {formData.shippingOption || "Not selected"} </p>
            <p><strong>Shipping Responsibility:</strong> {formData.shippingResponsibility || "Not selected"}</p>

            <button onClick={goHome}> Go to Home </button>
        </div>

       
    );
}

export default RegisterComplete;