
/* @Author Abhishek  @ 23/10/2024*/

import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import '../styles/inputStyle.css'; // Ensure consistent styling

const SelectComponent = ({
  name,
  selectedValue,
  onSelects,
  resetValue = false,
  errorMessage = '',
  icon = '', // Icon class for optional use
  bdr = '1px solid #ccc',
  padds = '10px',
  holder = '',
  searchPlaceholder="",
  height = '40px',
  options = [], // Accept options as prop
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState(holder);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  const fuse = new Fuse(options, { keys: ['label'], threshold: 0.4 });

  const filteredOptions = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : options;

  useEffect(() => {
    if (resetValue) {
      setDisplayValue(holder);
      setSearchTerm('');
    } else {
      const selectedOption = options.find(option => option.value === selectedValue);
      setDisplayValue(selectedOption ? selectedOption.label : holder);
    }
  }, [resetValue, selectedValue, options, holder]);

  const handleSelect = (value) => {
    onSelects(value);
    const selectedOption = options.find(option => option.value === value);
    setDisplayValue(selectedOption ? selectedOption.label : holder);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const wrapperStyle = {
    border: bdr,
    padding: padds,
    height,
    position: 'relative', // Position for dropdown
    borderColor: isFocused ? '#ccc' : errorMessage ? '#ff8080' : '#ccc',
    boxShadow: isFocused
      ? '0 0 5px #ccc'
      : errorMessage
      ? '0 0 5px #ff4d4d'
      : '0 0 5px rgba(0, 0, 0, 0.1)',
    borderWidth: '2px',
    borderStyle: 'solid',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
  };

  const iconStyle = {
    marginRight: '8px', // Space between icon and text
  };

  return (
    <div className="form-group">
      <div style={wrapperStyle} ref={dropdownRef}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <div className="icon-container" style={iconStyle}>
              <i className={`icon-class ${icon}`} />
            </div>
          )}

          <div
            className="select-box"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
            style={{ flex: 1 }} // Ensures the text takes available space
          >
            {displayValue}
          </div>
        </div>

        {isDropdownOpen && (
          <div className="dropdown">
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder} // Dynamic search placeholde
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <ul className="dropdown-list">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="dropdown-item">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <style>{`
        .form-group {
          margin: 10px 0;
        }

        .icon-container {
          margin-right: 8px;
        }

        .select-box {
          padding: 12px 16px;
          cursor: pointer;
          flex: 1;
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 5px); /* Align dropdown directly below the select box */
          left: 0;
          right: 0;
          background-color: white;
          z-index: 1000;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .search-input {
          padding: 8px;
          border: none;
          outline: none;
          width: 100%;
          border-bottom: 1px solid #ccc;
        }

        .dropdown-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .error-message {
          color: #ff4d4d;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default SelectComponent;








// import React, { useState, useEffect, useRef } from 'react';
// import Fuse from 'fuse.js';


// const SelectComponent = ({ selectedValue, onSelects, resetValue }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [defaultSelectedValue, setDefaultSelectedValue] = useState('Select Role');
//     const dropdownRef = useRef(null);

//     const roles = [
//         { name: 'L1' },
//         { name: 'L2' },
//         { name: 'L3' },
//         { name: 'L4' },
//         { name: 'L5' },
//         { name: 'L6' },
//     ];

//     const fuseRef = useRef(new Fuse(roles, { keys: ['name'], threshold: 0.4 }));
//     const filteredVehicles = searchTerm
//         ? fuseRef.current.search(searchTerm).map(result => result.item)
//         : roles;

//     const handleSelect = (value) => {
//         onSelects(value);
//         setDefaultSelectedValue(value);
//         setIsDropdownOpen(false);
//         setSearchTerm('');
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsDropdownOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [dropdownRef]);

//     useEffect(() => {
//         // Reset to default when resetValue is true
//         if (resetValue) {
//             setDefaultSelectedValue('Select Role'); // Reset to default value
//             setSearchTerm(''); // Clear search term
//         } else {
//             // Update defaultSelectedValue when selectedValue changes
//             setDefaultSelectedValue(selectedValue || 'Select Role');
//         }
//     }, [resetValue, selectedValue]);

//            // changes form to div because of nesting error

//     return (
//         <div className="container mt-8">
//             <div className="row">
//                 <div className="col-md-8 d-flex align-items-center">
//                     <label htmlFor="selectVehicle" className="select-label">Role Level</label>
//                     <div
//                         className="custom-select-container ml-4" // Added margin-left to the container
//                         ref={dropdownRef}
//                     >
//                         <div
//                             className="custom-select"
//                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                             tabIndex={0}
//                             aria-expanded={isDropdownOpen}
//                             role="combobox"
//                             aria-controls="vehicle-dropdown"
//                             aria-activedescendant={defaultSelectedValue}
//                         >
//                             {defaultSelectedValue}
//                         </div>
//                         {isDropdownOpen && (
//                             <div className="dropdown-list" id="vehicle-dropdown">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Search role"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     onClick={(e) => e.stopPropagation()}
//                                     aria-label="Search role"
//                                 />
//                                 <ul className="list-unstyled">
//                                     {filteredVehicles.map((vehicle, index) => (
//                                         <li
//                                             key={index}
//                                             className="dropdown-item"
//                                             onClick={() => handleSelect(vehicle.name)}
//                                         >
//                                             {vehicle.name}
//                                         </li>
//                                     ))}
//                                     {filteredVehicles.length === 0 && <li className="dropdown-item">No results found</li>}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Basic styling for demonstration */}
//             <style >{`
//                 .select-label {
//                     margin-right: 5rem; /* Adjust the right margin for the label */
//                 }

//                 .custom-select-container {
//                     position: relative;
//                 }

//                 .custom-select {
//                     border: 1px solid #ced4da;
//                     padding: 0.375rem 0.75rem;
//                     border-radius: 0.5rem;
//                     cursor: pointer;
//                     background-color: #fff;
//                     margin-left: 30px;
//                     min-width: 340px; /* Set a minimum width for the select */
//                 }

//                 .dropdown-list {
//                     position: absolute;
//                     top: 100%;
//                     left: 0;
//                     right: 0;
//                     border: 1px solid #ced4da;
//                     background-color: white;
//                     z-index: 1000;
//                     margin-left: 25px;
//                     border-radius: 0.5rem;
//                     box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
//                 }

//                 .dropdown-list input {
//                     border: none;
//                     padding: 0.375rem 0.75rem;
//                     border-bottom: 1px solid #ced4da;
//                     width: 100%;
//                 }

//                 .dropdown-item {
//                     padding: 0.375rem 0.75rem;
//                     cursor: pointer;
//                 }

//                 .dropdown-item:hover {
//                     background-color: #f8f9fa;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default SelectComponent;
