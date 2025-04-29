import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '../API';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // Verify token is still valid
                try {
                    const response = await fetch(`${API_URL}/validate-token`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (response.ok) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token is invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error("Token validation error:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

// AuthContext.jsx
const login = async (token, userData) => {
    try {
      // Store both token and user data immediately
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      
      // Optional: Verify token in background
      try {
        const validateResponse = await fetch(`${API_URL}/validate-token`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!validateResponse.ok) {
          console.warn("Token validation failed - will keep local session");
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
      
    } catch (error) {
      console.error("Login error:", error);
      logout();
      throw error;
    }
  };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;