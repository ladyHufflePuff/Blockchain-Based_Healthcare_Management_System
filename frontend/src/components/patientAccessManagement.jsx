import { useState } from "react";

const AccessManagement = () => {
    const [activeTab, setActiveTab] = useState("current");

    const currentAccess = [
        {
          provider: "Dr Patel Yushra",
          dateGranted: "11-01-25",
        },
    ];
    
      // Data for access history
    const accessHistory = [
        {
          provider: "Dr Mark Sashimi",
          dateGranted: "20-11-24",
          dateRevoked: "02-12-24",
        },
    ];
   
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

    return (
      <div>
        <div className="tabs">
            <button className={`tab ${activeTab === "current" ? "active" : ""}`} 
          onClick={() => handleTabChange("current")}>Current Access</button>
            <button className={`tab ${activeTab === "history" ? "active" : ""}`} 
          onClick={() => handleTabChange("history")}>Access History</button>
        </div>

        {activeTab === "current" && (
        <div>
          <div className="item-header">
            <span className="provider-col">Provider</span>
            <span className="date-col">Date Granted</span>
            <span className="action-col"></span>
          </div>
          {currentAccess.map((access, index) => (
            <div className="dashboard-card">
                <div className="card-header">
                    <span className="provider-col">{access.provider}</span>
                    <span className="date-col">{access.dateGranted}</span>
                    <span className="button-item">
                        <button className="revoke-btn">Revoke</button>
                    </span>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* Access History Tab Content */}
      {activeTab === "history" && (
        <div>
          <div className="item-header">
            <span className="provider-col">Provider</span>
            <span className="date-col">Date Granted</span>
            <span className="date-col">Date Revoked</span>
          </div>
          {accessHistory.map((history) => (
            <div className="dashboard-card">
                <div className="card-header">
                <span className="provider-col">{history.provider}</span>
                <span className="date-col">{history.dateGranted}</span>
                <span className="date-col">{history.dateRevoked}</span>
                </div>
            </div>
          ))}
        </div>
      )}
        
    </div>
    );
  };
  
  export default AccessManagement;
  