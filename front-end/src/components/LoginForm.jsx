import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";
import { AuthContext } from "./AuthContext";


function LoginForm() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [error, setError] = useState(null);
    const [generalError, setGeneralError] = useState(null);  
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (emailError) {
            document.getElementById("email").focus();
        } else if (passwordError) {
            document.getElementById("password").focus();
        }
    }, [emailError, passwordError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError(null);
        setPasswordError(null);
        setGeneralError(null);
        setError(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
        return;
    } 

    if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return;
    }

    setLoading(true);


        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
                });

                const json = await response.json();
                console.log(json);

                if (!response.ok) {
                    setGeneralError(json.error || "Invalid email or password");
                    return;
                    }

                localStorage.setItem("token", json.token);
                const user = await fetchUserData(json.token); 
                login(user);
                setEmail("");
                setPassword("");
                navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

//create a helper function to fetch user's data using the token 
const fetchUserData = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: {Authorization: `Bearer ${token}`}
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }
        const json = await response.json();
        return json;
};


 return (

    <form onSubmit={handleSubmit}>
    <div>
        <label htmlFor="email">Email</label>
        <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        {emailError && <p className="error">{emailError}</p>}
    </div>

    <div>
        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        {passwordError && <p className="error">{passwordError}</p>}
    </div>

    <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
    </button>

    {error && <p className="error">{error}</p>}
    {generalError && <p className="error">{generalError}</p>}

</form>
    
 ); 
}

export default LoginForm
