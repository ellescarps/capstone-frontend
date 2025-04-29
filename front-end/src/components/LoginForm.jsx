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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

 // LoginForm.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
      });
  
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.error || "Login failed");
      }
  
      // Pass both token and user json to login
      await login(json.token, json.user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

</form>
    
 ); 
}

export default LoginForm
