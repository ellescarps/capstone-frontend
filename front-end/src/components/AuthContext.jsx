import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../API";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);  

    useEffect(() => {
         const fetchUserData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

             try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
        
               // Decode JWT manually if needed here
                // You can get the id from the JWT payload like this:
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(window.atob(base64));
                const id = decoded.id;       

             const response = await fetch(`${API_URL}/users/${id}`, {
                 method: 'GET',
                 headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`,
                 }
             });
 
             if (response.ok) {
                 const userData = await response.json();
                 setUser(userData);
                 localStorage.setItem("user", JSON.stringify(userData));
             } else {
                console.error("Failed to fetch user with token");
                setUser(null);
             }
         } catch (error) {
             console.error("Error in fetchUserData:", error);
            setUser(null);

         } finally {
            setLoading(false);
         }
    };

        fetchUserData();
}, [token]);


    // Login function to set user and store in localStorage
    const login = (userData, receivedToken) => {
        setUser(userData);
        setToken(receivedToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", receivedToken);
    };
    
   // Logout function
   const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};


    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
