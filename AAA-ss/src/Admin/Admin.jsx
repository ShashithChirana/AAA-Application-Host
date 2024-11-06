import React, { useState, useEffect } from "react";
import "./admin.css"; // Importing the CSS file

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
    }
  }, [token]); // Check for token on component mount

  // Fetch user details
  const fetchUserDetails = async () => {
    if (!token) {
      setError("You must be logged in to fetch user details.");
      return;
    }

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token correctly as a Bearer token
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users); // Store the user details in the state
        setError("");
      } else {
        // Check for specific error code or message from backend
        if (data.error === "Unauthorized" || response.status === 403) {
          setError("You do not have permission to access user details.");
        } else {
          setError(data.error || "Failed to fetch user details.");
        }
      }
    } catch (error) {
      setError("Failed to fetch user details. Please try again.");
    }
  };

  // Fetch user actions
  const fetchUserActions = async () => {
    if (!token) {
      setError("You must be logged in to view user actions.");
      return;
    }

    try {
      const response = await fetch("https://aaa-application-host-server.vercel.app/user-actions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token correctly as a Bearer token
        },
      });

      const data = await response.json();

      if (response.ok) {
        setActions(data.actions); // Store the user actions in the state
        setError("");
      } else {
        setError(data.error || "Failed to fetch user actions.");
      }
    } catch (error) {
      setError("Failed to fetch user actions. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="blue-heading">Welcome Admin!</h1>
      <div className="button-group">
        <button className="user-details-btn" onClick={fetchUserDetails}>
          User Details
        </button>
        <button className="view-actions-btn" onClick={fetchUserActions}>
          View Actions
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Container for details and actions side by side */}
      <div className="details-actions-container">
        {/* Display user details in a box */}
        {users.length > 0 && (
          <div className="user-details-box">
            {users.map((user, index) => (
              <div key={index} className="user-detail">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Type:</strong> {user.type}</p>
              </div>
            ))}
          </div>
        )}

        {/* Display user actions in a box */}
        {actions.length > 0 && (
          <div className="user-actions-box">
            {actions.map((action, index) => (
              <div key={index} className="action-detail">
                <p><strong>Action:</strong> {action.action}</p>
                <p><strong>User ID:</strong> {action.user_id}</p>
                <p><strong>Time:</strong> {new Date(action.action_time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
