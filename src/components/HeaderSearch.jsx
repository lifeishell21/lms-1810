import React, { useState } from "react";
import "../styles/HeaderSearch.css"; // Import the CSS file
import icon from "../properties/icon";

const HeaderSearch = () => {
  const [showList, setShowList] = useState(false); // State to toggle the list
  const suggestions = ["Search Item 1", "Search Item 2", "Search Item 3"]; // Sample data for suggestions

  // Show the list when the input is focused
  const handleFocus = () => {
    setShowList(true);
  };

  // Hide the list when the input loses focus (optional)
  const handleBlur = () => {
    // Delay hiding to allow click on the list items
    setTimeout(() => {
      setShowList(false);
    }, 200);
  };

  return (
    <div className="headersearchwith-input-box">
      <i className={`headersearchwith-icon ${icon.magnifyingglass}`} />
      <input
        type="text"
        placeholder="Search here..."
        className="headersearchwith-input"
        onFocus={handleFocus}   // Show list when focused
        onBlur={handleBlur}     // Hide list when blurred
      />
      <button className="headersearchwith-button">🎤</button>

      {/ Conditionally render the list /}
      {showList && (
        <ul className="headersearchwith-suggestions">
          {suggestions.map((item, index) => (
            <li key={index} className="headersearchwith-suggestion-item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeaderSearch;
