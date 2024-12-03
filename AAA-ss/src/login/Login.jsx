import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setMessage("Please complete the reCAPTCHA to proceed.");
      return;
    }

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken, // Send the reCAPTCHA token to the server
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect based on user type
        if (data.type === "Admin") {
          navigate("/admin");
        } else {
          navigate("/user");
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
          <div className="recaptcha">
            <ReCAPTCHA
              sitekey="6Lfb8o8qAAAAAJsQIMu76uQX_gsFb-fWRNj3Ghaj"
              onChange={(value) => {
                setRecaptchaToken(value);
              }}
            />
          </div>
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
