import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const onChange = () => {};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", data.token);

        // Check user type based on the data returned from the server
        if (data.type === "Admin") {
          navigate("/admin"); // Redirect to Admin.jsx if type is 'Admin'
        } else {
          navigate("/user"); // Redirect to User.jsx if type is 'User'
        }
      } else {
        setMessage("Login failed: " + data.error);
      }
    } catch (error) {
      setMessage("Error during login: " + error);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
        
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

<ReCAPTCHA sitekey="6Lfb8o8qAAAAAJsQIMu76uQX_gsFb-fWRNj3Ghaj" onChange={onChange}/> 

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <div className="login">
        <p>Don't have an Account?</p>
        <Link to="/signup" className="btn btn-success">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
