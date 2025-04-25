import React, { useState, useEffect } from "react";
import { FaEdit, FaFilePdf } from "react-icons/fa";

import { handleTestResultUpload, handleViewDocument } from "../client";

const TestResultSection = ({ patientData, patient, user, setPatientData }) => {
  const [testResults, setTestResults] = useState([]);
  const [testName, setTestName] = useState("");
  const today = new Date().toISOString().split("T")[0]; 

  // Sync local state with updated patient data
  useEffect(() => {
    setTestResults(patientData.testResults);
  }, [patientData]);

  // Handles PDF upload and triggers backend upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !testName.trim()) return;

    const filename = `${testName} [${today}]`;
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Pdf = reader.result;
      await handleTestResultUpload(user, patient, base64Pdf, filename, setPatientData);
      setTestName(""); // Reset input after successful upload
    };

    reader.onerror = (err) => console.error("File read error:", err);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          {/* Test name input */}
          <input
            type="text"
            placeholder="Enter test result name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="test-name-input"
          />

          {/* Upload button (disabled without test name) */}
          <label className="upload-label">
            <FaEdit /> Upload Test Result
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileUpload} 
              hidden 
              disabled={!testName.trim()} 
            />
          </label>
        </div>
      </div>

      {/* Test Results List */}
      {testResults.length > 0 ? (
        <div className="test-results-list">
          {[...testResults].reverse().map((result, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span>{result.filename}</span>
                <span>Uploaded by: {result.uploadedBy}</span>
                <button 
                  className="expand-prescription back-btn" 
                  onClick={() => handleViewDocument(patient, result.file)}
                >
                  <FaFilePdf /> View
                </button>
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
