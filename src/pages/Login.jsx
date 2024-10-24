import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS, privateAxios } from "../utils/api";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const generateShortHash = (hashedPassword) => {
    return hashedPassword.substring(0, 8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const publicIp = await getClientIp(); // Ensure this returns the IP correctly
    console.log(publicIp, "Public IP to send");

    // Hash the password using MD5 before sending to the server
    const hashedPassword = CryptoJS.MD5(password).toString();
    const shortHash = generateShortHash(hashedPassword);


    const data = {
      emailId,
      password: shortHash,
      publicIp,
    };

    console.log(data, "check12");

    // Debugging logs
    console.log("Data being sent to API:", { emailId, password: "[HIDDEN]" });

    try {
      const response = await privateAxios.post(API_ENDPOINTS.login, data, {
        headers: {
          Flag: "login",
        },
      });
      Cookies.remove("token");
      Cookies.remove("uData");
      Cookies.remove("AESDecKey");
      localStorage.clear();
      const { rType, token, rMessage, uData, AESDecKey } = response.data;

      if (rType === "Y") {
        // changes 

        // const publicIp = getClientIp();

        // Store token and other data in cookies and localStorage
        // changes 
        Cookies.set("publicIp", publicIp);
        Cookies.set("token", token);
        Cookies.set("AESDecKey", AESDecKey);
        Cookies.set("uData", JSON.stringify(uData), { expires: 1 / 8 });
        localStorage.setItem("token", token);
        localStorage.setItem("uData", JSON.stringify(uData));

        // Navigate to dashboard
        const userId = uData.userId;
        navigate(`/dashboard?userId=${userId}`);
      } else {
        // Login failed, show error message
        setError(rMessage || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(
        error.response?.data?.rMessage ||
        "Login failed due to an error. Please try again."
      );
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

  // changes 
  function getClientIp() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.ipify.org?format=json", false); // `false` makes the request synchronous
    xhr.send();

    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      return data.ip;
    } else {
      console.error("Error fetching IP:", xhr.statusText);
    }
  }



  return (
    <div className="upperLoginBody">
      <div className="containerBody">
        <div className="forms">
          <div className="form-content">
            <div className="login-form">
              <div className="title">Login</div>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="input-boxes">
                  <div className="input-box input-boxLogin">
                    <FontAwesomeIcon icon={faUser} className="input-icon"/>

                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box input-boxLogin">
                    <FontAwesomeIcon icon={faLock} className="input-icon"/>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {password && (
                      <div
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="faEyeSlash"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text">
                    <a href="/forgot-password">Forgot password?</a>
                  </div>
                  <div className="button input-box">
                  <input 
                      type="submit" 
                      value={loading ? "Loading..." : "Submit"} 
                      disabled={loading} 
                    />
                  </div>
                  <div className="text sign-up-text">
                    Don't have an account?{" "}
                    <label htmlFor="flip">Signup now</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
