import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("User"); // Default to 'User'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app//register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          type, // Send the selected type (Admin or User)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", `Bearer ${data.token}`); // Prefix token with 'Bearer'
        setMessage("User registered successfully");

        // Conditional navigation based on the 'type'
        setTimeout(() => {
          if (type === "Admin") {
            navigate("/admin"); // Redirect to Admin.jsx if type is 'Admin'
          } else {
            navigate("/user"); // Redirect to User.jsx if type is 'User'
          }
        }, 2000);
      } else {
        // Check for specific error message for email already used
        if (data.error === "Email already used") {
          setMessage("This email is already used!");
        } else {
          setMessage("Registration failed: " + data.error);
        }
      }
    } catch (error) {
      setMessage("Error registering user: " + error.message);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Dropdown for selecting Admin or User */}
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <button type="submit" className="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <div className="login">
        <p>Already have an Account?</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
