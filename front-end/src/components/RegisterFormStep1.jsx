import React from "react";

function RegisterFormStep1( {formData, setFormData, nextStep, error, setError}) {

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, username, password } = formData;

        if (!name || !email || !username || !password) {
            setError("Please fill out all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (username.length < 6 || username.length > 35) {
            setError("Username must be between 6 and 35 characters long.");
            return;
        }
        
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError(null);
        nextStep();
    };

    return (
        <div className="form-container">
      <form onSubmit={handleSubmit} className="register-form">
          <h1  className="form-title">Register: Step 1/2</h1>

          <div className="from-group">
              <label htmlFor="name" className="form-label">Name:</label> 
              <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={formData.name} 
                  onChange={(e) =>
                      setFormData({
                          ...formData,
                          name: e.target.value, 
                      })
                  }
                  required
                  className="form-input"
              />
          </div> <br />

          <div className="form-group">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email} 
                  onChange={(e) =>
                      setFormData({
                          ...formData,
                          email: e.target.value, 
                      })
                  }
                  required
                  className="form-input"
              />
          </div> 

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username:</label>
            <input 
            type="text"
            id="username"
            placeholder="username"
            value={formData.username}
            onChange={(e) => 
                setFormData({
                    ...formData,
                    username: e.target.value,
            })}
            required
              className="form-input"
             />
        </div> <br />


          <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}     
                  onChange={(e) =>
                      setFormData({
                          ...formData,
                          password: e.target.value,
                      })
                  }
                  required
                  className="form-input"
              />
          </div>

          <button type="submit" className="submit-button">Next</button>
          {error && <p className="error">{error}</p>}
      </form>
      </div>
  );
}

export default RegisterFormStep1;