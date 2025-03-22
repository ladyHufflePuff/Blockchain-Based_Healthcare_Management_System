import React, { useState, useEffect } from "react";

import { FaEdit, FaTrash} from "react-icons/fa";


const TestResultSection = () => {
    const [testResults, setTestResults] = useState([
        { date: "2025-03-18", doctor: "Dr. Smith", fileName: "Blood Test - March 2025", file: "test1.pdf" },
        { date: "2025-02-25", doctor: "Dr. Adams", fileName: "MRI Scan - Feb 2025", file: "test2.pdf" },
      ]);
    
  const [testName, setTestName] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

  // Function to format the date (YYYY-MM-DD -> "19 February 2025")
  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const [year, month, day] = dateString.split("-"); // Split "2025-03-19" into parts
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && testName.trim() !== "") {
      const formattedDate = formatDate(today); // Format the date properly

      const newResult = {
        date: today,
        doctor: "Dr. JohnPaul", // Hardcoded for now
        fileName: `${testName} - ${formattedDate}`,
        file: URL.createObjectURL(file), // Temporary URL for viewing
      };

      setTestResults([newResult, ...testResults]);
      setTestName(""); // Clear input field after upload
    }
  };

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
        <input
            type="text"
            placeholder="Enter test result name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="test-name-input"
          />
          <label className="upload-label">
            <FaEdit /> Upload Test Result
            <input type="file" accept="application/pdf" onChange={handleFileUpload} hidden disabled={!testName.trim()} />
          </label>
        </div>
        
      </div>

      {/* Test Results List */}
      {testResults.length > 0 ? (
        <div className="test-results-list">
          {testResults.map((result, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span>{result.fileName}</span>
                <span>Uploaded by: {result.doctor}</span>
                <button className="expand-prescription" onClick={() => window.open(result.file, "_blank")}>View</button>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <p>No test results available.</p>
      )}
      
    </div>
  );
};

export default TestResultSection;
