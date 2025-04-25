import { useState, useEffect } from "react";

import { usePatient } from "../../pages/patientPortal";
import { handleViewDocument } from "../../client";

const Record = () => {
  // Access patient data and identity from context
  const { patientRecord, setPatientRecord, user } = usePatient();

  // Track the currently active tab
  const [activeTab, setActiveTab] = useState("reports");

  // Store different categories of patient documents
  const [records, setRecords] = useState([]);
  const [results, setResults] = useState([]);
  const [invoives, setInvoices] = useState([]);

  // Populate local state from patient record on load or update
  useEffect(() => {
    if (patientRecord?.healthReports) {
      setRecords(patientRecord.healthReports);
    }
    if (patientRecord?.testResults) {
      setResults(patientRecord.testResults);
    }
    if (patientRecord?.billing) {
      setInvoices(patientRecord.billing);
    }
  }, [patientRecord]);

  // Switch between tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab buttons for toggling views */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => handleTabChange("reports")}
        >
          Health Reports
        </button>
        <button
          className={`tab ${activeTab === "results" ? "active" : ""}`}
          onClick={() => handleTabChange("results")}
        >
          Test Results
        </button>
        <button
          className={`tab ${activeTab === "statements" ? "active" : ""}`}
          onClick={() => handleTabChange("statements")}
        >
          Billing Statements
        </button>
      </div>

      {/* Conditionally render documents based on active tab */}
      <div>
        {activeTab === "reports" &&
          [...records].reverse().map((record) => (
            <div className="dashboard-card" key={record.filename}>
              <span role="button" onClick={() => handleViewDocument(user?.identity.did, record.file)}>
                📄
              </span>
              <span>{record.filename}</span>
            </div>
          ))}

        {activeTab === "results" &&
          [...results].reverse().map((result) => (
            <div className="dashboard-card" key={result.filename}>
              <span role="button" onClick={() => handleViewDocument(user?.identity.did, result.file)}>
                📄
              </span>
              <span>{result.filename}</span>
            </div>
          ))}

        {activeTab === "statements" &&
          [...invoives].reverse().map((invoice) => (
            <div className="dashboard-card" key={invoice.filename}>
              <span role="button" onClick={() => handleViewDocument(user?.identity.did, invoice.file)}>
                📄
              </span>
              <span>{invoice.filename}</span>
              <span className="button-item">
                <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                  {invoice.status}
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Record;
