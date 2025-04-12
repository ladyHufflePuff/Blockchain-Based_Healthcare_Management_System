import {  createContext, useContext, useState, useEffect} from "react";
import { FaUserCog } from "react-icons/fa"; 

import Dashboard from "../components/patientDashboard";
import Appointment from "../components/patientAppointment";
import Record from "../components/patientRecords";
import AccessManagement from "../components/patientAccessManagement";
import AccountInformation from "../components/patientAccountInformation";

const PatientContext = createContext();

export const PatientPortal = ({user}) => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [patientRecord, setPatientRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setPatientRecord(user.record);
      }
      setLoading(false);
    };

    fetchRecord();
  }, [user?.record]);

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
    <PatientContext.Provider value= {{patientRecord,setPatientRecord,user, loading}}>
      <div className="page">
        <div className="sidebar">
          <nav>
            <button className={activeComponent === "dashboard" ? "active" : ""} onClick={() => setActiveComponent("dashboard")}
            > Dashboard
            </button>
            <button className={activeComponent === "appointments" ? "active" : ""} onClick={() => setActiveComponent("appointments")}
            > Appointments
            </button>
            <button className={activeComponent === "records" ? "active" : ""} onClick={() => setActiveComponent("records")}
            > Records
            </button>
            <button className={activeComponent === "access-management" ? "active" : ""} onClick={() => setActiveComponent("access-management")}
            > Access Management
            </button>
          </nav>
          <button className={`account-section ${activeComponent === "account" ? "active" : ""}`}
            onClick={() => setActiveComponent("account")}>
            <div className="icon-text-wrapper">
              <FaUserCog size={20} />
              <span>Account Information</span>
            </div>
          </button>
        </div>
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);

export default PatientPortal;

