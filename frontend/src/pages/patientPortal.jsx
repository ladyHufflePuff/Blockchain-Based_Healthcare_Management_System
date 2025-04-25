import { createContext, useContext, useState, useEffect } from "react";
import { FaUserCog } from "react-icons/fa"; 

import Dashboard from "../components/patient-components/dashboard";
import Appointment from "../components/patient-components/appointment";
import Record from "../components/patient-components/records";
import AccessManagement from "../components/patient-components/accessManagement";
import AccountInformation from "../components/patient-components/accountInformation";

// Global context for sharing patient data across components
const PatientContext = createContext();

export const PatientPortal = ({ user }) => {
  // Tracks which section the patient is currently viewing
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Stores patient profile data for display and interaction
  const [patientRecord, setPatientRecord] = useState(null);

  // Used to show loading states if needed
  const [loading, setLoading] = useState(true);

  // Fetch patient data from the user prop when available
  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setPatientRecord(user.record);
      }
      setLoading(false);
    };

    fetchRecord();
  }, [user?.record]);

  // Dynamically renders the appropriate view based on the selected menu item
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "appointments":
        return <Appointment />;
      case "records":
        return <Record />;
      case "access-management":
        return <AccessManagement />;
      case "account":
        return <AccountInformation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <PatientContext.Provider value={{ patientRecord, setPatientRecord, user, loading }}>
      <div className="page">
        <div className="sidebar">
          {/* Navigation buttons for patient-facing sections */}
          <nav>
            <button
              className={activeComponent === "dashboard" ? "active" : ""}
              onClick={() => setActiveComponent("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={activeComponent === "appointments" ? "active" : ""}
              onClick={() => setActiveComponent("appointments")}
            >
              Appointments
            </button>
            <button
              className={activeComponent === "records" ? "active" : ""}
              onClick={() => setActiveComponent("records")}
            >
              Records
            </button>
            <button
              className={activeComponent === "access-management" ? "active" : ""}
              onClick={() => setActiveComponent("access-management")}
            >
              Access Management
            </button>
          </nav>

          {/* Account section trigger with icon */}
          <button
            className={`account-section ${activeComponent === "account" ? "active" : ""}`}
            onClick={() => setActiveComponent("account")}
          >
            <div className="icon-text-wrapper">
              <FaUserCog size={20} />
              <span>Account Information</span>
            </div>
          </button>
        </div>

        {/* Renders selected portal section */}
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </PatientContext.Provider>
  );
};

// Custom hook to access patient context throughout the app
export const usePatient = () => useContext(PatientContext);

export default PatientPortal;
