import React, { useState } from "react";
import LoginForm from "./LoginForm";
import Register from "./Register";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page">
            <h2>{isLogin ? "LOGIN" : "REGISTER"}</h2>

            {isLogin ? <LoginForm /> : <Register />}

            <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
}

export default AuthPage 