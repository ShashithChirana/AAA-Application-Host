import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import myImage from "../Images/AAAimg2.jpg"; // Import the image from the local folder

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup"); // Redirect to the signup page when the button is clicked
  };

  return (
    <div className="home-container">
      <h1 className="home-heading">SECURE WRAPPER APPLICATION  </h1>
      <img
        src={myImage} 
        alt="AAA Application"
        className="home-image"
      />
      <div>
      <button className="home-button" onClick={handleGetStarted}>
        Get Started
      </button>
      </div>
    </div>
  );
};

export default Home;
