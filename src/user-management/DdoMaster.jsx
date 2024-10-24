import { useState, useEffect, useRef } from "react";
import "../styles/inputStyle.css";
import FormText from "../components/FormText";
import FormLabel from "../components/FormLabel";
import FormTextarea from "../components/FormTextarea";
import FormButton from "../components/FormButton";
import Cookies from "js-cookie";
import DynamicTable from "../components/DynamicTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa"; // This import should work
import "../styles/AdvancedSearch.css";
import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
import ErrorMessageABD from "../components/ErrorMessageABD";
import CreateUpdateBar from "../components/CreateUpdateBar";

import {
  getDelete,
  getList,
  getSave,
  getUpdate,
  getViewRecord,
  getRecordByCount
} from "../utils/api";

const DDOMaster = () => {
  // const [recordCounts, setRecordCounts] = useState(0);
  // const [currectRecordCounts, setCurrentRecordCounts] = useState(0);
  // const [countFlag, setCountFlag] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false); // state initaialize
  const [deleteCooldown, setDeleteCooldown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const [errorMessages, setErrorMessages] = useState({
    ddoName: "",
    ddoCode: "",
  }); // handling error

  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Name:", name);
  };

  // changes
  const [rcds, setRcds] = useState({
    ddoId: "",
    ddoName: "",
    ddoCode: "",
    remarks: "",
    userId: "", // Initial value will be updated in useEffect
    publicIp: "", // Initial value will be updated in useEffect
    createdBy: "",
    modifiedBy: "",
  });

  const [errorVisibleComponent, setErrorMessageVisibleComponent] =
    useState(false);
  const [errorType, setErrorType] = useState();
  const [errorDivMessage, setErrorDivMessage] = useState("");

  const [s_userId, setS_UserId] = useState({
    userId: "",
    publicIp: "",
  });

  useEffect(() => {
    const publicIp = Cookies.get("publicIp") || "";
    const uDataCookie = Cookies.get("uData");
    const uData = uDataCookie ? JSON.parse(uDataCookie) : {};
    const userId = uData.userId || "NoUser";

    console.log("Retrieved public IP:", publicIp); // Log the public IP
    console.log("Retrieved user ID:", userId); // Log the user ID

    setS_UserId(() => ({
      userId: userId,
      publicIp: publicIp,
    }));
  }, []);

  const saveButtonRef = useRef(null); // Reference for the Save button

  const [searchRcds, setSearchRcds] = useState({
    ddoName: "",
    ddoCode: "",
  });

  const [apiData, setApiData] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const secretKey = "12345";
  const { checkResponseStatus } = useCheckResponseStatus();

  const data = {
    dName: "DDO Name",
    dHolder: "Enter DDO",
    dCode: "DDO CODE",
    DHolder: "Enter Code",
    remarks: "Remarks",
    placeholder: "Enter Remarks",
    remark: "remarks",
    isAdmin: "Is Admin Role?",
    save: "Save",
    delete: "Delete",
    update: "Update",
    back: "Back",
    reset: "Reset",
  };
  const handleBack = () => {
    // Scroll back to the save button
    if (saveButtonRef.current) {
      saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Alternatively, clear form data and reset state if needed
    setRcds({
      ddoName: "",
      ddoCode: "",
      remarks: "",
      userId: "",
    });

    setResponseMessage(""); // Clear any displayed messages
    setIsEditing(false);
  };

  const handleReset = () => {
    // Reset rcds to its initial state
    setRcds({
      ddoId: rcds.ddoId,
      ddoName: "",
      ddoCode: "",
      remarks: "",
    });

    setErrorMessages("");
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setRcds((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrorMessages((prevMessage) => ({
      ...prevMessage,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};
    if (!rcds.ddoName) errors.ddoName = "DDO Name is required";
    if (!rcds.ddoCode) errors.ddoCode = "DDO Code is required";

    return errors;
  };

  const handleCreate = async (evt) => {
    let response;
    evt.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading state
    setIsEditing(false);

    try {
      const errors = validate();
      if (Object.keys(errors).length > 0) {
        setErrorMessages(errors);
        setLoading(false);
        return;
      }
      // Prepare data for the API call, including userId and publicIp
      const updatedRcds = {
        ...rcds,
        userId: s_userId.userId, // Ensure userId is included
        publicIp: s_userId.publicIp, // Ensure publicIp is included
      };

      // Encrypt the updated rcds with the userId
      const ciphertext = encAESData(secretKey, updatedRcds);
      console.log("Encrypted Data: ", ciphertext);

      let responseData;

      if (rcds.ddoId) {
        // Update the existing record
        response = await getUpdate("user", "ddoMaster", ciphertext);
        console.log("Update response from backend:", response.data);
        // responseData = response.data;

        responseData = checkResponseStatus(response);
      } else {
        // Send data to the backend
        const response = await getSave("user", "ddoMaster", ciphertext);
        console.log("Response from backend:", response.data);
        responseData = checkResponseStatus(response);
      }

      if (responseData) {
        const jsonData = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, jsonData);
        console.log("Decrypted Data:", decryptedData);

        // Check if the operation was successful
        if (responseData.rType === "Y") {
          // Clear the form fields by resetting rcds to its initial state
          setErrorMessageVisibleComponent(true);
          setErrorType(true);
          setErrorDivMessage(responseData.rMessage);
          // Automatically hide the message after it has been shown
          setTimeout(() => {
            setErrorMessageVisibleComponent(false);
            setErrorDivMessage("");
          }, 5000); // Adjust time as needed
          setRcds({
            // Replace with your initial state for rcds
            ddoId: null,
            ddoName: "",
            ddoCode: "",
            remarks: "",
            userId: rcds.userId,
            publicIp: rcds.publicIp,
          });
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

  const getData = async () => {
    try {
      // Encrypt the searchRcds data
      const ciphertext = encAESData(secretKey, searchRcds);

      // Send request to get the list
      const response = await getList("user", "ddoMaster", ciphertext, {});

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

  const viewRecord = async (ddoId) => {
    try {
      const ciphertext = encAESData(secretKey, ddoId);

      const response = await getViewRecord("user", "ddoMaster", ciphertext);

      console.log("Full response from backend:", response);
      const responseData = checkResponseStatus(response);

      if (responseData.rData) {
        const recJson = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, recJson);
        console.log("Decrypted Data:", decryptedData);

        const dataToSet = decryptedData.recData[0]; // Assuming you want the first item

        // Update rcds state with the decrypted data
        setRcds({
          ddoId: dataToSet.ddoId,
          ddoName: dataToSet.ddoName,
          ddoCode: dataToSet.ddoCode,
          remarks: dataToSet.remarks,
          publicIp: s_userId.publicIp, // Use publicIp from s_userId
          userId: s_userId.userId, // Use userId from s_userId
          createdBy: dataToSet.createdBy,
          modifiedBy: dataToSet.modifiedBy,
        });
      } else {
        console.error("encryptData is undefined in the backend response.");
      }

      setResponseMessage(
        "Data retrieved successfully: " + JSON.stringify(responseData)
      );
      setIsEditing(true);
    } catch (error) {
      console.error("Error retrieving data:", error);
      setResponseMessage("Error retrieving data: " + error.message);
    }
  };

  const handleDelete = async (ddoId) => {
    setDeleteCooldown(true);
    setIsDeleting(true);
    let response;
    setLoading(true); // Start loading state
    if (!isEditing) {
      try {
        // Encrypt the roleId to send to the backend
        const ciphertext = encAESData(secretKey, ddoId);

        // Send the delete request to the backend
        response = await getDelete("user", "ddoMaster", ciphertext, {});

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

  // const getRecordCount = async (button) => {
  //   try {
  //     let currentCount = Number(currectRecordCounts); // Ensure it's a number
  //     let countChange = button === "prev" ? -1 : 1; // Determine change based on button
  //     let newCount = currentCount + countChange; // Calculate the new count

  //     console.log(button, "-----------button");
  //     console.log(currectRecordCounts, "-----------currectRecordCounts");
  //     console.log("flag------", countFlag);

  //     if (countFlag) {
  //       currentCount = Number(currectRecordCounts); // Ensure it's a number
  //       countChange = button === "prev" ? -1 : 1; // Determine change based on button
  //       newCount = currentCount + countChange; // Calculate the new count
  //       console.log("entered second case");
  //     } else {
  //       currentCount = Number(currectRecordCounts); // Ensure it's a number
  //       newCount = currentCount; // Calculate the new count
  //       setCountFlag(true);
  //     }

  //     // Prepare the ciphertext for the API call using the new count
  //     const ciphertext = encAESData(secretKey, {
  //       currectRecordCounts: newCount,
  //     });
  //     const response = await getRecordByCount("user", "ddoMaster", ciphertext);
  //     const responseData = response.data;

  //     if (responseData.rData) {
  //       const recJson = JSON.parse(responseData.rData);
  //       const decryptedData = decAESData(secretKey, recJson);
  //       console.log(decryptedData, "-------getCountrecord");

  //       const dataToSet = decryptedData.recData[0];
  //       setRcds({
  //         ddoId: dataToSet.ddoId,
  //         ddoName: dataToSet.ddoName,
  //         ddoCode: dataToSet.ddoCode,
  //         remarks: dataToSet.remarks,
  //         publicIp: s_userId.publicIp, // Use publicIp from s_userId
  //         userId: s_userId.userId, // Use userId from s_userId
  //         createdBy: dataToSet.createdBy,
  //         modifiedBy: dataToSet.modifiedBy,
  //       });
  //     }

  //     // Update the state with the new count after the API call
  //     setCurrentRecordCounts(newCount);
  //     setIsEditing(true);
  //   } catch (error) {
  //     console.error("Error retrieving data:", error);
  //     // Optionally: set an error state or show a notification
  //   }
  // };

  const tableData = {
    headers: ["S. No.", "Ddo Name", "Ddo Code", "Remarks", "Edit", "Delete"],
    rows: apiData.map((item, sno) => ({
      id: sno + 1,
      one: item.ddoName,
      two: item.ddoCode,
      three: item.remarks,
      four: (
        <span
          className="manipulation-icon edit-color"
          onClick={() => {
            const id = { ddoId: item.ddoId };
            viewRecord(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FontAwesomeIcon icon={faEdit} />{" "}
          <span className="manipulation-text"> Edit</span>
        </span>
      ),
      five: !isEditing && (
        <span
          className={`manipulation-icon delete-color ${
            deleteCooldown ? "disabled" : ""
          }`}
          onClick={() => {
            if (!deleteCooldown) {
              // Prevent action during cooldown
              const id = { ddoId: item.ddoId };
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
      <div className="rightArea">
        <div className="container-body">
          <div className="row mb-3">
            <div className="col-6">
              <h4 className="card-title mb-3">DDO Master</h4>
            </div>
          </div>
          <form action="" className="mb-5">
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-2">
                    <FormLabel labelNames={data.dName} />
                  </div>
                  <div className="col-md-4">
                    <FormText
                      name="ddoName" // Match this with rcds key
                      holder={data.dHolder}
                      value={rcds.ddoName} // Accessing the state value
                      onChange={handleChange}
                      errorMessage={errorMessages.ddoName}
                      Maxlength={30}
                    />
                  </div>

                  <div className="col-md-2">
                    <FormLabel labelNames={data.dCode} />
                  </div>
                  <div className="col-md-4">
                    <FormText
                      name="ddoCode"
                      holder={data.DHolder}
                      value={rcds.ddoCode}
                      onChange={handleChange}
                      errorMessage={errorMessages.ddoCode}
                      Maxlength={3}
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
                      Maxlength={250}
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
                      showUpdate={!!rcds.ddoId}
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
          />
        </div>
      </div>
    </>
  );
};

export default DDOMaster;
