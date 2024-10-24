import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/DynamicDataTable.css'; // Import the CSS file

const DynamicDataTable = ({ apiEndpoint, columns }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
  
    // Fetch data from the API
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(apiEndpoint);
          setData(response.data);
          setFilteredData(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchData();
    }, [apiEndpoint]);
  
    // Search filter function
    useEffect(() => {
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        setFilteredData(
          data.filter(row =>
            Object.values(row).some(val =>
              String(val).toLowerCase().includes(lowerCaseSearchTerm)
            )
          )
        );
      } else {
        setFilteredData(data);
      }
    }, [searchTerm, data]);
  
    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
    // Highlight searched text
    const highlightText = (text, searchTerm) => {
      if (!searchTerm) return text;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return text.split(regex).map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="highlight">{part}</span>
        ) : (
          part
        )
      );
    };
  
    // Export functions
    const exportCSV = () => {
      const csvData = [columns.map(col => col.Header)];
      filteredData.forEach(row => {
        csvData.push(columns.map(col => row[col.accessor]));
      });
      const worksheet = XLSX.utils.aoa_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, 'data_export.csv');
    };
  
    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, 'data_export.xlsx');
    };
  
    const exportPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [columns.map(col => col.Header)],
        body: filteredData.map(row => columns.map(col => row[col.accessor])),
      });
      doc.save('data_export.pdf');
    };
  
    if (loading) {
      return <p>Loading data...</p>;
    }
  
    if (error) {
      return <p>Error loading data: {error}</p>;
    }

    
  
    return (
      <div className="datatable-container">
        <div className="datatable-header">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
  
          {/* Export Buttons */}
          <div className="export-buttons">
            <button onClick={exportCSV} className="export-btn">
              <i className="fas fa-file-csv"></i> CSV
            </button>
            <button onClick={exportExcel} className="export-btn">
              <i className="fas fa-file-excel"></i> Excel
            </button>
            <button onClick={exportPDF} className="export-btn">
              <i className="fas fa-file-pdf"></i> PDF
            </button>
          </div>
        </div>
  
        {/* Table */}
        <table className="datatable">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.accessor}>
                    {highlightText(String(row[column.accessor]), searchTerm)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default DynamicDataTable;
  