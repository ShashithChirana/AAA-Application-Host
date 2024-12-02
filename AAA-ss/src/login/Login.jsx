import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const onChange1 = (token) => {
    console.log("Captcha has been verified with token: ", token);
    fetch("https://aaa-application-host-server.vercel.app/verify-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Captcha successfully validated");
          setCaptchaVerified(true);
        } else {
          console.error("Captcha validation failed");
          setCaptchaVerified(false);
          setMessage("Captcha validation failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error verifying captcha:", error);
        setCaptchaVerified(false);
        setMessage("Error verifying captcha. Please try again.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      setMessage("Please verify the CAPTCHA before submitting.");
      return;
    }

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("");

        if (data.type === "Admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error during login. Please check your network connection.");
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
            <ReCAPTCHA sitekey="6Lfb8o8qAAAAAJsQIMu76uQX_gsFb-fWRNj3Ghaj" onChange={onChange1} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!captchaVerified}>
            Login
          </button>
        </div>
      </form>
      {message && <p className="error-message">{message}</p>}
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
