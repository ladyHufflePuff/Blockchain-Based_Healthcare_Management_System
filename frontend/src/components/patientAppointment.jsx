import { useState } from "react";

const Appointment = () => {
    const [activeTab, setActiveTab] = useState("requests");
    const [expandedIndex, setExpandedIndex] = useState(null);

    const appointments = [
      { clinic: "ENT Clinic",
        date: "12-04-25",
        doctor: "Dr.Jane Doe",
        time: "10:30",
        notes:"Follow-up for hearing test",
        status: "Attended"
      },
      { clinic: "Colonoscopy Clinic",
        date: "21-04-25",
        doctor: "Dr. John Smith",
        time: "14:00",
        notes: "Routine check-up",
        status: "Missed"
      }
    ];
   
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
            <button className={`tab ${activeTab === "requests" ? "active" : ""}`} 
          onClick={() => handleTabChange("requests")}>Appointment Requests</button>
            <button className={`tab ${activeTab === "history" ? "active" : ""}`} 
          onClick={() => handleTabChange("history")}>Appointment History</button>
        </div>

        <div className={`appointments-content ${activeTab === "requests" ? "requests-grid" : "history-list"}`}>
        {activeTab === "requests"
          ? appointments.map((appt) => (
              <div className="appointment-card">
                <div className="card-header">
                  <div className="patient-info">
                    <h3>{appt.clinic}</h3>
                    <p className="doctor-name">{appt.doctor}</p>
                  </div>
                  <div className="appointment-time">
                    <p className="appointment-date">{appt.date}</p>
                    <p className="appointment-time-text">{appt.time}</p>
                  </div>
                </div>
                <p className="appointment-notes">{appt.notes}</p>
                <div className="btns">
                    <button>Accept</button>
                    <button>Decline</button>
                </div>
              </div>
            ))
          : appointments.map((appt, index) => (
            <div className="dashboard-card">
              <div className="card-header">
                <span className="clinic">{appt.clinic}</span>
                <span className="date">{appt.date}</span>
                <button className="view-btn"onClick={() => toggleDetails(index)}>
                {expandedIndex === index ? "Hide Details ▲" : "View Details ▼"}</button>
              </div>
              {expandedIndex === index && (
                <div className="details-dropdown">
                  <p><strong>Doctor:</strong> {appt.doctor}</p>
                  <p><strong>Time:</strong> {appt.time}</p>
                  <p><strong>Notes:</strong> {appt.notes}</p>
                  <p><strong>Status:</strong> {appt.status}</p>
                </div>
              )}
            </div>
            
          ))}
      </div>

    </div>
    );
  };
  
  export default Appointment;
  