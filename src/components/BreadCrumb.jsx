// BreadCrumb.jsx

import React from "react";
import "../styles/breadcrumb.css"; // Assuming the CSS is in the same folder

const BreadCrumb = ({ items }) => {
  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">
              <i className="fas fa-home"></i> Home
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="/category">
              <i className="fas fa-folder"></i> Category
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <i className="fas fa-file-alt"></i> Current Page
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadCrumb;
