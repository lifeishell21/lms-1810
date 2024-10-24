import React, { useState } from 'react';
import '../styles/inputStyle.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const FormCheckbox = ({ name, checked, onChange, label, iconClass, bdr, padds, errorMessage }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Style for the checkbox container
  const wrapperStyle = {
    border: bdr,
    padding: padds,
    borderColor: isFocused ? '#ccc' : (errorMessage ? '#ff8080' : '#ccc'), // Red border on error
    boxShadow: isFocused ? '0 0 5px #ccc' : (errorMessage ? '0 0 5px #ff4d4d' : '0 0 5px rgba(0, 0, 0, 0.1)'), // Red shadow on error
    borderWidth: '2px',
    borderStyle: 'solid',
    outline: 'none',
    display: 'flex', // Flexbox to align items
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '4px', // Add border radius
    //padding: '10px', // Adjust padding
  };

  return (
    <div className="form-group">
      {/* Icon */}
      {iconClass && (
        <span className="icon" style={{ marginRight: '5px' }}>
          <i className={iconClass} />
        </span>
      )}

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange} // Ensure the event is passed here
        id={name} // Unique ID for the checkbox
        onFocus={() => setIsFocused(true)} // Set focus state on click/focus
        onBlur={() => setIsFocused(false)} // Reset focus state on blur
        style={{ marginLeft: '10px' }} // Space between icon and checkbox
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
    </div>
  );
};

export default FormCheckbox;
