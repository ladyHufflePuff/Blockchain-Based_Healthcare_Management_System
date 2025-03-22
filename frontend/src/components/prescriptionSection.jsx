import React, { useState, useEffect } from "react";

const PrescriptionSection = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const prescriptions = [
        {
          doctor: "Dr. Smith",
          date: "2025-03-18",
          status: "Active",
          medications: [
            { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", instructions: "After meals", duration: "5 days" },
            { name: "Amoxicillin", dosage: "250mg", frequency: "Once daily", instructions: "With water", duration: "7 days" }
          ]
        },
        {
          doctor: "Dr. Adams",
          date: "2025-02-25",
          status: "Completed",
          medications: [
            { name: "Ibuprofen", dosage: "200mg", frequency: "Every 6 hours", instructions: "With food", duration: "3 days" }
          ]
        }
      ];
    const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

 

  return (
    <div>
    {prescriptions.length > 0 ? (
      <div className="prescription-list">
        {prescriptions.map((prescription, index) => (
          <div key={index} className="dashboard-card">
            {/* Card Header (Doctor & Date) */}
            <div className="card-header" onClick={() => toggleExpand(index)}>
              <span>Prescribed by: {prescription.doctor}</span>
              <span>Date: {prescription.date}</span>
              
              <button className="expand-prescription">
              <span className={`status-label ${prescription.status.toLowerCase()}`}>
                  {prescription.status}
                </span>
                {expandedIndex === index ? "▲" : " ▼"}
              </button>
            </div>

            {/* Medication Details Table */}
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
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                        <td>{med.instructions}</td>
                        <td>{med.duration}</td>
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
