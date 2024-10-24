import React from "react";
import "../styles/QuickLinks.css"; // Import the CSS file

const QuickLinks = () => {
  return (
    <ul className="breadcrumbs">
      <a href="#" className="breadcrumbs-item qucikLinksActive">
        <li>QuickLinks</li>
      </a>
      <a href="#" className="breadcrumbs-item">
        <li>Season 05</li>
      </a>

      <a href="#" className="breadcrumbs-item">
        <li>Episode 02</li>
      </a>

      <li className="breadcrumbs-item">Smithereens</li>
    </ul>
  );
};

export default QuickLinks;
