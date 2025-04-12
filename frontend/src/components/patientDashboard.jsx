import React, { useEffect, useState } from "react";
import { usePatient } from "../pages/patientPortal";

const Dashboard = () => {
  const { patientRecord } = usePatient(); 
  const [activeTab, setActiveTab] = useState("appointments");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [ongoingMedications, setOngoingMedications] = useState([]);


  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; 

  useEffect(() => {
    if (patientRecord) {
      const filteredAppointments = (patientRecord.appointments || [])
      .filter((appt) => appt.date >= todayFormatted)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingAppointments(filteredAppointments);

      const filteredMedications = patientRecord.prescriptions
        .map((med) => {
          const startDate = new Date(med.date); 
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + med.duration);

          const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)); 
          const daysLeft = med.duration - daysPassed; 

          return {
            ...med,
            daysLeft: daysLeft >= 0 ? daysLeft : 0, 
          };
        })
        .filter((med) => med.daysLeft > 0); 

      setOngoingMedications(filteredMedications);
    }
  }, [patientRecord]); 

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedIndex(null);
  };

  if (!patientRecord) {
    return <div>Loading patient data...</div>; 
  }

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => handleTabChange("appointments")}
        >
          Upcoming Appointments
        </button>
        <button
          className={`tab ${activeTab === "medications" ? "active" : ""}`}
          onClick={() => handleTabChange("medications")}
        >
          Ongoing Medication
        </button>
      </div>

      <div className="dashboard-list">
        {activeTab === "appointments" ? (
          upcomingAppointments.map((appt, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span className="clinic">{appt.name}</span>
                <span className="date">{appt.date}</span>
                <button className="view-btn" onClick={() => toggleDetails(index)}>
                  {expandedIndex === index ? "Hide Details ▲" : "View Details ▼"}
                </button>
              </div>
              {expandedIndex === index && (
                <div className="details-dropdown">
                  <p><strong>Doctor:</strong> {appt.doctor}</p>
                  <p><strong>Time:</strong> {appt.time}</p>
                  <p><strong>Notes:</strong> {appt.description}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          ongoingMedications.map((med, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span className="med-name">{med.medication}</span>
                <span className="dosage">{med.daysLeft} days left</span>
                <button className="view-btn" onClick={() => toggleDetails(index)}>
                  {expandedIndex === index ? "Hide Dosage ▲" : "View Dosage ▼"}
                </button>
              </div>
              {expandedIndex === index && (
                <div className="details-dropdown">
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Frequency:</strong> {med.frequency}</p>
                  <p><strong>Instructions:</strong> {med.instructions}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
