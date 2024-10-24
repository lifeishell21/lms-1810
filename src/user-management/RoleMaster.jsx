import { useState, useEffect, useRef } from "react";
import "../styles/inputStyle.css";
import FormText from "../components/FormText";
import FormLabel from "../components/FormLabel";
import FormSelect from "../components/FormSelect";
import FormTextarea from "../components/FormTextarea";
import FormCheckbox from "../components/FormCheckbox";
import FormButton from "../components/FormButton";
import Cookies from "js-cookie";
import DynamicTable from "../components/DynamicTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa";
import "../styles/AdvancedSearch.css";
import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
import ErrorMessageABD from "../components/ErrorMessageABD";
import CreateUpdateBar from "../components/CreateUpdateBar";
import SelectComponent from "../components/SelectComponent";    // added for select

import icon from "../properties/icon";

import {
  getDelete,
  getList,
  getSave,
  getUpdate,
  getViewRecord,
  getRecordByCount,
} from "../utils/api";

const RoleMaster = () => {
  const [recordCounts, setRecordCounts] = useState(0);
  const [currectRecordCounts, setCurrentRecordCounts] = useState(0);
  const [countFlag, setCountFlag] = useState(false);

  const [deleteCooldown, setDeleteCooldown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [resetSelect, setResetSelect] = useState(false); // State for manipulating dropdown and search

  const [errorVisibleComponent, setErrorMessageVisibleComponent] =
    useState(false);
  const [errorType, setErrorType] = useState();
  const [errorDivMessage, setErrorDivMessage] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    roleName: "",
    mappedAlias: "",
    roleLevel: "",
  }); // handling error

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Name:", name);
  };

  // changes
  const [rcds, setRcds] = useState({
    role_id: "",
    roleName: "",
    mappedAlias: "",
    roleLevel: "",
    remarks: "",
    isAdmin: "",
    userId: "", // Initial value will be updated in useEffect
    publicIp: "", // Initial value will be updated in useEffect
    createdBy: "",
    modifiedBy: "",
  });

  const [s_userId, setS_UserId] = useState({
    userId: "",
    publicIp: "",
  });

  useEffect(() => {
    const publicIp = Cookies.get("publicIp") || "";
    const uDataCookie = Cookies.get("uData");
    const uData = uDataCookie ? JSON.parse(uDataCookie) : {};
    const userId = uData.userId || "NoUser";

    setS_UserId(() => ({
      userId: userId,
      publicIp: publicIp,
    }));
  }, []);

  const saveButtonRef = useRef(null); // Reference for the Save button

  const [searchRcds, setSearchRcds] = useState({
    roleName: "",
    roleLevel: "",
    IS_ADMIN_ROLE: "",
  });

  const [apiData, setApiData] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const secretKey = "12345";
  const { checkResponseStatus } = useCheckResponseStatus();
  const [isEditing, setIsEditing] = useState(false); // state initaialize
  const data = {
    rName: "Role Name",
    rHolder: "Enter Names",
    roleName: "roleName",
    mAlias: "Mapped Alias",
    mHolder: "Enter Mapped Alias",
    mappedAlias: "mappedAlias",
    roleLevel: "Role Level",
    rlHolder: "Select Role Level",
    remarks: "Remarks",
    placeholder: "Enter Remarks",
    remark: "remarks",
    isAdmin: "Is Admin Role?",
    save: "Save",
    delete: "Delete",
    update: "Update",
    back: "Back",
    reset: "Reset",
    roleNameLength: "60",
    mAliasLength: "10",
    remarkslength: "255",
  };
  const handleBack = () => {
    // Scroll back to the save button
    if (saveButtonRef.current) {
      saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Alternatively, clear form data and reset state if needed
    setRcds({
      role_id: "",
      roleName: "",
      mappedAlias: "",
      roleLevel: "",
      remarks: "",
      isAdmin: "",
      userId: "",
    });
    setResetSelect(true);// for dropdown search 

    setResponseMessage(""); // Clear any displayed messages

    setIsEditing(false);
  };

  const handleReset = () => {
    // Reset rcds to its initial state

    setRcds({
      role_id: rcds.role_id,
      roleName: "",
      mappedAlias: "",
      roleLevel: "",
      remarks: "",
      isAdmin: "",
    });

    setResetSelect(true);// for dropdown search 

    setErrorMessages("");
  };

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setRcds((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));

    // Remove the error for the current field while typing
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message for the current field
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!rcds.roleName) errors.roleName = "Role Name is required";
    if (!rcds.mappedAlias) errors.mappedAlias = "Mapped Alias is required";
    if (!rcds.roleLevel) errors.roleLevel = "Role Level is required";
    return errors;
  };

  const handleCreate = async (evt) => {
    let response;
    evt.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading state
    setIsEditing(false);
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      setLoading(false);
      return;
    }

    const updatedRcds = {
      ...rcds,
      userId: s_userId.userId, // Ensure userId is included
      publicIp: s_userId.publicIp, // Ensure publicIp is included
    };

    console.log("data++++++++++",updatedRcds);
    

    try {
      // Encrypt the updated rcds with the userId
      const ciphertext = encAESData(secretKey, updatedRcds);
      console.log("Encrypted Data: ", ciphertext);

      let responseData;

      console.log(rcds, "varun");

      if (rcds.role_id) {
        // Update the existing record
        response = await getUpdate("user", "roleMaster", ciphertext);
        console.log("Update response from backend:", response.data);

        responseData = checkResponseStatus(response);
      } else {
        // Send data to the backend
        response = await getSave("user", "roleMaster", ciphertext);
        console.log("Response from backend:", response.data);
        responseData = checkResponseStatus(response);
      }

      if (responseData) {
        const jsonData = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, jsonData);
        console.log("Decrypted Data:", decryptedData);

        // Check if the operation was successful
        if (responseData.rType === "Y") {
          setErrorMessageVisibleComponent(true);
          setErrorType(true);
          setErrorDivMessage(responseData.rMessage);

          // Automatically hide the message after it has been shown
          setTimeout(() => {
            setErrorMessageVisibleComponent(false);
            setErrorDivMessage("");
          }, 5000); // Adjust time as needed

          // Clear the form fields by resetting rcds to its initial state
          setRcds({
            // Replace with your initial state for rcds
            role_id: null,
            roleName: "",
            mappedAlias: "",
            roleLevel: "",
            remarks: "",
            isAdmin: "",
            userId: rcds.userId,
            publicIp: rcds.publicIp,
          });

          setResetSelect(true);

        } else {
          setErrorMessageVisibleComponent(true);
          setErrorType(false);
          setErrorDivMessage(responseData.rMessage);
        }

        // Refresh the data list after saving
        getData();
      }
    } catch (error) {
      console.error("Error during create/update:", error);
      setErrorMessageVisibleComponent(true);
      setErrorType(false);
      setErrorDivMessage(response.data.rMessage);
    } finally {
      setLoading(false); // End loading state
    }
  };


  // Reset select value back to false after rendering
  useEffect(() => {
    if (resetSelect) {
        // Reset the select component after render
        setResetSelect(false);
    }
}, [resetSelect]);



  const getData = async () => {
    try {
      // Encrypt the searchRcds data.....
      const ciphertext = encAESData(secretKey, searchRcds);

      // Send request to get the list
      const response = await getList("user", "roleMaster", ciphertext, {});

      console.log("Full response from backend:", response);
      const responseData = checkResponseStatus(response);

      console.log(responseData);

      if (responseData.rData) {
        const jsonData = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, jsonData);

        console.log("Decrypted Data:", decryptedData);

        // Update state with decrypted data
        setApiData(decryptedData.recData);
        setRecordCounts(decryptedData.recData[0].count);
      } else {
        console.error("encryptData is undefined in the backend response.");
      }

      setResponseMessage(
        "Data sent successfully: " + JSON.stringify(responseData)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponseMessage("Error fetching data: " + error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const viewRecord = async (role_id) => {
    try {
      setErrorMessages("");
      const ciphertext = encAESData(secretKey, role_id);

      const response = await getViewRecord("user", "roleMaster", ciphertext);

      console.log("Full response from backend:", response);
      const responseData = checkResponseStatus(response);

      if (responseData.rData) {
        const recJson = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, recJson);
        console.log("Decrypted Data:", decryptedData);

        const dataToSet = decryptedData.recData[0]; // Assuming you want the first item

        // Update rcds state with the decrypted data
        setRcds({
          role_id: dataToSet.role_id,
          roleName: dataToSet.role_name,
          mappedAlias: dataToSet.mapped_alias,
          roleLevel: dataToSet.role_level,
          remarks: dataToSet.remarks,
          isAdmin: dataToSet.admin_role.toUpperCase() === "Y" ? "Y" : "N", // Adjust based on your checkbox logic
          createdBy: dataToSet.createdBy,
          modifiedBy: dataToSet.modifiedBy,
          userId: s_userId.userId, // Use userId from s_userId
          publicIp: s_userId.publicIp, // Use publicIp from s_userId
        });
        setIsEditing(true);
      } else {
        console.error("encryptData is undefined in the backend response.");
      }

      setResponseMessage(
        "Data retrieved successfully: " + JSON.stringify(responseData)
      );
    } catch (error) {
      console.error("Error retrieving data:", error);
      setResponseMessage("Error retrieving data: " + error.message);
    }
  };

  const handleDelete = async (roleId) => {
    setDeleteCooldown(true);
    setIsDeleting(true);
    let response;
    setLoading(true); // Start loading state
    if (!isEditing) {
      try {
        // Encrypt the roleId to send to the backend
        const ciphertext = encAESData(secretKey, roleId);

        // Send the delete request to the backend
        response = await getDelete("user", "roleMaster", ciphertext, {});

        console.log("Delete response from backend:", response.data);
        const responseData = checkResponseStatus(response);

        if (responseData.rData) {
          const jsonData = JSON.parse(responseData.rData);
          const decryptedData = decAESData(secretKey, jsonData);
          console.log("Decrypted Data:", decryptedData);
        } else {
          console.error("encryptData is undefined in the backend response.");
        }

        // Refresh the data after deletion
        getData(); // Refresh the table data
        if (responseData.rType === "Y") {
          // Update state or show success message

          setErrorMessageVisibleComponent(true);
          setErrorType(true);
          setErrorDivMessage(response.data.rMessage);
        } else {
          setErrorMessageVisibleComponent(true);
          setErrorType(false);
          setErrorDivMessage(response.data.rMessage);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        setErrorMessageVisibleComponent(true);
        setErrorType(false);
        setErrorDivMessage(response.data.rMessage);
      } finally {
        setLoading(false); // End loading state
        setIsDeleting(false); // restart delete button

        // Set the cooldown
        setTimeout(() => {
          setDeleteCooldown(false); // Reset the cooldown after 3 seconds
        }, 3000);
      }
    }
  };

  const getRecordCount = async (button) => {
    try {
      let currentCount = Number(currectRecordCounts); // Ensure it's a number
      let countChange = button === "prev" ? -1 : 1; // Determine change based on button
      let newCount = currentCount + countChange; // Calculate the new count

      console.log(button, "-----------button");
      console.log(currectRecordCounts, "-----------currectRecordCounts");
      console.log("flag------", countFlag);

      if (countFlag) {
        currentCount = Number(currectRecordCounts); // Ensure it's a number
        countChange = button === "prev" ? -1 : 1; // Determine change based on button
        newCount = currentCount + countChange; // Calculate the new count
        console.log("entered second case");
      } else {
        currentCount = Number(currectRecordCounts); // Ensure it's a number
        newCount = currentCount; // Calculate the new count
        setCountFlag(true);
      }

      // Prepare the ciphertext for the API call using the new count
      const ciphertext = encAESData(secretKey, {
        currectRecordCounts: newCount,
      });
      const response = await getRecordByCount("user", "roleMaster", ciphertext);
      const responseData = response.data;

      if (responseData.rData) {
        const recJson = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, recJson);
        console.log(decryptedData, "-------getCountrecord");

        const dataToSet = decryptedData.recData[0];
        setRcds({
          role_id: dataToSet.role_id,
          roleName: dataToSet.role_name,
          mappedAlias: dataToSet.mapped_alias,
          roleLevel: dataToSet.role_level,
          remarks: dataToSet.remarks,
          isAdmin: dataToSet.admin_role.toUpperCase() === "Y" ? "Y" : "N", // Adjust based on your checkbox logic
          createdBy: dataToSet.createdBy,
          modifiedBy: dataToSet.modifiedBy,
          userId: s_userId.userId, // Use userId from s_userId
          publicIp: s_userId.publicIp, // Use publicIp from s_userId
        });
      }

      // Update the state with the new count after the API call
      setCurrentRecordCounts(newCount);
      setIsEditing(true);
    } catch (error) {
      console.error("Error retrieving data:", error);
      // Optionally: set an error state or show a notification
    }
  };


  //
  const roleLevelOptions = [
    { value: "L1", label: "Level 1" },
    { value: "L2", label: "Level 2" },
    { value: "L3", label: "Level 3" },
  ];


  const tableData = {
    headers: [
      "S. No.",
      "Role Name",
      "Mapped Alias",
      "Role Level",
      "Admin Role",
      "Remarks",
      "Edit",
      "Delete",
    ],
    rows: apiData.map((item, sno) => ({
      id: sno + 1,
      one: item.role_name,
      two: item.mapped_alias,
      three: item.role_level,
      four: item.admin_role,
      five: item.remarks,
      six: (
        <span
          className="manipulation-icon edit-color"
          onClick={() => {
            const id = { role_id: item.role_id };
            viewRecord(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FontAwesomeIcon icon={faEdit} />{" "}
          <span className="manipulation-text"> Edit</span>
        </span>
      ),
      seven: !isEditing && (
        <span
          className={`manipulation-icon delete-color ${
            deleteCooldown ? "disabled" : ""
          }`}
          onClick={() => {
            if (!deleteCooldown) {
              // Prevent action during cooldown
              const id = { role_id: item.role_id };
              handleDelete(id);
            }
          }}
          style={{
            pointerEvents: deleteCooldown ? "none" : "auto",
            opacity: deleteCooldown ? 0.5 : 1,
          }} // Disable pointer events and add opacity for visual feedback
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="manipulation-text"> Delete</span>
        </span>
      ),
    })),
  };

  return (
    <>
      <div className="rightArea" >
        <div className="container-body">
          <div className="row mb-3">
            <div className="col-6">
              <h4 className="card-title mb-3">Role Master</h4>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button className="plus-button" onClick={toggleSearchBar}>
                <FaPlus size={20} /> {/* Plus Icon */}
              </button>
            </div>
          </div>
          <form action="" className="mb-5" >
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-2">
                    <FormLabel labelNames={data.rName} />
                  </div>
                  <div className="col-md-4">
                    <FormText
                      name={data.roleName}
                      holder={data.rHolder}
                      value={rcds[data.roleName]}
                      errorMessage={errorMessages.roleName} // Pass the error message for roleName
                      onChange={handleChange}
                      icon={icon.user} // Example FontAwesome icon; change as needed
                      bdr="1px solid #ccc" // Border style
                      padds="0px" // Padding for the select input
                      Maxlength={data.roleNameLength}
                    />
                  </div>

                  <div className="col-md-2">
                    <FormLabel labelNames={data.mAlias} />
                  </div>
                  <div className="col-md-4">
                    <FormText
                      name={data.mappedAlias}
                      holder={data.mHolder}
                      value={rcds[data.mappedAlias]}
                      errorMessage={errorMessages.mappedAlias} // Pass the error message for mappedAlias
                      onChange={handleChange}
                      icon={icon.mapAlias} // Example FontAwesome icon; change as needed
                      bdr="1px solid #ccc" // Border style
                      padds="0px" // Padding for the select input
                      Maxlength={data.mAliasLength}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                   <div className="col-md-2">
                    <FormLabel labelNames={data.roleLevel} />
                  </div>
                  {/*<div className="col-md-4">
                    <FormSelect
                      name="roleLevel"
                      value={rcds.roleLevel}
                      options={roleLevelOptions}
                      errorMessage={errorMessages.roleLevel} // Pass the error message for roleLevel
                      onChange={handleChange}
                      icon={icon.arrowDown} // Example icon (FontAwesome star icon)
                      bdr="1px solid #ccc" // Border style
                      padds="0" // Padding for the select input
                    />
                  </div> */}
                     
                     <div className="col-md-4">
                   {/* <SelectComponent
                       name="roleLevel"
                   selectedValue={rcds.roleLevel}  // This will update the select value when editing
                    resetValue={resetSelect}  // This will reset to "Select Role" after save
                      onSelects={(value) => {
                        setRcds((prevState) => ({
                              ...prevState,
                                roleLevel: value,  // Update form state when selection changes
                             }));
                          }}
                     errorMessage={errorMessages.roleLevel}
                         /> */}

<SelectComponent
  name="roleLevel"
  holder="Select Role Level"
  searchPlaceholder="Search Role"
  selectedValue={rcds.roleLevel} // Bind the selected role level value
  resetValue={resetSelect} // Handle reset functionality
  onSelects={(value) =>
    setRcds((prevState) => ({
      ...prevState,
      roleLevel: value, // Update state with selected role level
    }))
  }
  errorMessage={errorMessages.roleLevel} // Display error message for validation
  icon={icon.mapAlias} // Use custom icon (e.g., FontAwesome class)
  bdr="2px solid #007bff" // Customize border style
  padds="0" // No extra padding
  options={roleLevelOptions} // Pass available role level options
/>




                         </div>

                  <div className="col-md-2">
                    <FormLabel labelNames={data.isAdmin} />
                  </div>
                  <div className="col-md-2">
                    <FormCheckbox
                      name="isAdmin"
                      checked={rcds.isAdmin === "Y"} // Check if isAdmin is "Y" for checked
                      onChange={(evt) => {
                        if (evt && evt.target) {
                          const { checked } = evt.target; // Get the checked state
                          setRcds((prevState) => ({
                            ...prevState,
                            isAdmin: checked ? "Y" : "N", // Update isAdmin based on checked state
                          }));
                        }
                      }}
                      label="Admin Access" // Label for better usability
                      errorMessage={errorMessages.isAdmin} // Pass the error message if applicable
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-2">
                    <FormLabel labelNames={data.remarks} />
                  </div>
                  <div className="col-md-10">
                    <FormTextarea
                      holder={data.placeholder}
                      name={data.remark}
                      value={rcds[data.remark]}
                      onChange={handleChange}
                      Maxlength={data.remarkslength}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <FormButton
                      btnType1={data.save}
                      btnType3={data.update}
                      btnType4={data.back}
                      btnType5={data.reset}
                      onClick={handleCreate}
                      onBack={handleBack}
                      onReset={handleReset}
                      showUpdate={!!rcds.role_id}
                      rcds={rcds}
                      loading={loading}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <ErrorMessageABD
                    text={errorDivMessage}
                    isSuccess={errorType}
                    isVisible={errorVisibleComponent}
                    setVisible={setErrorMessageVisibleComponent} // Pass the function to reset visibility
                  />
                </div>
              </div>
              <CreateUpdateBar
                preparedData={rcds.createdBy}
                modifiedData={rcds.modifiedBy}
              />
            </div>
          </form>
          {loading && <div>Loading...</div>} {/* Loading indication */}
          <DynamicTable
            data={tableData}
            count={recordCounts}
            getRecordCount={getRecordCount}
            currentCount={currectRecordCounts}
          />
        </div>
      </div>
    </>
  );
};

export default RoleMaster;













// import { useState, useEffect, useRef } from "react";
// import "../styles/inputStyle.css";
// import FormText from "../components/FormText";
// import FormLabel from "../components/FormLabel";
// import FormSelect from "../components/FormSelect";
// import FormTextarea from "../components/FormTextarea";
// import FormCheckbox from "../components/FormCheckbox";
// import FormButton from "../components/FormButton";
// import Cookies from "js-cookie";
// import DynamicTable from "../components/DynamicTable";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FaPlus } from "react-icons/fa";
// import "../styles/AdvancedSearch.css";
// import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
// import ErrorMessageABD from "../components/ErrorMessageABD";
// import CreateUpdateBar from "../components/CreateUpdateBar";

// import icon from "../properties/icon";

// import {
//   getDelete,
//   getList,
//   getSave,
//   getUpdate,
//   getViewRecord,
//   getRecordByCount,
// } from "../utils/api";

// const RoleMaster = () => {
//   const [recordCounts, setRecordCounts] = useState(0);
//   const [currectRecordCounts, setCurrentRecordCounts] = useState(0);
//   const [countFlag, setCountFlag] = useState(false);

//   const [deleteCooldown, setDeleteCooldown] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const [errorVisibleComponent, setErrorMessageVisibleComponent] =
//     useState(false);
//   const [errorType, setErrorType] = useState();
//   const [errorDivMessage, setErrorDivMessage] = useState("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [errorMessages, setErrorMessages] = useState({
//     roleName: "",
//     mappedAlias: "",
//     roleLevel: "",
//   }); // handling error

//   const toggleSearchBar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSearch = () => {
//     console.log("Search Term:", searchTerm);
//     console.log("Name:", name);
//   };

//   // changes
//   const [rcds, setRcds] = useState({
//     role_id: "",
//     roleName: "",
//     mappedAlias: "",
//     roleLevel: "",
//     remarks: "",
//     isAdmin: "",
//     userId: "", // Initial value will be updated in useEffect
//     publicIp: "", // Initial value will be updated in useEffect
//     createdBy: "",
//     modifiedBy: "",
//   });

//   const [s_userId, setS_UserId] = useState({
//     userId: "",
//     publicIp: "",
//   });

//   useEffect(() => {
//     const publicIp = Cookies.get("publicIp") || "";
//     const uDataCookie = Cookies.get("uData");
//     const uData = uDataCookie ? JSON.parse(uDataCookie) : {};
//     const userId = uData.userId || "NoUser";

//     setS_UserId(() => ({
//       userId: userId,
//       publicIp: publicIp,
//     }));
//   }, []);

//   const saveButtonRef = useRef(null); // Reference for the Save button

//   const [searchRcds, setSearchRcds] = useState({
//     roleName: "",
//     roleLevel: "",
//     IS_ADMIN_ROLE: "",
//   });

//   const [apiData, setApiData] = useState([]);
//   const [responseMessage, setResponseMessage] = useState("");
//   const [loading, setLoading] = useState(false); // Loading state
//   const secretKey = "12345";
//   const { checkResponseStatus } = useCheckResponseStatus();
//   const [isEditing, setIsEditing] = useState(false); // state initaialize
//   const data = {
//     rName: "Role Name",
//     rHolder: "Enter Names",
//     roleName: "roleName",
//     mAlias: "Mapped Alias",
//     mHolder: "Enter Mapped Alias",
//     mappedAlias: "mappedAlias",
//     roleLevel: "Role Level",
//     rlHolder: "Select Role Level",
//     remarks: "Remarks",
//     placeholder: "Enter Remarks",
//     remark: "remarks",
//     isAdmin: "Is Admin Role?",
//     save: "Save",
//     delete: "Delete",
//     update: "Update",
//     back: "Back",
//     reset: "Reset",
//     roleNameLength: "60",
//     mAliasLength: "10",
//     remarkslength: "255",
//   };
//   const handleBack = () => {
//     // Scroll back to the save button
//     if (saveButtonRef.current) {
//       saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
//     }

//     // Alternatively, clear form data and reset state if needed
//     setRcds({
//       role_id: "",
//       roleName: "",
//       mappedAlias: "",
//       roleLevel: "",
//       remarks: "",
//       isAdmin: "",
//       userId: "",
//     });

//     setResponseMessage(""); // Clear any displayed messages

//     setIsEditing(false);
//   };

//   const handleReset = () => {
//     // Reset rcds to its initial state

//     setRcds({
//       role_id: rcds.role_id,
//       roleName: "",
//       mappedAlias: "",
//       roleLevel: "",
//       remarks: "",
//       isAdmin: "",
//     });

//     setErrorMessages("");
//   };

//   const handleChange = (evt) => {
//     const { name, value, type, checked } = evt.target;
//     setRcds((prevState) => ({
//       ...prevState,
//       [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
//     }));

//     // Remove the error for the current field while typing
//     setErrorMessages((prevErrors) => ({
//       ...prevErrors,
//       [name]: "", // Clear error message for the current field
//     }));
//   };

//   const validateFields = () => {
//     const errors = {};
//     if (!rcds.roleName) errors.roleName = "Role Name is required";
//     if (!rcds.mappedAlias) errors.mappedAlias = "Mapped Alias is required";
//     if (!rcds.roleLevel) errors.roleLevel = "Role Level is required";
//     return errors;
//   };

//   const handleCreate = async (evt) => {
//     let response;
//     evt.preventDefault(); // Prevent default form submission
//     setLoading(true); // Start loading state
//     setIsEditing(false);
//     const errors = validateFields();
//     if (Object.keys(errors).length > 0) {
//       setErrorMessages(errors);
//       setLoading(false);
//       return;
//     }

//     const updatedRcds = {
//       ...rcds,
//       userId: s_userId.userId, // Ensure userId is included
//       publicIp: s_userId.publicIp, // Ensure publicIp is included
//     };

//     try {
//       // Encrypt the updated rcds with the userId
//       const ciphertext = encAESData(secretKey, updatedRcds);
//       console.log("Encrypted Data: ", ciphertext);

//       let responseData;

//       console.log(rcds, "varun");

//       if (rcds.role_id) {
//         // Update the existing record
//         response = await getUpdate("user", "roleMaster", ciphertext);
//         console.log("Update response from backend:", response.data);

//         responseData = checkResponseStatus(response);
//       } else {
//         // Send data to the backend
//         response = await getSave("user", "roleMaster", ciphertext);
//         console.log("Response from backend:", response.data);
//         responseData = checkResponseStatus(response);
//       }

//       if (responseData) {
//         const jsonData = JSON.parse(responseData.rData);
//         const decryptedData = decAESData(secretKey, jsonData);
//         console.log("Decrypted Data:", decryptedData);

//         // Check if the operation was successful
//         if (responseData.rType === "Y") {
//           setErrorMessageVisibleComponent(true);
//           setErrorType(true);
//           setErrorDivMessage(responseData.rMessage);

//           // Automatically hide the message after it has been shown
//           setTimeout(() => {
//             setErrorMessageVisibleComponent(false);
//             setErrorDivMessage("");
//           }, 5000); // Adjust time as needed

//           // Clear the form fields by resetting rcds to its initial state
//           setRcds({
//             // Replace with your initial state for rcds
//             role_id: null,
//             roleName: "",
//             mappedAlias: "",
//             roleLevel: "",
//             remarks: "",
//             isAdmin: "",
//             userId: rcds.userId,
//             publicIp: rcds.publicIp,
//           });
//         } else {
//           setErrorMessageVisibleComponent(true);
//           setErrorType(false);
//           setErrorDivMessage(responseData.rMessage);
//         }

//         // Refresh the data list after saving
//         getData();
//       }
//     } catch (error) {
//       console.error("Error during create/update:", error);
//       setErrorMessageVisibleComponent(true);
//       setErrorType(false);
//       setErrorDivMessage(response.data.rMessage);
//     } finally {
//       setLoading(false); // End loading state
//     }
//   };

//   const getData = async () => {
//     try {
//       // Encrypt the searchRcds data
//       const ciphertext = encAESData(secretKey, searchRcds);

//       // Send request to get the list
//       const response = await getList("user", "roleMaster", ciphertext, {});

//       console.log("Full response from backend:", response);
//       const responseData = checkResponseStatus(response);

//       console.log(responseData);

//       if (responseData.rData) {
//         const jsonData = JSON.parse(responseData.rData);
//         const decryptedData = decAESData(secretKey, jsonData);

//         console.log("Decrypted Data:", decryptedData);

//         // Update state with decrypted data
//         setApiData(decryptedData.recData);
//         setRecordCounts(decryptedData.recData[0].count);
//       } else {
//         console.error("encryptData is undefined in the backend response.");
//       }

//       setResponseMessage(
//         "Data sent successfully: " + JSON.stringify(responseData)
//       );
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setResponseMessage("Error fetching data: " + error.message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   const viewRecord = async (role_id) => {
//     try {
//       setErrorMessages("");
//       const ciphertext = encAESData(secretKey, role_id);

//       const response = await getViewRecord("user", "roleMaster", ciphertext);

//       console.log("Full response from backend:", response);
//       const responseData = checkResponseStatus(response);

//       if (responseData.rData) {
//         const recJson = JSON.parse(responseData.rData);
//         const decryptedData = decAESData(secretKey, recJson);
//         console.log("Decrypted Data:", decryptedData);

//         const dataToSet = decryptedData.recData[0]; // Assuming you want the first item

//         // Update rcds state with the decrypted data
//         setRcds({
//           role_id: dataToSet.role_id,
//           roleName: dataToSet.role_name,
//           mappedAlias: dataToSet.mapped_alias,
//           roleLevel: dataToSet.role_level,
//           remarks: dataToSet.remarks,
//           isAdmin: dataToSet.admin_role.toUpperCase() === "Y" ? "Y" : "N", // Adjust based on your checkbox logic
//           createdBy: dataToSet.createdBy,
//           modifiedBy: dataToSet.modifiedBy,
//           userId: s_userId.userId, // Use userId from s_userId
//           publicIp: s_userId.publicIp, // Use publicIp from s_userId
//         });
//         setIsEditing(true);
//       } else {
//         console.error("encryptData is undefined in the backend response.");
//       }

//       setResponseMessage(
//         "Data retrieved successfully: " + JSON.stringify(responseData)
//       );
//     } catch (error) {
//       console.error("Error retrieving data:", error);
//       setResponseMessage("Error retrieving data: " + error.message);
//     }
//   };

//   const handleDelete = async (roleId) => {
//     setDeleteCooldown(true);
//     setIsDeleting(true);
//     let response;
//     setLoading(true); // Start loading state
//     if (!isEditing) {
//       try {
//         // Encrypt the roleId to send to the backend
//         const ciphertext = encAESData(secretKey, roleId);

//         // Send the delete request to the backend
//         response = await getDelete("user", "roleMaster", ciphertext, {});

//         console.log("Delete response from backend:", response.data);
//         const responseData = checkResponseStatus(response);

//         if (responseData.rData) {
//           const jsonData = JSON.parse(responseData.rData);
//           const decryptedData = decAESData(secretKey, jsonData);
//           console.log("Decrypted Data:", decryptedData);
//         } else {
//           console.error("encryptData is undefined in the backend response.");
//         }

//         // Refresh the data after deletion
//         getData(); // Refresh the table data
//         if (responseData.rType === "Y") {
//           // Update state or show success message

//           setErrorMessageVisibleComponent(true);
//           setErrorType(true);
//           setErrorDivMessage(response.data.rMessage);
//         } else {
//           setErrorMessageVisibleComponent(true);
//           setErrorType(false);
//           setErrorDivMessage(response.data.rMessage);
//         }
//       } catch (error) {
//         console.error("Error deleting data:", error);
//         setErrorMessageVisibleComponent(true);
//         setErrorType(false);
//         setErrorDivMessage(response.data.rMessage);
//       } finally {
//         setLoading(false); // End loading state
//         setIsDeleting(false); // restart delete button

//         // Set the cooldown
//         setTimeout(() => {
//           setDeleteCooldown(false); // Reset the cooldown after 3 seconds
//         }, 3000);
//       }
//     }
//   };

//   const getRecordCount = async (button) => {
//     try {
//       let currentCount = Number(currectRecordCounts); // Ensure it's a number
//       let countChange = button === "prev" ? -1 : 1; // Determine change based on button
//       let newCount = currentCount + countChange; // Calculate the new count

//       console.log(button, "-----------button");
//       console.log(currectRecordCounts, "-----------currectRecordCounts");
//       console.log("flag------", countFlag);

//       if (countFlag) {
//         currentCount = Number(currectRecordCounts); // Ensure it's a number
//         countChange = button === "prev" ? -1 : 1; // Determine change based on button
//         newCount = currentCount + countChange; // Calculate the new count
//         console.log("entered second case");
//       } else {
//         currentCount = Number(currectRecordCounts); // Ensure it's a number
//         newCount = currentCount; // Calculate the new count
//         setCountFlag(true);
//       }

//       // Prepare the ciphertext for the API call using the new count
//       const ciphertext = encAESData(secretKey, {
//         currectRecordCounts: newCount,
//       });
//       const response = await getRecordByCount("user", "roleMaster", ciphertext);
//       const responseData = response.data;

//       if (responseData.rData) {
//         const recJson = JSON.parse(responseData.rData);
//         const decryptedData = decAESData(secretKey, recJson);
//         console.log(decryptedData, "-------getCountrecord");

//         const dataToSet = decryptedData.recData[0];
//         setRcds({
//           role_id: dataToSet.role_id,
//           roleName: dataToSet.role_name,
//           mappedAlias: dataToSet.mapped_alias,
//           roleLevel: dataToSet.role_level,
//           remarks: dataToSet.remarks,
//           isAdmin: dataToSet.admin_role.toUpperCase() === "Y" ? "Y" : "N", // Adjust based on your checkbox logic
//           createdBy: dataToSet.createdBy,
//           modifiedBy: dataToSet.modifiedBy,
//           userId: s_userId.userId, // Use userId from s_userId
//           publicIp: s_userId.publicIp, // Use publicIp from s_userId
//         });
//       }

//       // Update the state with the new count after the API call
//       setCurrentRecordCounts(newCount);
//       setIsEditing(true);
//     } catch (error) {
//       console.error("Error retrieving data:", error);
//       // Optionally: set an error state or show a notification
//     }
//   };

//   const roleLevelOptions = [
//     { value: "", label: "Select Role Level" },
//     { value: "L1", label: "Level 1" },
//     { value: "L2", label: "Level 2" },
//     { value: "L3", label: "Level 3" },
//   ];

//   const tableData = {
//     headers: [
//       "S. No.",
//       "Role Name",
//       "Mapped Alias",
//       "Role Level",
//       "Admin Role",
//       "Remarks",
//       "Edit",
//       "Delete",
//     ],
//     rows: apiData.map((item, sno) => ({
//       id: sno + 1,
//       one: item.role_name,
//       two: item.mapped_alias,
//       three: item.role_level,
//       four: item.admin_role,
//       five: item.remarks,
//       six: (
//         <span
//           className="manipulation-icon edit-color"
//           onClick={() => {
//             const id = { role_id: item.role_id };
//             viewRecord(id);
//             window.scrollTo({ top: 0, behavior: "smooth" });
//           }}
//         >
//           <FontAwesomeIcon icon={faEdit} />{" "}
//           <span className="manipulation-text"> Edit</span>
//         </span>
//       ),
//       seven: !isEditing && (
//         <span
//           className={`manipulation-icon delete-color ${
//             deleteCooldown ? "disabled" : ""
//           }`}
//           onClick={() => {
//             if (!deleteCooldown) {
//               // Prevent action during cooldown
//               const id = { role_id: item.role_id };
//               handleDelete(id);
//             }
//           }}
//           style={{
//             pointerEvents: deleteCooldown ? "none" : "auto",
//             opacity: deleteCooldown ? 0.5 : 1,
//           }} // Disable pointer events and add opacity for visual feedback
//         >
//           <FontAwesomeIcon icon={faTrash} />
//           <span className="manipulation-text"> Delete</span>
//         </span>
//       ),
//     })),
//   };

//   return (
//     <>
//       <div className="rightArea">
//         <div className="container-body">
//           <div className="row mb-3">
//             <div className="col-6">
//               <h4 className="card-title mb-3">Role Master</h4>
//             </div>
//             <div className="col-6 d-flex justify-content-end">
//               <button className="plus-button" onClick={toggleSearchBar}>
//                 <FaPlus size={20} /> {/* Plus Icon */}
//               </button>
//             </div>
//           </div>
//           <form action="" className="mb-5">
//             <div className="card">
//               <div className="card-body">
//                 <div className="row mb-3">
//                   <div className="col-md-2">
//                     <FormLabel labelNames={data.rName} />
//                   </div>
//                   <div className="col-md-4">
//                     <FormText
//                       name={data.roleName}
//                       holder={data.rHolder}
//                       value={rcds[data.roleName]}
//                       errorMessage={errorMessages.roleName} // Pass the error message for roleName
//                       onChange={handleChange}
//                       icon={icon.user} // Example FontAwesome icon; change as needed
//                       bdr="1px solid #ccc" // Border style
//                       padds="0px" // Padding for the select input
//                       Maxlength={data.roleNameLength}
//                     />
//                   </div>

//                   <div className="col-md-2">
//                     <FormLabel labelNames={data.mAlias} />
//                   </div>
//                   <div className="col-md-4">
//                     <FormText
//                       name={data.mappedAlias}
//                       holder={data.mHolder}
//                       value={rcds[data.mappedAlias]}
//                       errorMessage={errorMessages.mappedAlias} // Pass the error message for mappedAlias
//                       onChange={handleChange}
//                       icon={icon.mapAlias} // Example FontAwesome icon; change as needed
//                       bdr="1px solid #ccc" // Border style
//                       padds="0px" // Padding for the select input
//                       Maxlength={data.mAliasLength}
//                     />
//                   </div>
//                 </div>

//                 <div className="row mb-3">
//                   <div className="col-md-2">
//                     <FormLabel labelNames={data.roleLevel} />
//                   </div>
//                   <div className="col-md-4">
//                     <FormSelect
//                       name="roleLevel"
//                       value={rcds.roleLevel}
//                       options={roleLevelOptions}
//                       errorMessage={errorMessages.roleLevel} // Pass the error message for roleLevel
//                       onChange={handleChange}
//                       icon={icon.arrowDown} // Example icon (FontAwesome star icon)
//                       bdr="1px solid #ccc" // Border style
//                       padds="0" // Padding for the select input
//                     />
//                   </div>

//                   <div className="col-md-2">
//                     <FormLabel labelNames={data.isAdmin} />
//                   </div>
//                   <div className="col-md-2">
//                     <FormCheckbox
//                       name="isAdmin"
//                       checked={rcds.isAdmin === "Y"} // Check if isAdmin is "Y" for checked
//                       onChange={(evt) => {
//                         if (evt && evt.target) {
//                           const { checked } = evt.target; // Get the checked state
//                           setRcds((prevState) => ({
//                             ...prevState,
//                             isAdmin: checked ? "Y" : "N", // Update isAdmin based on checked state
//                           }));
//                         }
//                       }}
//                       label="Admin Access" // Label for better usability
//                       errorMessage={errorMessages.isAdmin} // Pass the error message if applicable
//                     />
//                   </div>
//                 </div>

//                 <div className="row mb-2">
//                   <div className="col-md-2">
//                     <FormLabel labelNames={data.remarks} />
//                   </div>
//                   <div className="col-md-10">
//                     <FormTextarea
//                       holder={data.placeholder}
//                       name={data.remark}
//                       value={rcds[data.remark]}
//                       onChange={handleChange}
//                       Maxlength={data.remarkslength}
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-12">
//                     <FormButton
//                       btnType1={data.save}
//                       btnType3={data.update}
//                       btnType4={data.back}
//                       btnType5={data.reset}
//                       onClick={handleCreate}
//                       onBack={handleBack}
//                       onReset={handleReset}
//                       showUpdate={!!rcds.role_id}
//                       rcds={rcds}
//                       loading={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-center align-items-center">
//                   <ErrorMessageABD
//                     text={errorDivMessage}
//                     isSuccess={errorType}
//                     isVisible={errorVisibleComponent}
//                     setVisible={setErrorMessageVisibleComponent} // Pass the function to reset visibility
//                   />
//                 </div>
//               </div>
//               <CreateUpdateBar
//                 preparedData={rcds.createdBy}
//                 modifiedData={rcds.modifiedBy}
//               />
//             </div>
//           </form>
//           {loading && <div>Loading...</div>} {/* Loading indication */}
//           <DynamicTable
//             data={tableData}
//             count={recordCounts}
//             getRecordCount={getRecordCount}
//             currentCount={currectRecordCounts}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default RoleMaster;
