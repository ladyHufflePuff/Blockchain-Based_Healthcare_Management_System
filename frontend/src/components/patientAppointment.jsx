import { useState, useEffect } from "react";
import { usePatient } from "../pages/patientPortal";
import { handleAppointmentManagement } from "../services/authService";

const Appointment = () => {
  const { patientRecord,setPatientRecord, user } = usePatient();
  const [activeTab, setActiveTab] = useState("requests");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (patientRecord ) {
      setAppointmentRequests(patientRecord.appointmentRequests || []);

      const pastAppointments = (patientRecord.appointments || [])
      .filter((appt) => {
        const apptDate = new Date(appt.date).toISOString().split("T")[0];
        return apptDate < today;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setAppointmentHistory(pastAppointments);
    }
  }, [patientRecord]);

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedIndex(null);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => handleTabChange("requests")}
        >
          Appointment Requests
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => handleTabChange("history")}
        >
          Appointment History
        </button>
      </div>

      <div
        className={`appointments-content ${
          activeTab === "requests" ? "requests-grid" : "history-list"
        }`}
      >
        {activeTab === "requests" ? (
          appointmentRequests.length > 0 ? (
            appointmentRequests.map((appt, index) => (
              <div className="appointment-card" key={index}>
                <div className="card-header">
                  <div className="patient-info">
                    <h3>{appt.name}</h3>
                    <p className="doctor-name">{appt.doctor}</p>
                  </div>
                  <div className="appointment-time">
                    <p className="appointment-date">{appt.date}</p>
                    <p className="appointment-time-text">{appt.time}</p>
                  </div>
                </div>
                <p className="appointment-notes">{appt.description}</p>
                <div className="btns">
                  <button
                  onClick={() => handleAppointmentManagement(user, appt, "accept", setPatientRecord)}
                  >Accept</button>
                  <button
                  onClick={() => handleAppointmentManagement(user, appt, "decline",setPatientRecord)}
                  >Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p>No appointment requests available.</p>
          )
        ) : appointmentHistory.length > 0 ? (
          appointmentHistory.map((appt, index) => (
            <div className="dashboard-card" key={index}>
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
          <p>No appointment history available.</p>
        )}
      </div>
    </div>
  );
};

export default Appointment;
