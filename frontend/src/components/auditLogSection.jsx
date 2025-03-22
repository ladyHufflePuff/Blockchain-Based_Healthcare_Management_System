import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AuditLogSection = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const toggleDetails = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
      };
  const [auditLogs, setAuditLogs] = useState([
    {
      date: "21 Mar 2025, 10:30 AM",
      user: "Dr. Smith",
      section: "Medical Records",
      changes: [
        { field: "Allergies", oldValue: "None", newValue: "Penicillin" },
        { field: "Medication", oldValue: "None", newValue: "Metformin - 500mg" },
      ],
    },
    {
      date: "20 Mar 2025, 3:15 PM",
      user: "Dr. Adams",
      section: "Consultation",
      changes: [
        { field: "Consultation Notes", oldValue: "Mild headache", newValue: "Severe migraine, prescribed painkillers" },
        { field: "Vitals - Blood Pressure", oldValue: "120/80", newValue: "130/90" },
      ],
    },
  ]);

  

  return (
    <div>
      {auditLogs.length === 0 ? (
        <p>No changes recorded.</p>
      ) : (
        <div className="audit-log-list">
          {auditLogs.map((log, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span className="log-date">{log.date}</span>
                <span className="log-user">{log.user}</span>
                <span className="log-section">{log.section}</span>
                <button onClick={() => toggleDetails(index)} className="toggle-btn">
                  {expandedIndex === index ? "Hide Details ▲" : "View Details ▼"}</button>
              </div>

              {expandedIndex === index && (
                <div className="details-dropdown">
                  <table className="prescription-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.changes.map((change, index) => (
                        <tr key={index}>
                          <td>{change.field}</td>
                          <td className="old-value">{change.oldValue}</td>
                          <td className="new-value">{change.newValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogSection;
