import React from "react";
import Cookies from "js-cookie";
import "../styles//Dashboard.css";
import QuickLinks from "../components/QuickLinks";
import BreadCrumb from "../components/BreadCrumb";
import DashboardCard from "../components/DashboardCard";
import Charts from "../components/Charts";
import PieCharts from "../components/PieCharts";
import DynamicDataTable from "../components/DynamicDataTable";
// import SelectComponent from "../components/SelectComponent";

//

const Dashboard = () => {
  // Retrieve uData from cookies
  const uDataCookie = Cookies.get("uData");

  // Parse uData, defaulting to an empty object if not found
  const uData = uDataCookie ? JSON.parse(uDataCookie) : {};

  // Extract userId from uData
  const userId = uData.userId || "No User ID found.";

  const userColumns = [
    { Header: "User ID", accessor: "userId" },
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Body", accessor: "body" },
  ];

  return (
    <div className="rightArea">

      <div className="dashboard-container">
        {/* <p>User ID: {userId}</p> */}

      {/* <SelectComponent/> */}
        <BreadCrumb />
        <QuickLinks />

        <DashboardCard />

        <div className="row mt-3">
          <div className="col-md-8 p-2">
            <div className="card shadow border-0">
              <Charts />
            </div>
          </div>

          <div className="col-md-4 p-2">
            <div className="card shadow border-0">
              <PieCharts />
            </div>
          </div>
        </div>

        {/* <Datatable /> */}

        <DynamicDataTable
          apiEndpoint="https://jsonplaceholder.typicode.com/posts"
          columns={userColumns}
        />

      </div>
    </div>
  );
};

export default Dashboard;
