import { useState } from "react"

const Record = () => {
    const [activeTab, setActiveTab] = useState("reports");

    const records = [
        {date: "31-12-2024"},
        {date: "30-06-2024",},
      ];

      const results = [
        {date: "12-01-2025", name: "Colonoscopy  Results"},
        {date: "28-11-2024", name: "Fecal Occult Blood Test"},
      ];

      const statements = [
        {name: "Invoice #12345", status: "Paid",
        },
        {name: "Invoice #67890", status: "Pending"},
      ];
    
    const formatDate = (dateString) => {
        const months = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ];
      
        const [day, month, year] = dateString.split("-"); // Split "31-12-2024" into parts
        return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    };
   
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

    const openPDF = (filePath) => {
      window.open(filePath, "_blank"); // Opens the PDF in a new tab
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
          {activeTab === "reports" && records.map((record) => (
            <div className="dashboard-card">
              <span role="button" onClick={() => openPDF(`/First Draft.pdf`)}>
                📄 
              </span>
              <span>Generated {formatDate(record.date)}</span>
            </div>
          ))}

          {activeTab === "results" && results.map((result) => (
            <div className="dashboard-card">
              <span role="button" onClick={() => openPDF(`/First Draft.pdf`)}>
                📄 
              </span>
              <span>{result.name} - {formatDate(result.date)}</span>
            </div>
          ))}

          {activeTab === "statements" && statements.map((statement) => (
            <div className="dashboard-card">
              <span role="button" onClick={() => openPDF(`/First Draft.pdf`)}>
                📄 
              </span>
              <span>{statement.name}</span>
              <span className="button-item">
                <span className={`status-badge ${statement.status.toLowerCase()}`}>
                {statement.status}
              </span>
              </span>
              
            </div>
          ))}
        </div>
    </div>
    );
  };
  
  export default Record
  