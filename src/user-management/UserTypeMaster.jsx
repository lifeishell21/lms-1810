import { useState, useEffect, useRef } from "react";
import "../styles/inputStyle.css";
import FormText from "../components/FormText";
import FormLabel from "../components/FormLabel";
import FormSelect from "../components/FormSelect";
import FormCheckbox from "../components/FormCheckbox";
import FormButton from "../components/FormButton";
import Cookies from "js-cookie";
import DynamicTable from "../components/DynamicTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/AdvancedSearch.css";
import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
import ErrorMessageABD from "../components/ErrorMessageABD";
import CreateUpdateBar from "../components/CreateUpdateBar";
import icon from "../properties/icon";
import SelectComponent from "../components/SelectComponent"



import {
    getDelete,
    getList,
    getSave,
    getUpdate,
    getViewRecord,
    getDropDown
} from "../utils/api";

const UserTypeMaster = () => {
    const [deleteCooldown, setDeleteCooldown] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorVisibleComponent, setErrorMessageVisibleComponent] =
    useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [errorType, setErrorType] = useState();
    const [errorMessages, setErrorMessages] = useState({
        userType: "",
        empCode: "",
        empName: "",
        fatherName: "",
        department: "",
        designation: "",
        email: "",
        isActive: "",
        college: "",
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
        userTypeId: "",
        userType: "",
        empCode: "",
        empName: "",
        fatherName: "",
        department: "",
        designation: "",
        email: "",
        isActive: "",
        // college: "",
        userId: "", // Initial value will be updated in useEffect
        publicIp: "", // Initial value will be updated in useEffect
        createdBy: "",
        modifiedBy: "",
    });

    const [userTypeRcds, setUserypeRcds] = useState([
        { value: "", label: "" },
    ])

    const [deptRcds, setDeptRcds] = useState([
        { value: "", label: "" },
    ])


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
        }))
    }, []);

    const saveButtonRef = useRef(null); // Reference for the Save button

    const [searchRcds, setSearchRcds] = useState({
        userType: "",
        empName: "",
        department: "",
        designation: "",
    });

    const [errorDivMessage, setErrorDivMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const secretKey = "12345";
    const { checkResponseStatus } = useCheckResponseStatus();

    const data = {
        uName: "Select User Type",
        uHolder: "Enter User Type",
        eCode: "Emp Code",
        eHolder: "Enter Employee Code",
        eName: "Employee Name",
        enHolder: "Enter Employee Name",
        fName: "Father Name",
        fHolder: "Enter Father Name",
        dName: "Department",
        dholder: "Select Department",
        dsName: "Desigination",
        dsholder: "Enter Desigination",
        emName: "Email",
        emHolder: "Enter Email",
        acName: "isActive",
        userType: "userType",
        empCode: "empCode",
        empName: "empName",
        fatherName: "fatherName",
        department: "department",
        designation: "designation",
        email: "email",
        isActive: "isActive",
        // college: "college",
        save: "Save",
        delete: "Delete",
        update: "Update",
        back: "Back",
        reset: "Reset",
    };
    const handleBack = () => {
        if (saveButtonRef.current) {
            saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Alternatively, clear form data and reset state if needed
        setRcds({
            userTypeId: "",
            userType: "",
            empCode: "",
            empName: "",
            fatherName: "",
            department: "",
            designation: "",
            email: "",
            isActive: "",
            college: "",
            userId: "",
        });

        setResponseMessage(""); // Clear any displayed messages
    };

    const handleReset = () => {
        // Reset rcds to its initial state
        setRcds({
            userTypeId: null,
            userType: "",
            empCode: "",
            empName: "",
            fatherName: "",
            department: "",
            designation: "",
            email: "",
            isActive: "",
            college: "",
        });

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
        if (!rcds.userType) errors.userType = "User Type is required";
        if (!rcds.empCode) errors.empCode = "Employee Code is required";
        if (!rcds.empName) errors.empName = "Employee Name is required";
        if (!rcds.fatherName) errors.fatherName = "Father Name is required";
        if (!rcds.department) errors.department = "Department is required";
        if (!rcds.designation) errors.designation = "Designation is required";
        if (!rcds.email) errors.email = "Email is required";
        //if (!rcds.isActive) errors.isActive = "isActive required";
        //if (!rcds.college) errors.college = "College is required";
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
        try {

            // Encrypt the updated rcds with the userId
            const ciphertext = encAESData(secretKey, updatedRcds);
            console.log("Encrypted Data: ", ciphertext);

            let responseData;

            if (rcds.userTypeId) {
                // Update the existing record
                const response = await getUpdate("user", "userTypeMaster", ciphertext);
                console.log("Update response from backend:", response.data);

                responseData = checkResponseStatus(response);
            } else {
                // Send data to the backend
                const response = await getSave("user", "userTypeMaster", ciphertext);
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

                    setTimeout(() => {
                        setErrorMessageVisibleComponent(false);
                        setErrorDivMessage("");
                    }, 5000);

                    // Clear the form fields by resetting rcds to its initial state
                    setRcds({
                        // Replace with your initial state for rcds
                        userTypeId: null,
                        userType: "",
                        empCode: "",
                        empName: "",
                        fatherName: "",
                        department: "",
                        designation: "",
                        email: "",
                        isActive: "",
                        userId: rcds.userId,
                        publicIp: rcds.publicIp,
                        //college: "",
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
            const ciphertext = encAESData(secretKey, searchRcds);
            // Send request to get the list
            const response = await getList("user", "userTypeMaster", ciphertext, {});

            console.log("Full response from backend: getList", response);
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

    const userTypeQuery = {
        table: "cparam",
        fields: "pdoc,descp1",
        condition: "1=1 and code='USER' and serial='USERTYPE' and PDOC NOT IN ('EM')",
        orderBy: "order by descp1",
    }

    const getDropDownData = async () => {
        try {
            //console.log(userTypeQuery);
            getDropDown(userTypeQuery, userTypeRcds, setUserypeRcds, "common", "12345");

        }
        catch {

        }
    }

    useEffect(() => {
        getDropDownData();
    }, []);

    const departmentQuery = {
        table: "department_mast",
        fields: "DEPT_ID, DEPARTMENT",
        condition: "1=1",
        orderBy: "order by DEPARTMENT",
    }

    const getDeptDropDownData = async () => {
        getDropDown(departmentQuery, deptRcds, setDeptRcds, "common", "12345");
    }

    useEffect(() => {
        getDeptDropDownData();
    }, []);

    const viewRecord = async (userTypeId) => {
        try {
            setErrorMessages("");
            const ciphertext = encAESData(secretKey, userTypeId);

            const response = await getViewRecord("user", "userTypeMaster", ciphertext);

            console.log("Full response from backend:", response);
            const responseData = checkResponseStatus(response);

            if (responseData.rData) {
                const recJson = JSON.parse(responseData.rData);
                const decryptedData = decAESData(secretKey, recJson);
                console.log("Decrypted Data:", decryptedData);

                const dataToSet = decryptedData.recData[0]; // Assuming you want the first item

                // Update rcds state with the decrypted data
                setRcds({
                    userTypeId: dataToSet.USER_TYPE_ID,
                    userType: dataToSet.USER_TYPE,                 
                    empCode: dataToSet.EMP_CODE,
                    empName: dataToSet.EMP_NAME,
                    fatherName: dataToSet.FATHER_NAME,
                    department: dataToSet.DEPARTMENT,
                    designation:dataToSet.DESIGNATION,
                    email: dataToSet.EMAIL,
                    isActive: dataToSet.IS_ACTIVE.toUpperCase() === "Y" ? "Y" : "N", // Adjust this based on your checkbox logic
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



    const handleDelete = async (userTypeId) => {
        setDeleteCooldown(true);
        setIsDeleting(true);
        let response;
        setLoading(true); // Start loading state
        if (!isEditing) {
            try {

                const ciphertext = encAESData(secretKey, userTypeId);

                // Send the delete request to the backend
                const response = await getDelete("user", "userTypeMaster", ciphertext, {});

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
                setIsDeleting(false);  // restart delete button

                // Set the cooldown
                setTimeout(() => {
                    setDeleteCooldown(false); // Reset the cooldown after 3 seconds
                }, 3000);
            }
        }
    };

    console.log("api data in table data:",apiData);
    const tableData = {
        headers: [
            "S. No.",
            "User Type",
            "Employee Detail",
            "Department",
            "desigination",
            "isActive",
            "Edit",
            "Delete",
        ],
       
        
        rows: apiData.map((item, sno) => ({
            id: sno + 1,
            one: item.userType,
            two: item.empDetail,
            three: item.DEPARTMENT,           
            four: item.DESIGNATION,
            five: item.is_active,
            six: (
                <span
                    className="manipulation-icon edit-color"
                    onClick={() => {
                        const id = { userTypeId: item.USER_TYPE_ID};
                        viewRecord(id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <FontAwesomeIcon icon={faEdit} />{" "}
                    <span className="manipulation-text"> Edit</span>
                </span>
            ),
            seven: (
                <span
                    className="manipulation-icon delete-color"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to delete this data?")) {
                            const id = { userTypeId: item.USER_TYPE_ID};
                            handleDelete(id);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />{" "}
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
                            <h4 className="card-title mb-3">User Type Master</h4>
                        </div>

                    </div>

                    <form action="" className="mb-5">
                        <div className="card">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-2">

                                        <FormLabel labelNames={data.uName} />
                                    </div>
                                    <div className="col-md-4">
                              <SelectComponent
                                   name="userType"
                               holder="Select User Type"
                               searchPlaceholder="Search User Type"
                              selectedValue={rcds.userType}  // Correct prop for selected value
                              options={userTypeRcds}
                                onSelects={(value) =>
                                setRcds((prevState) => ({
                                        ...prevState,
                               userType: value,  // Correct field update for userType
                                          }))
                      }
                           errorMessage={errorMessages.userType} // Pass the correct error message
                             icon={icon.arrowDown}
                            bdr="1px solid #ccc"
                                 padds="0"
                                      />
</div>


                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.eCode} />
                                    </div>
                                    <div className="col-md-4">
                                        <FormText
                                            name={data.empCode}
                                            holder={data.eHolder}
                                            value={rcds[data.empCode]}
                                            errorMessage={errorMessages.empCode} // Pass the error message for mappedAlias
                                            onChange={handleChange}
                                            icon={icon.default} // Example FontAwesome icon; change as needed
                                            bdr="1px solid #ccc" // Border style
                                            MaxLength = {10}
                                            padds="0px" // Padding for the select input
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.eName} />
                                    </div>
                                    <div className="col-md-4">
                                        <FormText
                                            name={data.empName}
                                            holder={data.enHolder}
                                            value={rcds[data.empName]}
                                            errorMessage={errorMessages.empName} // Pass the error message for mappedAlias
                                            onChange={handleChange}
                                            icon={icon.user} // Example FontAwesome icon; change as needed
                                            bdr="1px solid #ccc" // Border style
                                            MaxLength = {200}
                                            padds="0px" // Padding for the select input
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.fName} />
                                    </div>
                                    <div className="col-md-4">
                                        <FormText
                                            name={data.fatherName}
                                            holder={data.fHolder}
                                            value={rcds[data.fatherName]}
                                            errorMessage={errorMessages.fatherName} // Pass the error message for mappedAlias
                                            onChange={handleChange}
                                            icon="fas fa-user" // Example FontAwesome icon; change as needed
                                            bdr="1px solid #ccc" // Border style
                                            MaxLength = {200}
                                            padds="0px" // Padding for the select input
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.dName} />
                                    </div>
                                    <div className="col-md-4">


                                       <SelectComponent
                                        name="department"  // Use a consistent name
                                      holder="Select Department"  // Custom placeholder text
                                      searchPlaceholder="Search Department"  // Custom search placeholder
                                      selectedValue={rcds.department}  // Use selectedValue to match component
                                        options={deptRcds}  // Pass the department records
                                        onSelects={(value) =>
                                         setRcds((prevState) => ({
                                            ...prevState,
                                      department: value,  // Update the department field in state
                                                }))
                                               }
                                            errorMessage={errorMessages.department}  // Error handling
                                             icon={icon.default}  // Icon for display
                                            bdr="1px solid #ccc"  // Styling for the component
                                            padds="0"  // Padding for the select input
                                           />
                                               </div>




                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.dsName} />
                                    </div>
                                    <div className="col-md-4">
                                        <FormText
                                            name={data.designation}
                                            value={rcds[data.designation]}
                                            holder={data.dsholder}
                                            errorMessage={errorMessages.designation} // Pass the error message for roleLevel
                                            onChange={handleChange}
                                            icon={icon.default}  // Example icon (FontAwesome star icon)
                                            bdr="1px solid #ccc" // Border style
                                            MaxLength = {200}
                                            padds="0" // Padding for the select input
                                        />
                                    </div>
                                </div>



                                <div className="row mb-3">
                                    <div className="col-md-2">

                                        <FormLabel labelNames={data.emName} />
                                    </div>
                                    <div className="col-md-4">
                                        <FormText
                                            name={data.email}
                                            value={rcds[data.email]}
                                            holder={data.emName}
                                            errorMessage={errorMessages.email} // Pass the error message for roleLevel
                                            onChange={handleChange}
                                            icon={icon.envelope} // Example icon (FontAwesome star icon)
                                            bdr="1px solid #ccc" // Border style
                                            MaxLength = {100}
                                            padds="0" // Padding for the select input
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <FormLabel labelNames={data.acName} />
                                    </div>
                                    <div className="col-md-2">
                                        <FormCheckbox
                                            name="isActive"
                                            checked={rcds.isActive === "Y"} // Check if isAdmin is "Y" for checked
                                            onChange={(evt) => {
                                                if (evt && evt.target) {
                                                    const { checked } = evt.target; // Get the checked state
                                                    setRcds((prevState) => ({
                                                        ...prevState,
                                                        isActive: checked ? "Y" : "N", // Update isAdmin based on checked state
                                                    }));
                                                }
                                            }}
                                            label="Admin Access" // Label for better usability
                                            errorMessage={errorMessages.isActive} // Pass the error message if applicable
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
                                            showUpdate={!!rcds.userTypeId}
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

                                    <div class="col-sm-12">
                                        <div class="row ">
                                            <div class="errmessage1" id="errMsg1"></div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div class="row">
                                            <div class="errmessage2" id="errMsg2"></div>
                                        </div>
                                    </div>
                                </div>
                                <CreateUpdateBar preparedData={rcds.createdBy} modifiedData={rcds.modifiedBy} />
                            </div>
                    </form>
                    {loading && <div>Loading...</div>} {/* Loading indication */}
                    <DynamicTable data={tableData} />
                </div>
            </div>
        </>
    );
};

export default UserTypeMaster;







// import { useState, useEffect, useRef } from "react";
// import "../styles/inputStyle.css";
// import FormText from "../components/FormText";
// import FormLabel from "../components/FormLabel";
// import FormSelect from "../components/FormSelect";
// import FormCheckbox from "../components/FormCheckbox";
// import FormButton from "../components/FormButton";
// import Cookies from "js-cookie";
// import DynamicTable from "../components/DynamicTable";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import "../styles/AdvancedSearch.css";
// import useCheckResponseStatus from "../hooks/useCheckResponseStatus";
// import ErrorMessageABD from "../components/ErrorMessageABD";
// import CreateUpdateBar from "../components/CreateUpdateBar";
// import icon from "../properties/icon";



// import {
//     getDelete,
//     getList,
//     getSave,
//     getUpdate,
//     getViewRecord,
//     getDropDown
// } from "../utils/api";

// const UserTypeMaster = () => {
//     const [deleteCooldown, setDeleteCooldown] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [errorVisibleComponent, setErrorMessageVisibleComponent] =
//     useState(false);

//     const [isOpen, setIsOpen] = useState(false);
//     const [name, setName] = useState("");
//     const [errorType, setErrorType] = useState();
//     const [errorMessages, setErrorMessages] = useState({
//         userType: "",
//         empCode: "",
//         empName: "",
//         fatherName: "",
//         department: "",
//         designation: "",
//         email: "",
//         isActive: "",
//         college: "",
//     }); // handling error 


//     const toggleSearchBar = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleSearch = () => {
//         console.log("Search Term:", searchTerm);
//         console.log("Name:", name);
//     };

//     // changes 
//     const [rcds, setRcds] = useState({
//         userTypeId: "",
//         userType: "",
//         empCode: "",
//         empName: "",
//         fatherName: "",
//         department: "",
//         designation: "",
//         email: "",
//         isActive: "",
//         // college: "",
//         userId: "", // Initial value will be updated in useEffect
//         publicIp: "", // Initial value will be updated in useEffect
//         createdBy: "",
//         modifiedBy: "",
//     });

//     const [userTypeRcds, setUserypeRcds] = useState([
//         { value: "", label: "" },
//     ])

//     const [deptRcds, setDeptRcds] = useState([
//         { value: "", label: "" },
//     ])


//     const [s_userId, setS_UserId] = useState({
//         userId: "",
//         publicIp: "",
//     });

//     useEffect(() => {
//         const publicIp = Cookies.get("publicIp") || "";
//         const uDataCookie = Cookies.get("uData");
//         const uData = uDataCookie ? JSON.parse(uDataCookie) : {};
//         const userId = uData.userId || "NoUser";

//         setS_UserId(() => ({
//             userId: userId,
//             publicIp: publicIp,
//         }))
//     }, []);

//     const saveButtonRef = useRef(null); // Reference for the Save button

//     const [searchRcds, setSearchRcds] = useState({
//         userType: "",
//         empName: "",
//         department: "",
//         designation: "",
//     });

//     const [errorDivMessage, setErrorDivMessage] = useState("");
//     const [isEditing, setIsEditing] = useState(false);
//     const [apiData, setApiData] = useState([]);
//     const [responseMessage, setResponseMessage] = useState("");
//     const [loading, setLoading] = useState(false); // Loading state
//     const secretKey = "12345";
//     const { checkResponseStatus } = useCheckResponseStatus();

//     const data = {
//         uName: "Select User Type",
//         uHolder: "Enter User Type",
//         eCode: "Emp Code",
//         eHolder: "Enter Employee Code",
//         eName: "Employee Name",
//         enHolder: "Enter Employee Name",
//         fName: "Father Name",
//         fHolder: "Enter Father Name",
//         dName: "Department",
//         dholder: "Select Department",
//         dsName: "Desigination",
//         dsholder: "Enter Desigination",
//         emName: "Email",
//         emHolder: "Enter Email",
//         acName: "isActive",
//         userType: "userType",
//         empCode: "empCode",
//         empName: "empName",
//         fatherName: "fatherName",
//         department: "department",
//         designation: "designation",
//         email: "email",
//         isActive: "isActive",
//         // college: "college",
//         save: "Save",
//         delete: "Delete",
//         update: "Update",
//         back: "Back",
//         reset: "Reset",
//     };
//     const handleBack = () => {
//         if (saveButtonRef.current) {
//             saveButtonRef.current.scrollIntoView({ behavior: "smooth" });
//         }

//         // Alternatively, clear form data and reset state if needed
//         setRcds({
//             userTypeId: "",
//             userType: "",
//             empCode: "",
//             empName: "",
//             fatherName: "",
//             department: "",
//             designation: "",
//             email: "",
//             isActive: "",
//             college: "",
//             userId: "",
//         });

//         setResponseMessage(""); // Clear any displayed messages
//     };

//     const handleReset = () => {
//         // Reset rcds to its initial state
//         setRcds({
//             userTypeId: null,
//             userType: "",
//             empCode: "",
//             empName: "",
//             fatherName: "",
//             department: "",
//             designation: "",
//             email: "",
//             isActive: "",
//             college: "",
//         });

//         setErrorMessages("");
//     };

//     const handleChange = (evt) => {
//         const { name, value, type, checked } = evt.target;
//         setRcds((prevState) => ({
//             ...prevState,
//             [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
//         }));



//         // Remove the error for the current field while typing
//         setErrorMessages((prevErrors) => ({
//             ...prevErrors,
//             [name]: "", // Clear error message for the current field
//         }));

//     };


//     const validateFields = () => {
//         const errors = {};
//         if (!rcds.userType) errors.userType = "User Type is required";
//         if (!rcds.empCode) errors.empCode = "Employee Code is required";
//         if (!rcds.empName) errors.empName = "Employee Name is required";
//         if (!rcds.fatherName) errors.fatherName = "Father Name is required";
//         if (!rcds.department) errors.department = "Department is required";
//         if (!rcds.designation) errors.designation = "Designation is required";
//         if (!rcds.email) errors.email = "Email is required";
//         //if (!rcds.isActive) errors.isActive = "isActive required";
//         //if (!rcds.college) errors.college = "College is required";
//         return errors;
//     };


//     const handleCreate = async (evt) => {
//         let response;
//         evt.preventDefault(); // Prevent default form submission
//         setLoading(true); // Start loading state
//         setIsEditing(false);
//         const errors = validateFields();
//         if (Object.keys(errors).length > 0) {
//             setErrorMessages(errors);
//             setLoading(false);
//             return;
//         }

//         const updatedRcds = {
//             ...rcds,
//             userId: s_userId.userId, // Ensure userId is included
//             publicIp: s_userId.publicIp, // Ensure publicIp is included
//         };
//         try {

//             // Encrypt the updated rcds with the userId
//             const ciphertext = encAESData(secretKey, updatedRcds);
//             console.log("Encrypted Data: ", ciphertext);

//             let responseData;

//             if (rcds.userTypeId) {
//                 // Update the existing record
//                 const response = await getUpdate("user", "userTypeMaster", ciphertext);
//                 console.log("Update response from backend:", response.data);

//                 responseData = checkResponseStatus(response);
//             } else {
//                 // Send data to the backend
//                 const response = await getSave("user", "userTypeMaster", ciphertext);
//                 console.log("Response from backend:", response.data);
//                 responseData = checkResponseStatus(response);
//             }

//             if (responseData) {
//                 const jsonData = JSON.parse(responseData.rData);
//                 const decryptedData = decAESData(secretKey, jsonData);
//                 console.log("Decrypted Data:", decryptedData);

//                 // Check if the operation was successful
//                 if (responseData.rType === "Y") {
//                     setErrorMessageVisibleComponent(true);
//                     setErrorType(true);
//                     setErrorDivMessage(responseData.rMessage);

//                     setTimeout(() => {
//                         setErrorMessageVisibleComponent(false);
//                         setErrorDivMessage("");
//                     }, 5000);

//                     // Clear the form fields by resetting rcds to its initial state
//                     setRcds({
//                         // Replace with your initial state for rcds
//                         userTypeId: null,
//                         userType: "",
//                         empCode: "",
//                         empName: "",
//                         fatherName: "",
//                         department: "",
//                         designation: "",
//                         email: "",
//                         isActive: "",
//                         userId: rcds.userId,
//                         publicIp: rcds.publicIp,
//                         //college: "",
//                     });
//                 } else {
//                     setErrorMessageVisibleComponent(true);
//                     setErrorType(false);
//                     setErrorDivMessage(responseData.rMessage);
//                 }

//                 // Refresh the data list after saving
//                 getData();
//             }
//         } catch (error) {
//             console.error("Error during create/update:", error);
//             setErrorMessageVisibleComponent(true);
//             setErrorType(false);
//             setErrorDivMessage(response.data.rMessage);
//         } finally {
//             setLoading(false); // End loading state
//         }
//     };

//     const getData = async () => {

//         try {
//             const ciphertext = encAESData(secretKey, searchRcds);
//             // Send request to get the list
//             const response = await getList("user", "userTypeMaster", ciphertext, {});

//             console.log("Full response from backend: getList", response);
//             const responseData = checkResponseStatus(response);

//             console.log(responseData);

//             if (responseData.rData) {
//                 const jsonData = JSON.parse(responseData.rData);
//                 const decryptedData = decAESData(secretKey, jsonData);

//                 console.log("Decrypted Data:", decryptedData);

//                 // Update state with decrypted data
//                 setApiData(decryptedData.recData);
//                 setRecordCounts(decryptedData.recData[0].count);
//             } else {
//                 console.error("encryptData is undefined in the backend response.");
//             }

//             setResponseMessage(
//                 "Data sent successfully: " + JSON.stringify(responseData)
//             );
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setResponseMessage("Error fetching data: " + error.message);
//         }
//     };

//     useEffect(() => {
//         getData();
//     }, []);

//     const userTypeQuery = {
//         table: "cparam",
//         fields: "pdoc,descp1",
//         condition: "1=1 and code='USER' and serial='USERTYPE' and PDOC NOT IN ('EM')",
//         orderBy: "order by descp1",
//     }

//     const getDropDownData = async () => {
//         try {
//             //console.log(userTypeQuery);
//             getDropDown(userTypeQuery, userTypeRcds, setUserypeRcds, "common", "12345");

//         }
//         catch {

//         }
//     }

//     useEffect(() => {
//         getDropDownData();
//     }, []);

//     const departmentQuery = {
//         table: "department_mast",
//         fields: "DEPT_ID, DEPARTMENT",
//         condition: "1=1",
//         orderBy: "order by DEPARTMENT",
//     }

//     const getDeptDropDownData = async () => {
//         getDropDown(departmentQuery, deptRcds, setDeptRcds, "common", "12345");
//     }

//     useEffect(() => {
//         getDeptDropDownData();
//     }, []);

//     const viewRecord = async (userTypeId) => {
//         try {
//             setErrorMessages("");
//             const ciphertext = encAESData(secretKey, userTypeId);

//             const response = await getViewRecord("user", "userTypeMaster", ciphertext);

//             console.log("Full response from backend:", response);
//             const responseData = checkResponseStatus(response);

//             if (responseData.rData) {
//                 const recJson = JSON.parse(responseData.rData);
//                 const decryptedData = decAESData(secretKey, recJson);
//                 console.log("Decrypted Data:", decryptedData);

//                 const dataToSet = decryptedData.recData[0]; // Assuming you want the first item

//                 // Update rcds state with the decrypted data
//                 setRcds({
//                     userTypeId: dataToSet.USER_TYPE_ID,
//                     userType: dataToSet.USER_TYPE,                 
//                     empCode: dataToSet.EMP_CODE,
//                     empName: dataToSet.EMP_NAME,
//                     fatherName: dataToSet.FATHER_NAME,
//                     department: dataToSet.DEPARTMENT,
//                     designation:dataToSet.DESIGNATION,
//                     email: dataToSet.EMAIL,
//                     isActive: dataToSet.IS_ACTIVE.toUpperCase() === "Y" ? "Y" : "N", // Adjust this based on your checkbox logic
//                     createdBy: dataToSet.createdBy,
//                     modifiedBy: dataToSet.modifiedBy,
//                     userId: s_userId.userId, // Use userId from s_userId
//                     publicIp: s_userId.publicIp, // Use publicIp from s_userId
//                 });
               
//                 setIsEditing(true);
//             } else {
//                 console.error("encryptData is undefined in the backend response.");
//             }

//             setResponseMessage(
//                 "Data retrieved successfully: " + JSON.stringify(responseData)
//             );
//         } catch (error) {
//             console.error("Error retrieving data:", error);
//             setResponseMessage("Error retrieving data: " + error.message);
//         }
//     };



//     const handleDelete = async (userTypeId) => {
//         setDeleteCooldown(true);
//         setIsDeleting(true);
//         let response;
//         setLoading(true); // Start loading state
//         if (!isEditing) {
//             try {

//                 const ciphertext = encAESData(secretKey, userTypeId);

//                 // Send the delete request to the backend
//                 const response = await getDelete("user", "userTypeMaster", ciphertext, {});

//                 console.log("Delete response from backend:", response.data);
//                 const responseData = checkResponseStatus(response);

//                 if (responseData.rData) {
//                     const jsonData = JSON.parse(responseData.rData);
//                     const decryptedData = decAESData(secretKey, jsonData);
//                     console.log("Decrypted Data:", decryptedData);
//                 } else {
//                     console.error("encryptData is undefined in the backend response.");
//                 }

//                 // Refresh the data after deletion
//                 getData(); // Refresh the table data
//                 if (responseData.rType === "Y") {
//                     setErrorMessageVisibleComponent(true);
//                     setErrorType(true);
//                     setErrorDivMessage(response.data.rMessage);
//                 } else {
//                     setErrorMessageVisibleComponent(true);
//                     setErrorType(false);
//                     setErrorDivMessage(response.data.rMessage);
//                 }
//             } catch (error) {
//                 console.error("Error deleting data:", error);
//                 setErrorMessageVisibleComponent(true);
//                 setErrorType(false);
//                 setErrorDivMessage(response.data.rMessage);
//             } finally {
//                 setLoading(false); // End loading state
//                 setIsDeleting(false);  // restart delete button

//                 // Set the cooldown
//                 setTimeout(() => {
//                     setDeleteCooldown(false); // Reset the cooldown after 3 seconds
//                 }, 3000);
//             }
//         }
//     };

//     console.log("api data in table data:",apiData);
//     const tableData = {
//         headers: [
//             "S. No.",
//             "User Type",
//             "Employee Detail",
//             "Department",
//             "desigination",
//             "isActive",
//             "Edit",
//             "Delete",
//         ],
       
        
//         rows: apiData.map((item, sno) => ({
//             id: sno + 1,
//             one: item.userType,
//             two: item.empDetail,
//             three: item.DEPARTMENT,           
//             four: item.DESIGNATION,
//             five: item.is_active,
//             six: (
//                 <span
//                     className="manipulation-icon edit-color"
//                     onClick={() => {
//                         const id = { userTypeId: item.USER_TYPE_ID};
//                         viewRecord(id);
//                         window.scrollTo({ top: 0, behavior: "smooth" });
//                     }}
//                 >
//                     <FontAwesomeIcon icon={faEdit} />{" "}
//                     <span className="manipulation-text"> Edit</span>
//                 </span>
//             ),
//             seven: (
//                 <span
//                     className="manipulation-icon delete-color"
//                     onClick={() => {
//                         if (window.confirm("Are you sure you want to delete this data?")) {
//                             const id = { userTypeId: item.USER_TYPE_ID};
//                             handleDelete(id);
//                         }
//                     }}
//                 >
//                     <FontAwesomeIcon icon={faTrash} />{" "}
//                     <span className="manipulation-text"> Delete</span>
//                 </span>
//             ),
//         })),
//     };

//     return (
//         <>
//             <div className="rightArea">
//                 <div className="container-body">
//                     <div className="row mb-3">
//                         <div className="col-6">
//                             <h4 className="card-title mb-3">User Type Master</h4>
//                         </div>

//                     </div>

//                     <form action="" className="mb-5">
//                         <div className="card">
//                             <div className="card-body">
//                                 <div className="row mb-3">
//                                     <div className="col-md-2">

//                                         <FormLabel labelNames={data.uName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormSelect
//                                             name="userType"
//                                             value={rcds.userType}
//                                             options={userTypeRcds}
//                                             errorMessage={errorMessages.userType} // Pass the error message for roleLevel
//                                             onChange={handleChange}
//                                             icon={icon.arrowDown} // Example icon (FontAwesome star icon)
//                                             bdr="1px solid #ccc" // Border style
//                                             padds="0" // Padding for the select input
//                                       />
//                                     </div>

//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.eCode} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormText
//                                             name={data.empCode}
//                                             holder={data.eHolder}
//                                             value={rcds[data.empCode]}
//                                             errorMessage={errorMessages.empCode} // Pass the error message for mappedAlias
//                                             onChange={handleChange}
//                                             icon={icon.default} // Example FontAwesome icon; change as needed
//                                             bdr="1px solid #ccc" // Border style
//                                             MaxLength = {10}
//                                             padds="0px" // Padding for the select input
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.eName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormText
//                                             name={data.empName}
//                                             holder={data.enHolder}
//                                             value={rcds[data.empName]}
//                                             errorMessage={errorMessages.empName} // Pass the error message for mappedAlias
//                                             onChange={handleChange}
//                                             icon={icon.user} // Example FontAwesome icon; change as needed
//                                             bdr="1px solid #ccc" // Border style
//                                             MaxLength = {200}
//                                             padds="0px" // Padding for the select input
//                                         />
//                                     </div>

//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.fName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormText
//                                             name={data.fatherName}
//                                             holder={data.fHolder}
//                                             value={rcds[data.fatherName]}
//                                             errorMessage={errorMessages.fatherName} // Pass the error message for mappedAlias
//                                             onChange={handleChange}
//                                             icon="fas fa-user" // Example FontAwesome icon; change as needed
//                                             bdr="1px solid #ccc" // Border style
//                                             MaxLength = {200}
//                                             padds="0px" // Padding for the select input
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.dName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormSelect
//                                             name={data.department}
//                                             value={rcds[data.department]}
//                                             options={deptRcds}
//                                             errorMessage={errorMessages.department} // Pass the error message for roleLevel
//                                             onChange={handleChange}
//                                             icon={icon.default} // Example icon (FontAwesome star icon)
//                                             bdr="1px solid #ccc" // Border style
//                                             padds="0" // Padding for the select input
//                                         />
//                                     </div>



//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.dsName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormText
//                                             name={data.designation}
//                                             value={rcds[data.designation]}
//                                             holder={data.dsholder}
//                                             errorMessage={errorMessages.designation} // Pass the error message for roleLevel
//                                             onChange={handleChange}
//                                             icon={icon.default}  // Example icon (FontAwesome star icon)
//                                             bdr="1px solid #ccc" // Border style
//                                             MaxLength = {200}
//                                             padds="0" // Padding for the select input
//                                         />
//                                     </div>
//                                 </div>



//                                 <div className="row mb-3">
//                                     <div className="col-md-2">

//                                         <FormLabel labelNames={data.emName} />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <FormText
//                                             name={data.email}
//                                             value={rcds[data.email]}
//                                             holder={data.emName}
//                                             errorMessage={errorMessages.email} // Pass the error message for roleLevel
//                                             onChange={handleChange}
//                                             icon={icon.envelope} // Example icon (FontAwesome star icon)
//                                             bdr="1px solid #ccc" // Border style
//                                             MaxLength = {100}
//                                             padds="0" // Padding for the select input
//                                         />
//                                     </div>

//                                     <div className="col-md-2">
//                                         <FormLabel labelNames={data.acName} />
//                                     </div>
//                                     <div className="col-md-2">
//                                         <FormCheckbox
//                                             name="isActive"
//                                             checked={rcds.isActive === "Y"} // Check if isAdmin is "Y" for checked
//                                             onChange={(evt) => {
//                                                 if (evt && evt.target) {
//                                                     const { checked } = evt.target; // Get the checked state
//                                                     setRcds((prevState) => ({
//                                                         ...prevState,
//                                                         isActive: checked ? "Y" : "N", // Update isAdmin based on checked state
//                                                     }));
//                                                 }
//                                             }}
//                                             label="Admin Access" // Label for better usability
//                                             errorMessage={errorMessages.isActive} // Pass the error message if applicable
//                                         />
//                                     </div>
//                                 </div>


//                                 <div className="row">
//                                     <div className="col-md-12">
//                                         <FormButton
//                                             btnType1={data.save}
//                                             btnType3={data.update}
//                                             btnType4={data.back}
//                                             btnType5={data.reset}
//                                             onClick={handleCreate}
//                                             onBack={handleBack}
//                                             onReset={handleReset}
//                                             showUpdate={!!rcds.userTypeId}
//                                             rcds={rcds}
//                                             loading={loading}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="d-flex justify-content-center align-items-center">
//                                     <ErrorMessageABD
//                                         text={errorDivMessage}
//                                         isSuccess={errorType}
//                                         isVisible={errorVisibleComponent}
//                                         setVisible={setErrorMessageVisibleComponent} // Pass the function to reset visibility
//                                     />
//                                     </div>

//                                     <div class="col-sm-12">
//                                         <div class="row ">
//                                             <div class="errmessage1" id="errMsg1"></div>
//                                         </div>
//                                     </div>
//                                     <div class="col-sm-12">
//                                         <div class="row">
//                                             <div class="errmessage2" id="errMsg2"></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <CreateUpdateBar preparedData={rcds.createdBy} modifiedData={rcds.modifiedBy} />
//                             </div>
//                     </form>
//                     {loading && <div>Loading...</div>} {/* Loading indication */}
//                     <DynamicTable data={tableData} />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default UserTypeMaster;
