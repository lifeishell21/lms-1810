

import React, { useState } from "react";
import '../styles/inputStyle.css';

const FormText = ({ TYPE, name, value, bdr, padds, holder, onChange, errorMessage, icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  const style1 = {
    border: bdr,
    padding: padds,
    borderColor: isFocused ? '#ccc' : (errorMessage ? '#ff8080' : '#ccc'), // Light red border on error
    boxShadow: isFocused
      ? '0 0 5px #ccc'
      : (errorMessage ? '0 0 5px #ff4d4d' : '0 0 5px rgba(0, 0, 0, 0.1)'), // Light red shadow on error
    borderWidth: '2px',
    borderStyle: 'solid',
    outline: 'none',
    display: 'flex', // Use flexbox to align icon and input
    alignItems: 'center', // Center items vertically
    borderRadius: '10px', // Add border radius here
  };

  return (
    <div className="form-group">
      <div style={style1}>
        {/* Icon container */}
        {icon && (
          <div className="icon-container">
            <i className={`icon-class ${icon}`} />
          </div>
        )}
        
        {/* Input field */}
        <input
          type={TYPE || 'text'}
          name={name}
          value={value || ''}
          className="form-control1"
          id="text1"
          onChange={onChange}
          placeholder={holder}
          style={{ flex: 1, border: 'none', outline: 'none', padding: padds }} // Make input flexible and remove its border
          onFocus={() => setIsFocused(true)} // Set focus state on click/focus
          onBlur={() => setIsFocused(false)} // Reset focus state on blur
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
    </div>
  );
};

export default FormText;

