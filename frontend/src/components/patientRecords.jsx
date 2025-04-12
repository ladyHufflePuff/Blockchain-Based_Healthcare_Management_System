import { useState, useEffect } from "react"

import { usePatient } from "../pages/patientPortal";
import { handleViewDocument } from "../services/authService";

const Record = () => {
    const { patientRecord,setPatientRecord, user } = usePatient();
    const [activeTab, setActiveTab] = useState("reports");
    const [records, setRecords] = useState([]);
    const [results, setResults] = useState([]);
    const [invoives, setInvoices] = useState([]);


    useEffect(() =>{

      if (patientRecord?.healthReports) {
        setRecords(patientRecord.healthReports);
      }
      if (patientRecord?.testResults) {
        setResults(patientRecord.testResults);
      }
      if (patientRecord?.billing) {
        setInvoices(patientRecord.billing);
      }
    },[patientRecord])

    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

    return (
      <div>
        <div className="tabs">
            <button className={`tab ${activeTab === "reports" ? "active" : ""}`} 
          onClick={() => handleTabChange("reports")}>Health Reports</button>
            <button className={`tab ${activeTab === "results" ? "active" : ""}`} 
          onClick={() => handleTabChange("results")}>Test Results</button>
            <button className={`tab ${activeTab === "statements" ? "active" : ""}`} 
          onClick={() => handleTabChange("statements")}>Billing Statements</button>
        </div>

        <div>
          {activeTab === "reports" && [...records].reverse().map((record) => (
            <div className="dashboard-card">
              <span role="button" onClick={() => handleViewDocument(user?.identity.did, record.file)}>
                📄 
              </span>
              <span> {(record.filename)}</span>
            </div>
          ))}

          {activeTab === "results" && [...results].reverse().map((result) => (
            <div className="dashboard-card">
              <span role="button" onClick={() => handleViewDocument(user?.identity.did, result.file)}>
                📄 
              </span>
              <span> {(result.filename)}</span>
            </div>
          ))}

          {activeTab === "statements" && [...invoives].reverse().map((invoice) => (
            <div className="dashboard-card">
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
  
  export default Record
  