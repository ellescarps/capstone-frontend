import React, { useState } from "react";
import RegisterFormStep1 from "./RegisterFormStep1";
import RegisterFormStep2 from "./RegisterFormStep2"
import RegisterComplete from "./RegisterComplete";

function Register({ goHome }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // step1 fields
        name: "",
        email: "",
        password: "",
        // step2 fields
        profilePicUrl: "",
        locationId: "",
        shippingOption: "",
        shippingResponsibility: "",
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    switch(step) {
        case 1:
            return (
                <RegisterFormStep1
                    formData={formData}
                    setFormData={setFormData}
                    nextStep={nextStep}
                />
            );
        case 2:
            return (
                <RegisterFormStep2
                    formData={formData}
                    setFormData={setFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            );
        case 3:
            return <RegisterComplete formData={formData} goHome={goHome} />;
        default:
            return <div>Error: Unknown step</div>
    }
}


export default Register