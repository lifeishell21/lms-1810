// // src/services/api.js
// import axios from "axios";
// import Cookies from "js-cookie";


// const REST_API_START_URL = "http://43.254.41.220:8085/suspl-iums/";
// // const REST_API_START_URL = "http://localhost:8091/simlearn/";

// //Page Api Call

// // const RESTAPI_URL = "http://localhost"; // Base URL
// const RESTAPI_URL = "http://43.254.41.220"; // Base URL
// const REST_PORT = "8085";                   // Port
// const REST_API_START = "suspl-iums";          // API start path

// // API Endpoints
// export const API_ENDPOINTS = {
//   login: `${REST_API_START_URL}login`,
//   treeMenu: `${REST_API_START_URL}treeMenu`,
//   logout: `${REST_API_START_URL}logout`,
// };

// // Create an Axios instance for private requests
// export const privateAxios = axios.create({
//   baseURL: REST_API_START_URL,
// });

// // Interceptor to add the token and headers for all requests
// privateAxios.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token"); // Use Cookies to get token
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     config.headers["Content-Type"] = "application/json";
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor to handle responses and check for unauthorized access
// privateAxios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { status } = error.response || {};
//     if (status === 401 || status === 403) {
//       Cookies.remove("token");
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// // -*---------------------------------------------********************************



// export const getSave = (module, pagename, requestBody) => {
//   // Construct the complete URL
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/save`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   // Sending the POST request using privateAxios
//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // Token from local storage
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };


// export const getDelete = (module, pagename, requestBody) => {
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/delete`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const getList = (module, pagename, requestBody) => {
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const getUpdate = (module, pagename, requestBody) => {
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/update`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const getViewRecord = (module, pagename, requestBody) => {
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/viewRecords`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };
// export const getRecordByCount = (module, pagename, requestBody) => {
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/count`;

//   console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

//   return privateAxios.post(
//     url,
//     { encData: requestBody },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// // ---------------------------------------------------------------------------------------------------
// export const getSaveFile = (module, pagename, file, textData) => {
//   // Construct the complete URL
//   const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/save`;

//   console.log("Sending request to:", url);

//   // Create a FormData object
//   const formData = new FormData();

//   // Append the file and text data
//   formData.append("file", file); // Assuming file is a File object
//   formData.append("data", new Blob([JSON.stringify(textData)], { type: 'application/json' })); // Append JSON as a Blob

//   // Sending the POST request using privateAxios
//   return privateAxios.post(url, formData, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`, // Token from local storage
//       // Content-Type will be set to multipart/form-data automatically
//     },
//   });
// };


// // --------------------------------------DropDownApi--------------------------------

// export const getDropDown = async (query, ddRcds,setDDRcds, pagename, secretKey) => {
//   try {
//     const keys = processData(query.fields);
//     const ciphertext = encAESData(secretKey, query);
//     const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${pagename}/dropDownData`;

//     console.log("Sending request to:", url, "with body:", query); // Improved logging

//     const response = await privateAxios.post(
//       url,
//       { encData: ciphertext },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Full response from backend:", response);
//     // const responseData = checkResponseStatus(response);
//     const responseData = response.data;

//     if (responseData.rData) {
//       const recJson = JSON.parse(responseData.rData);
//       const decryptedData = decAESData(secretKey, recJson);
//       console.log("Decrypted Data:", decryptedData);

//       const arraySize = decryptedData.recData.length;
//       const newRecords = [];

//       for (let i = 0; i < arraySize; i++) {
//         let j = 0;
//         const newItem = {
//           value: decryptedData.recData[i][keys[j]], // First key
//           label: decryptedData.recData[i][keys[++j]] || '', // Second key, default to empty string
//         };

//         // Check if the item already exists in the current state
//         const exists = ddRcds.some(item => item.value === newItem.value);

//         // If it does not exist, add to newRecords
//         if (!exists) {
//           newRecords.push(newItem);
//         }
//       }

//       // Update the state with the new records
//       setDDRcds(() => [
//         ...newRecords, // Include newRecords to the previous state
//       ]);
//     } else {
//       console.error("encryptData is undefined in the backend response.");
//     }

//     setResponseMessage("Data retrieved successfully: " + JSON.stringify(responseData));
//   } catch (error) {
//     console.error("Error retrieving data:", error);
//     setResponseMessage("Error retrieving data: " + error.message);
//   }
// };

// const processData = (dataString) => {
//   // Split the string by commas
//   return dataString.split(',');
// };


// src/services/api.js
import axios from "axios";
import Cookies from "js-cookie";


// const REST_API_START_URL = "http://192.168.90.227:8091/suspl-iums/";
// const REST_API_START_URL = "http://192.168.90.227:8091/suspl-iums/";
const REST_API_START_URL = "http://localhost:8091/simlearn/";

//Page Api Call

const RESTAPI_URL = "http://localhost"; // Base URL
// const RESTAPI_URL = "http://192.168.90.227"; // Base URL
const REST_PORT = "8091";                   // Port
// const REST_API_START = "suspl-iums";          // API start path

const REST_API_START = "simlearn";          // API start path

// API Endpoints
export const API_ENDPOINTS = {
  login: `${REST_API_START_URL}login`,
  treeMenu: `${REST_API_START_URL}treeMenu`,
  logout: `${REST_API_START_URL}logout`,
};

// Create an Axios instance for private requests
export const privateAxios = axios.create({
  baseURL: REST_API_START_URL,
});

// Interceptor to add the token and headers for all requests
privateAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Use Cookies to get token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and check for unauthorized access
privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    if (status === 401 || status === 403) {
      Cookies.remove("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// -*---------------------------------------------********************************



export const getSave = (module, pagename, requestBody) => {
  // Construct the complete URL
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/save`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  // Sending the POST request using privateAxios
  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Token from local storage
        "Content-Type": "application/json",
      },
    }
  );
};


export const getDelete = (module, pagename, requestBody) => {
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/delete`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getList = (module, pagename, requestBody) => {
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getUpdate = (module, pagename, requestBody) => {
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/update`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getViewRecord = (module, pagename, requestBody) => {
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/viewRecords`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getRecordByCount = (module, pagename, requestBody) => {
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/count`;

  console.log("Sending request to:", url, "with body:", requestBody); // Improved logging

  return privateAxios.post(
    url,
    { encData: requestBody },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// ---------------------------------------------------------------------------------------------------
export const getSaveFile = (module, pagename, file, textData) => {
  // Construct the complete URL
  const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${module}/${pagename}/save`;

  console.log("Sending request to:", url);

  // Create a FormData object
  const formData = new FormData();

  // Append the file and text data
  formData.append("file", file); // Assuming file is a File object
  formData.append("data", new Blob([JSON.stringify(textData)], { type: 'application/json' })); // Append JSON as a Blob

  // Sending the POST request using privateAxios
  return privateAxios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token from local storage
      // Content-Type will be set to multipart/form-data automatically
    },
  });
};


// --------------------------------------DropDownApi--------------------------------

export const getDropDown = async (query, ddRcds,setDDRcds, pagename, secretKey) => {
  try {
    const keys = processData(query.fields);
    const ciphertext = encAESData(secretKey, query);
    const url = `${RESTAPI_URL}:${REST_PORT}/${REST_API_START}/${pagename}/dropDownData`;

    console.log("Sending request to:", url, "with body:", query); // Improved logging

    const response = await privateAxios.post(
      url,
      { encData: ciphertext },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Full response from backend:", response);
    // const responseData = checkResponseStatus(response);
    const responseData = response.data;

    if (responseData.rData) {
      const recJson = JSON.parse(responseData.rData);
      const decryptedData = decAESData(secretKey, recJson);
      console.log("Decrypted Data:", decryptedData);

      const arraySize = decryptedData.recData.length;
      const newRecords = [];

      for (let i = 0; i < arraySize; i++) {
        let j = 0;
        const newItem = {
          value: decryptedData.recData[i][keys[j]], // First key
          label: decryptedData.recData[i][keys[++j]] || '', // Second key, default to empty string
        };

        // Check if the item already exists in the current state
        const exists = ddRcds.some(item => item.value === newItem.value);

        // If it does not exist, add to newRecords
        if (!exists) {
          newRecords.push(newItem);
        }
      }

      // Update the state with the new records
      setDDRcds(() => [
        ...newRecords, // Include newRecords to the previous state
      ]);
    } else {
      console.error("encryptData is undefined in the backend response.");
    }

    setResponseMessage("Data retrieved successfully: " + JSON.stringify(responseData));
  } catch (error) {
    console.error("Error retrieving data:", error);
    setResponseMessage("Error retrieving data: " + error.message);
  }
};

const processData = (dataString) => {
  // Split the string by commas
  return dataString.split(',');
};


