import React, { useState } from "react";
import RegisterFormStep1 from "./RegisterFormStep1";
import RegisterFormStep2 from "./RegisterFormStep2"


function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // step1 fields
        name: "",
        email: "",
        password: "",
        // step2 fields
        profilePicUrl: "",
        city: "",
        country: "",
        shippingOption: "",
        shippingResponsibility: "",
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
 

    return (
            <div>
                    {step === 1 && (
                        <RegisterFormStep1
                            formData={formData}
                            setFormData={setFormData}
                            nextStep={nextStep}
                        />
                    )}
                    {step === 2 && (
                        <RegisterFormStep2
                            formData={formData}
                            setFormData={setFormData}
                            prevStep={prevStep}
                        />
                    )}
                    
            </div>
        );
}       
 


export default Register