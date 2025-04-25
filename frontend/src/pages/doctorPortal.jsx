import { createContext, useContext, useState, useEffect } from "react";

// Importing sub-components that will be rendered based on navigation
import DoctorDashboard from "../components/doctor-components/dashboard";
import DoctorPatientCenter from "../components/doctor-components/patientCenter";
import DoctorAppointmentCenter from "../components/doctor-components/appointmentCenter";

// Creating a context to share doctor data and state throughout child components
const DoctorContext = createContext();

const DoctorPortal = ({ user }) => {
  // Track which component is active: dashboard, patient center, or appointments
  const [activeComponent, setActiveComponent] = useState("dashboard");
  
  // Holds the logged-in doctor's record
  const [doctorRecord, setDoctorRecord] = useState(null);
  
  // Tracks whether data is still loading
  const [loading, setLoading] = useState(true);

  // Fetch and set the doctor's record once the component mounts or user prop changes
  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setDoctorRecord(user.record);
      }
      setLoading(false); // Mark loading as complete
    };

    fetchRecord();
  }, [user?.record]);

  // Dynamically render the component based on sidebar selection
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <DoctorDashboard />;
      case "patient-center":
        return <DoctorPatientCenter />;
      case "appointments":
        return <DoctorAppointmentCenter />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    // Provide doctor-related data to all child components via context
    <DoctorContext.Provider value={{ doctorRecord, setDoctorRecord, user, loading }}> 
      <div className="page">
        {/* Sidebar for navigation and doctor profile display */}
        <div className="sidebar">
          <div className="profile-section">
            <img src={doctorRecord?.profilePicture} className="provider-pic" />
            <div>
              <p><b>{doctorRecord?.name}</b></p>
              <p><i>{doctorRecord?.specialty}</i></p>
            </div>
          </div>
          <nav>
            {/* Navigation buttons for switching between views */}
            <button
              className={activeComponent === "dashboard" ? "active" : ""}
              onClick={() => setActiveComponent("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={activeComponent === "patient-center" ? "active" : ""}
              onClick={() => setActiveComponent("patient-center")}
            >
              Patient Center
            </button>
            <button
              className={activeComponent === "appointments" ? "active" : ""}
              onClick={() => setActiveComponent("appointments")}
            >
              Appointment Center
            </button>
          </nav>
        </div>

        {/* Main content area for rendering selected view */}
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </DoctorContext.Provider>
  );
};

// Custom hook to consume doctor context in any child component
export const useDoctor = () => useContext(DoctorContext);

export default DoctorPortal;
