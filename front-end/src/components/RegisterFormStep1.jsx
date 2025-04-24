import React from "react";

function RegisterFormStep1( {formData, setFormData, nextStep, error, setError}) {

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, password } = formData;

        if (!name || !email || !password) {
            setError("Please fill out all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
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
      <form onSubmit={handleSubmit}>
          <h1>Register: Step 1/2</h1>
          <div>
              <label htmlFor="name">Name:</label>
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
              />
          </div>

          <div>
              <label htmlFor="email">Email:</label>
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
              />
          </div>

          <div>
              <label htmlFor="password">Password:</label>
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
              />
          </div>

          <button type="submit">Next</button>
          {error && <p className="error">{error}</p>}
      </form>
  );
}

export default RegisterFormStep1;