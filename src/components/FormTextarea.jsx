import React from "react";
import '../styles/inputStyle.css'

const FormTextarea = ({ name, value, holder, onChange }) => {
  return (
    <textarea
      name={name}     
      value={value}         
      placeholder={holder}    
      onChange={onChange}     
      className="form-control" 
    />
  );
};

export default FormTextarea;
