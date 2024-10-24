// src/pages/SessionTimeout.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons"; // Adding clock icon
import '../styles/SessionTimeout.css'; // Import CSS for styling

const SessionTimeout = () => {
  return (
    <div className="session-timeout-container">
      <div className="session-timeout-content">
        <FontAwesomeIcon icon={faClock} className="session-timeout-icon" />
        <h1 className="session-timeout-title">Session Timeout</h1>
        <p className="session-timeout-message">
          Your session has expired due to inactivity. Please log in again to continue.
        </p>
        <a href="/" className="session-timeout-home-link">Return to Home</a>
      </div>
    </div>
  );
};

export default SessionTimeout;
