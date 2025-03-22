import { useState } from "react";


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("appointments");
    const [expandedIndex, setExpandedIndex] = useState(null);

    const upcomingAppointments = [
      { clinic: "ENT Clinic",
        date: "12-04-25",
        doctor: "Dr.Jane Doe",
        time: "10:30 AM",
        notes:"Follow-up for hearing test" 
      },
      { clinic: "Colonoscopy Clinic",
        date: "21-04-25",
        doctor: "Dr. John Smith",
        time: "2:00 PM",
        notes: "Routine check-up" 
      }
    ];
    const ongoingMedications = [
        { name: "Acetaminophine",
          days: 2,
          dosage: "200mg",
          frequency: "Twice daily",
          instruction:"Take with food to avoid stomach upset"
        },
        { name: "Amlodiphine",
          days: 5,
          dosage: "500mg",
          frequency: "Once daily",
          instruction: "Take in the morning with breakfast" 
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
            <button className={`tab ${activeTab === "appointments" ? "active" : ""}`} 
          onClick={() => handleTabChange("appointments")}>Upcoming Appointments</button>
            <button className={`tab ${activeTab === "medications" ? "active" : ""}`} 
          onClick={() => handleTabChange("medications")}>Ongoing Medication</button>
        </div>
  
        <div className="dashboard-list">
        {activeTab === "appointments" ? (
          upcomingAppointments.map((appt, index) => (
            <div key={index} className="dashboard-card">
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
                </div>
              )}
            </div>
            
          ))
        ) : (
          ongoingMedications.map((med, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
                <span className="med-name">{med.name}</span>
                <span className="dosage">{med.days} days left</span>
                <button className="view-btn" onClick={() => toggleDetails(index)}>
                {expandedIndex === index ? "Hide Dosage ▲" : "View Dosage ▼"}</button>
              </div>
              {expandedIndex === index && (
                <div className="details-dropdown">
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Frequency:</strong> {med.frequency}</p>
                  <p><strong>Instructions:</strong> {med.instruction}</p>
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
  