import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterFormStep1 from "./RegisterFormStep1";
import RegisterFormStep2 from "./RegisterFormStep2";
import { API_URL } from "../API";


function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // step1 fields
        name: "",
        email: "",
        username: "",
        password: "",
        userId: null,
        // step2 fields
        profilePicUrl: "",
        city: "",
        country: "",
        shippingOption: "",
        shippingResponsibility: "",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
 
    const handleRegisterStep1 = async () => {
        try {
            const response = await fetch(`${API_URL}/register-step1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error in Step 1 registration");
            }

            setFormData((prevData) => ({
                ...prevData,
                userId: data.userId, 
            }));
    

            nextStep();
        } catch (error) {
            setError(error.message || "Something went wrong during registration");
        }
    };

    const handleRegisterStep2 = async () => {
        try {
            const response = await fetch(`${API_URL}/register-step2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error in Step 2 registration");
            }

            alert("Registration successful!");
            navigate("/");
        } catch (error) {
            setError(error.message || "Something went wrong during registration");
        }
    };

       return (
            <div>
                    {step === 1 && (
                        <RegisterFormStep1
                            formData={formData}
                            setFormData={setFormData}
                            nextStep={handleRegisterStep1}
                            error={error}
                            setError={setError}
                        />
                    )}
                    {step === 2 && (
                        <RegisterFormStep2
                            formData={formData}
                            setFormData={setFormData}
                            prevStep={prevStep}
                            nextStep={handleRegisterStep2}
                            error={error}
                            setError={setError}
                        />
                    )}
                    
            </div>
        );
}       
 


export default Register