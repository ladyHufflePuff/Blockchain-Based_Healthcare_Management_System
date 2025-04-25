import { useState, useEffect } from "react";
import { usePatient } from "../../pages/patientPortal";
import { fetchRecord, handleAccessManagement } from "../../client";

const AccessManagement = () => {
  const { patientRecord, setPatientRecord, user } = usePatient();
  const [activeTab, setActiveTab] = useState("current");
  const [currentAccess, setCurrentAccess] = useState([]);
  const [accessHistory, setAccessHistory] = useState([]);

  useEffect(() => {
    if (patientRecord) {
      const mapAccessRecords = async () => {
        if (!patientRecord?.accessControl) return;

        const current = [];
        const history = [];

        // Iterate over accessControl entries to categorize current vs revoked access
        for (const record of patientRecord.accessControl) {
          try {
            const identity = await fetchRecord(record.provider);
            const name = identity?.name || record.provider;

            if (record.hasAccess) {
              current.push({
                provider: name,
                dateGranted: record.dateGranted,
                did: record.provider,
              });
            } else {
              history.push({
                provider: name,
                dateGranted: record.dateGranted,
                dateRevoked: record.dateRevoked,
              });
            }
          } catch (err) {
            console.error("Error fetching identity", err);
          }
        }

        setCurrentAccess(current);
        setAccessHistory(history);
      };

      mapAccessRecords();
    }
  }, [patientRecord]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab buttons */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "current" ? "active" : ""}`}
          onClick={() => handleTabChange("current")}
        >
          Current Access
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => handleTabChange("history")}
        >
          Access History
        </button>
      </div>

      {/* Current Access View */}
      {activeTab === "current" && (
        <div>
          <div className="item-header">
            <span className="provider-col">Provider</span>
            <span className="date-col">Date Granted</span>
            <span className="action-col"></span>
          </div>

          {currentAccess.length === 0 ? (
            <div>No current access</div>
          ) : (
            currentAccess.map((access, index) => (
              <div className="dashboard-card" key={index}>
                <div className="card-header">
                  <span className="provider-col">{access.provider}</span>
                  <span className="date-col">{access.dateGranted}</span>
                  <span className="button-item">
                    <button
                      onClick={() =>
                        handleAccessManagement(user, access.did, setPatientRecord)
                      }
                      className="revoke-btn"
                    >
                      Revoke
                    </button>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Access History View */}
      {activeTab === "history" && (
        <div>
          <div className="item-header">
            <span className="provider-col">Provider</span>
            <span className="date-col">Date Granted</span>
            <span className="date-col">Date Revoked</span>
          </div>

          {accessHistory.length === 0 ? (
            <div>No access history</div>
          ) : (
            accessHistory.map((history, index) => (
              <div className="dashboard-card" key={index}>
                <div className="card-header">
                  <span className="provider-col">{history.provider}</span>
                  <span className="date-col">{history.dateGranted}</span>
                  <span className="date-col">{history.dateRevoked}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AccessManagement;
