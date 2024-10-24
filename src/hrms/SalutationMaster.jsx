import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import {
  getDelete,
  getList,
  getSave,
  getUpdate,
  getViewRecord,
  getRecordByCount,
} from "../utils/api";
import DynamicTable from "../components/DynamicTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormText from "../components/FormText";
import FormLabel from "../components/FormLabel";
import "../styles/AdvancedSearch.css";
import FormButton from "../components/FormButton";
import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
import icon from "../properties/icon";
import FormTextarea from "../components/FormTextarea";
import ErrorMessageABD from "../components/ErrorMessageABD";
import CreateUpdateBar from "../components/CreateUpdateBar";

const SalutationMaster = () => {
  const [rcds, setRcds] = useState({
    salutation: "",
    remarks: "",
    sal_id: "",
    createdBy: "",
    modifiedBy: "",
    userId: "", // Initial value will be updated in useEffect
    publicIp: "", // Initial value will be updated in useEffect
  });

  const data = {
    sname: "Salutation",
    sHolder: "Enter Salutation",
    sal: "salutation",
    rname: "Remark",
    rHolder: "Enter Remark",
    rem: "remarks",
    save: "Save",
    delete: "Delete",
    update: "Update",
    back: "Back",
    reset: "Reset",
  };

  const [searchRcds, setSearchRcds] = useState({
    salutation: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // const [recordCounts, setRecordCounts] = useState(0);
  // const [currectRecordCounts, setCurrentRecordCounts] = useState(0);
  // const [countFlag, setCountFlag] = useState(false);

  //Added for disable delete buttotn.......
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteCooldown, setDeleteCooldown] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const secretKey = "12345";
  const [errorMessages, setErrorMessages] = useState({
    salutation: "",
  });

  const [errorVisibleComponent, setErrorMessageVisibleComponent] =
    useState(false);
  const [errorType, setErrorType] = useState();
  const [errorDivMessage, setErrorDivMessage] = useState("");

  const { checkResponseStatus } = useCheckResponseStatus();
  const saveButtonRef = useRef(null);

  // Handle back action
  const handleBack = () => {
    if (saveButtonRef.current) {
      saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setRcds({
      salutation: "",
      remarks: "",
      sal_id: "",
      userId: "",
      publicIp: "",
    });
    setIsEditing(false);
  };

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

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setRcds((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message for the current field
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!rcds.salutation) errors.salutation = "Salutation is required";
    return errors;
  };

  const handleReset = () => {
    setRcds({
      salutation: "",
      remarks: "",
      sal_id: rcds.sal_id,
    });
    setErrorMessages("");
  };


  const handleCreate = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setIsEditing(false);
    const errors = validateFields();
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

    try {
      const ciphertext = encAESData(secretKey, updatedRcds);
      let responseData;

      if (rcds.sal_id) {
        console.log("Data being sent:", updatedRcds); // Log the data to be sent
        // Update case
        const response = await getUpdate(
          "hrms",
          "salutationMaster",
          ciphertext
        );
        responseData = checkResponseStatus(response);
      } else {
        // Save case
        const response = await getSave("hrms", "salutationMaster", ciphertext);
        responseData = checkResponseStatus(response);
      }

      if (responseData) {
        const jsonData = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, jsonData);

        if (responseData.rType === "Y") {
          setRcds({
            salutation: "",
            remarks: "",
            sal_id: null,
            userId: rcds.userId,
            publicIp: rcds.publicIp,
          });
          setErrorType(true);
          setLoading(false);
        } else {
          setErrorType(false);
          setLoading(false);
        }
        setErrorDivMessage(responseData.rMessage);
        setErrorMessageVisibleComponent(true); // Show the message

        // Automatically hide the message after it has been shown
        setTimeout(() => {
          setErrorMessageVisibleComponent(false);
          setErrorDivMessage("");
        }, 5000); // Adjust time as needed
        getData();
      }
    } catch (error) {
      setErrorType(false);
      setErrorDivMessage(error.message || "An error occurred");
      setErrorMessageVisibleComponent(true);
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    try {
      const ciphertext = encAESData(secretKey, searchRcds);
      const response = await getList(
        "hrms",
        "salutationMaster",
        ciphertext,
        {}
      );
      const responseData = response.data;
      if (responseData.rData) {
        const jsonData = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, jsonData);
        console.log(decryptedData);
        setApiData(decryptedData.recData);
        setRecordCounts(decryptedData.recData[0].count);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    setDeleteCooldown(true);
    setLoading(true); // Start loading state
    setIsDeleting(true); //disable delete button
    if (!isEditing) {
      try {
        const ciphertext = encAESData(secretKey, id);
        const response = await getDelete(
          "hrms",
          "salutationMaster",
          ciphertext,
          {}
        );
        if (response.data.rType === "Y") {
          setErrorType(true);
          setErrorDivMessage(response.data.rMessage);
        } else {
          setErrorType(false);
          setErrorDivMessage(response.data.rMessage);
        }
        setErrorMessageVisibleComponent(true);
        getData();
      } catch (error) {
        console.error("Error deleting data:", error);
        setErrorType(false);
        setErrorDivMessage("Error deleting data.");
        setErrorMessageVisibleComponent(true);
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

  const viewRecord = async (id) => {
    setErrorMessages("");
    try {
      const ciphertext = encAESData(secretKey, id);
      const response = await getViewRecord("hrms", "salutationMaster", ciphertext);
      const responseData = response.data;
  
      if (responseData.rData) {
        const recJson = JSON.parse(responseData.rData);
        const decryptedData = decAESData(secretKey, recJson);
        const dataToSet = decryptedData.recData[0];
  
        setRcds({
          sal_id: dataToSet.sal_id,
          salutation: dataToSet.salutation,
          remarks: dataToSet.remarks,
          userId: s_userId.userId, // Set userId here
          publicIp: s_userId.publicIp, // Set publicIp here
          createdBy: dataToSet.createdBy,
          modifiedBy: dataToSet.modifiedBy,
        });
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
  //     const response = await getRecordByCount(
  //       "hrms",
  //       "salutationMaster",
  //       ciphertext
  //     );
  //     const responseData = response.data;

  //     if (responseData.rData) {
  //       const recJson = JSON.parse(responseData.rData);
  //       const decryptedData = decAESData(secretKey, recJson);
  //       console.log(decryptedData, "-------getCountrecord");

  //       const dataToSet = decryptedData.recData[0];
  //       setRcds((prevRcds) => ({
  //         ...prevRcds,
  //         sal_id: dataToSet.sal_id,
  //         salutation: dataToSet.salutation,
  //         remarks: dataToSet.remarks,
  //         createdBy: dataToSet.createdBy,
  //         modifiedBy: dataToSet.modifiedBy,
  //       }));
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
    headers: ["S.No", "Salutation", "Remarks", "Edit", "Delete"],
    rows: apiData.map((item, sno) => ({
      id: sno + 1,
      one: item.salutation,
      two: item.remarks,
      three: (
        <span
          className="manipulation-icon edit-color"
          onClick={() => {
            const id = { sal_id: item.sal_id };
            viewRecord(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FontAwesomeIcon icon={faEdit} />{" "}
          <span className="manipulation-text"> Edit</span>
        </span>
      ),
      four: !isEditing && (
        <span
          className={`manipulation-icon delete-color ${
            deleteCooldown ? "disabled" : ""
          }`}
          onClick={() => {
            if (!deleteCooldown) {
              // Prevent action during cooldown
              const id = { sal_id: item.sal_id };
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
    <div className="rightArea">
      <div className="container-body">
        <div className="row mb-3">
          <div className="col-6">
            <h4 className="card-title mb-3">Salutation Master</h4>
          </div>
          <div className="col-6 d-flex justify-content-end"></div>
          <form action="" className="mb-5">
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-2">
                    <FormLabel labelNames={data.sname} />
                  </div>
                  <div className="col-md-4">
                    <FormText
                      name={data.sal}
                      holder={data.sHolder}
                      value={rcds[data.sal]}
                      errorMessage={errorMessages.salutation}
                      onChange={handleChange}
                      icon={icon.user}
                      Maxlength={25}
                    />
                  </div>
                </div>
                <div className="row mb-8">
                  <div className="col-md-2">
                    <FormLabel labelNames={data.rname} />
                  </div>
                  <div className="col-md-4">
                    <FormTextarea
                      holder={data.rHolder}
                      name={data.rem}
                      value={rcds[data.rem]}
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
                      showUpdate={!!rcds.sal_id}
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
          {loading && <div>Loading...</div>}
          <DynamicTable
            data={tableData}
          />
        </div>
      </div>
    </div>
  );
};

export default SalutationMaster;
