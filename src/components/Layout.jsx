import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { privateAxios, API_ENDPOINTS } from "../utils/api";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons"; // Import the power-off icon
import config from "../properties/config";
import "../styles/Layout.css";
import Cookies from "js-cookie";
import HeaderSearch from "./HeaderSearch";

import {
  faMoneyBill,
  faIdBadge,
  faBuilding,
  faBalanceScale,
  faBank,
  faCalendar,
  faBook,
  faCreditCard,
  faShoppingCart,
  faFileAlt,
  faUserPlus,
  faGraduationCap,
  faAngleDown,
  faAngleUp,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const iconMapping = {
  "fa-money": faMoneyBill,
  "fa-id-badge": faIdBadge,
  "fa-building": faBuilding,
  "fa-balance-scale": faBalanceScale,
  "fa-bank": faBank,
  "fa-calendar": faCalendar,
  "fa-book": faBook,
  "fa-credit-card": faCreditCard,
  "fa-shopping-cart": faShoppingCart,
  "fa-file-text": faFileAlt,
  "fa-user-plus": faUserPlus,
  "fa-graduation-cap": faGraduationCap,
};

import Loading from "./Loading";
import useCheckResponseStatus from "../hooks/useCheckResponseStatus";

const Layout = ({ children }) => {
  const { checkResponseStatus } = useCheckResponseStatus();
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [islogout, setLogout] = useState(false);

  // const userId = queryParams.get("userId") || "Guest";
  const [searchTerm, setSearchTerm] = useState(""); // added for searching

  const [userId, setUserId] = useState("Guest");

  const sidebarRef = useRef(null); // Reference to the sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarVisible(false);
    }
  };

  //added for searching
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter treeData based on searchTerm
  const filteredTreeData = treeData.filter((item) =>
    item.menuPrompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // form submit
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const matchingItem = filteredTreeData.find((item) =>
      item.menuPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingItem) {
      navigate(matchingItem.jspFile || "/");
    }
  };

  const findMenuHierarchy = (menuId) => {
    let parentMenu = null;

    // Find the menu item that corresponds to the given menuId
    const menuItem = treeData.find((item) => item.menu_Id === menuId);

    // If a menu item is found, check for its parent
    if (menuItem) {
      parentMenu = treeData.find((item) => item.menu_Id === menuItem.parent_id);
    }

    return { parentMenu };
  };

  useEffect(() => {
    const publicIp = Cookies.get("publicIp") || "";
    const uDataCookie = Cookies.get("uData");
    const uData = uDataCookie ? JSON.parse(uDataCookie) : {};
    const userId = uData.userId || "NoUser";
    setUserId(userId);
  }, []);

  const [rcds, setRcds] = useState({
    userId: userId,
  });

  const secretKey = "12345";

  const logout = async () => {
    setLogout(true);
    try {
      // changes
      const ciphertext = encAESData(secretKey, { userId });
      console.log("Encrypted Data: ", ciphertext);
      const response = await privateAxios.post(API_ENDPOINTS.logout, {
        encData: ciphertext,
      });

      const responseData = checkResponseStatus(response);

      if (responseData.rType === "Y") {
        Cookies.remove("token");
        Cookies.remove("uData");
        Cookies.remove("AESDecKey");
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLogout(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = "ADMIN"; // Set your userId here
      const requestBody = {
        userId: userId,
      };

      setLoading(true);
      const token = localStorage.getItem("token");

      // Check if the token exists before making the API call
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // console.log("Token:", token); // Log token to check if it's being received correctly

        // Encrypt request body (assume encAESData is your encryption function)
        const ciphertext = encAESData(secretKey, requestBody);
        const cipherJson = {
          encData: ciphertext,
        };

        // Make the API request
        const response = await fetch(API_ENDPOINTS.treeMenu, {
          method: "POST", // Change to GET if your API expects GET requests
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            "Content-Type": "application/json", // Set the content type
          },
          body: JSON.stringify(cipherJson), // Send encrypted data in the body
        });

        // Check for unsuccessful responses
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);

        checkResponseStatus(data);

        if (data.rData) {
          // Decrypt response data (assume decAESData is your decryption function)
          const recJson = JSON.parse(data.rData);
          const decryptedData = decAESData(secretKey, recJson);
          console.log("Decrypted Data:", decryptedData);

          // Update the treeData state with the decrypted data
          setTreeData(decryptedData.recData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load menu data. Please try again later.");
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // [] ensures this effect runs only once when the component mounts

  const handleMenuClick = (menuId) => {
    setActiveMenu((prev) => (prev === menuId ? null : menuId));
  };

  const handleSubMenuClick = (menuId) => {
    setOpenSubMenu((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }));
  };

  const hasChildren = (menuId) => {
    return treeData.some((item) => item.parent_id === menuId);
  };

  const renderSubMenu = (menuItem) => {
    return (
      <ul className="submenu">
        {treeData
          .filter((subMenu) => subMenu.parent_id === menuItem.menu_Id)
          .map((subMenu) => {
            const isSubMenuOpen = openSubMenu[subMenu.menu_Id];
            return (
              <li key={subMenu.menu_Id} className="submenu-item">
                <div
                  onClick={() => handleSubMenuClick(subMenu.menu_Id)}
                  className="submenu-title"
                >
                  <FontAwesomeIcon
                    icon={iconMapping[subMenu.imgFile] || faFileAlt}
                    className="menu-icon"
                  />
                  {hasChildren(subMenu.menu_Id) ? (
                    <span className="menu-text">{subMenu.menuPrompt}</span>
                  ) : (
                    <NavLink
                      className="nav-link sub-link"
                      to={subMenu.jspFile || "/"}
                      activeClassName="active" // This class will be added when the link is active
                    >
                      <span className="menu-text">{subMenu.menuPrompt}</span>
                    </NavLink>
                  )}
                  {hasChildren(subMenu.menu_Id) && (
                    <FontAwesomeIcon
                      icon={isSubMenuOpen ? faAngleUp : faAngleDown}
                      className="dropdown-icon"
                    />
                  )}
                </div>
                {isSubMenuOpen &&
                  hasChildren(subMenu.menu_Id) &&
                  renderSubMenu(subMenu)}
              </li>
            );
          })}
      </ul>
    );
  };

  //added
  const renderParentMenu = () => {
    return filteredTreeData
      .filter((menuItem) => menuItem.parent_id === -1)
      .map((menuItem) => {
        const hasSubMenu = treeData.some(
          (subMenu) => subMenu.parent_id === menuItem.menu_Id
        );
        return (
          <li
            key={menuItem.menu_Id}
            className={`menu-item ${
              activeMenu === menuItem.menu_Id ? "active" : ""
            }`}
          >
            <div
              onClick={() => handleMenuClick(menuItem.menu_Id)}
              className="menu-title"
            >
              <FontAwesomeIcon
                icon={iconMapping[menuItem.imgFile] || faFileAlt}
                className="menu-icon"
              />
              <span className="menu-text">{menuItem.menuPrompt}</span>
              {hasSubMenu && (
                <FontAwesomeIcon
                  icon={
                    activeMenu === menuItem.menu_Id ? faAngleUp : faAngleDown
                  }
                  className="dropdown-icon"
                />
              )}
            </div>
            {activeMenu === menuItem.menu_Id &&
              hasSubMenu &&
              renderSubMenu(menuItem)}
          </li>
        );
      });
  };

  useEffect(() => {
    // Hide sidebar initially on mobile view
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`layout ${
        isSidebarVisible ? "with-sidebar" : "without-sidebar"
      }`}
    >
      <header className="header">
        <button
          className="toggle-button"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="bar-icon" />
        </button>
        <img src={config.logoPath} alt="logo" className="header-logo" />

        <div className="header-left">
          <div className="header-text">
            <h5 className="sub-heading mobileView">{config.headerTitle}</h5>
          </div>
       

         {/* Insert HeaderSearch component here
    <HeaderSearch
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearchSubmit={handleSearchSubmit}
      handleSearchChange={handleSearchChange}
    />
        */}
          
        </div>
        
        
        <div className="header-icons">
          <span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Profile"
              className="profile-image"
            />
          </span>
          
          <button
            onClick={!islogout ? logout : null}
            className="logout-button"
            disabled={islogout}
            aria-label="Logout"
          >
            {islogout ? (
              <span>Logging out...</span>
            ) : (
              <>
                <FontAwesomeIcon icon={faPowerOff} /> Logout
              </>
            )}
          </button>
        </div>
      </header>
      <aside className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
        <form onSubmit={handleSearchSubmit} className="mb-0 p-1 search-form">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input mb-0"
            />
          </div>
        </form>

        <ul className="menu">
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              {searchTerm && filteredTreeData.length > 0 && (
                <ul className="search-results">
                  {filteredTreeData.map((item) => {
                    const { parentMenu } = findMenuHierarchy(item.menu_Id);
                    const parentPrompt = parentMenu
                      ? parentMenu.menuPrompt
                      : "Main Menu";
                    return (
                      <li key={item.menu_Id} className="search-result-item">
                        <button
                          onClick={() => navigate(item.jspFile || "/")}
                          className="search-result-button"
                        >
                          <strong>{parentPrompt}:</strong> {item.menuPrompt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {treeData.length > 0 ? (
                renderParentMenu()
              ) : (
                <div>No data available</div>
              )}
            </>
          )}
        </ul>
      </aside>
      <main
        className={`main-content ${
          isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        {children}
      </main>
      <footer className="footer">
        <span>{config.footerText}</span>
      </footer>
    </div>
  );
};

export default Layout;
