import React, { useState, useEffect} from "react";

// Displays audit log entries related to patient data
const AuditLogSection = ({ patientData }) => {
  const [auditLogs, setAuditLogs] = useState([]);

  // Load audit logs from patient data when it changes
  useEffect(() => {
    if (patientData && patientData.auditLog && Array.isArray(patientData.auditLog)) {
      setAuditLogs(patientData.auditLog);
    }
  }, [patientData]);

  return (
    <div>
      {auditLogs.length === 0 ? (
        <p>No changes recorded.</p>
      ) : (
        // Show logs in reverse chronological order
        <div className="audit-log-list">
          {[...auditLogs].reverse().map((log, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span className="log-date">{log.timestamp}</span>
                <span className="log-user">{log.performedBy}</span>
                <span className="log-section">{log.field}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogSection;
