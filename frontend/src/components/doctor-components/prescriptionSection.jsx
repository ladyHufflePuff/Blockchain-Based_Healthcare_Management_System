import React, { useState, useEffect } from "react";

const PrescriptionSection = ({ patientData, setPatientData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [groupedPrescriptions, setGroupedPrescriptions] = useState([]);

  // Group prescriptions by doctor and date whenever patient data updates
  useEffect(() => {
    if (patientData?.prescriptions?.length > 0) {
      const grouped = groupPrescriptions(patientData.prescriptions);
      setGroupedPrescriptions(grouped);
    }
  }, [patientData]);

  // Toggle the expanded view for a specific prescription group
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Groups prescriptions by prescribing doctor and date
  const groupPrescriptions = (prescriptions) => {
    const groups = {};

    prescriptions.forEach((presc) => {
      const key = `${presc.doctor}_${presc.date}`;
      if (!groups[key]) {
        groups[key] = {
          doctor: presc.doctor,
          date: presc.date,
          medications: [],
        };
      }
      groups[key].medications.push(presc);
    });

    // Attach status info to each group
    return Object.values(groups).map((group) => ({
      ...group,
      status: calculateStatus(group.medications, group.date),
    }));
  };

  // Calculates whether a prescription group is still active or completed
  const calculateStatus = (medications, startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    const maxDuration = Math.max(
      ...medications.map((med) =>
        parseInt(med.duration?.match(/\d+/)?.[0] || 0)
      )
    );

    const daysLeft = maxDuration - daysPassed;
    return daysLeft > 0 ? "Active" : "Completed";
  };

  return (
    <div>
      {groupPrescriptions.length > 0 ? (
        <div className="prescription-list">
          {[...groupedPrescriptions].reverse().map((prescription, index) => (
            <div key={index} className="dashboard-card">
              {/* Summary header for each prescription group */}
              <div className="card-header" onClick={() => toggleExpand(index)}>
                <span>Prescribed by: {prescription.doctor}</span>
                <span>Date: {prescription.date}</span>
                <button className="expand-prescription back-btn">
                  <span className={`status-label ${prescription.status.toLowerCase()}`}>
                    {prescription.status}
                  </span>
                  {expandedIndex === index ? "▲" : " ▼"}
                </button>
              </div>

              {/* Expanded medication table view */}
              {expandedIndex === index && (
                <div className="prescription-details">
                  <table className="prescription-table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Instructions</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medications.map((med, medIndex) => (
                        <tr key={medIndex}>
                          <td>{med.medication}</td>
                          <td>{med.dosage}</td>
                          <td>{med.frequency}</td>
                          <td>{med.instructions}</td>
                          <td>{med.duration} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No prescriptions available.</p>
      )}
    </div>
  );
};

export default PrescriptionSection;
