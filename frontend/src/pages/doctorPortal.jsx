import { createContext, useContext, useState, useEffect } from "react";

import DoctorDashboard from "../components/doctorDashboard";
import DoctorPatientCenter from "../components/doctorPatientCenter";
import DoctorAppointmentCenter from "../components/doctorAppointmentCenter";

const DoctorContext = createContext();

const DoctorPortal = ({user}) => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [doctorRecord, setDoctorRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setDoctorRecord(user.record);
      }
      setLoading(false);
    };

    fetchRecord();
  }, [user?.record]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <DoctorDashboard />;
      case "patient-center":
        return <DoctorPatientCenter />;
      case "appointments":
        return <DoctorAppointmentCenter/>;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <DoctorContext.Provider value={{doctorRecord,setDoctorRecord, user,  loading}}> 
      <div className="page">
        <div className="sidebar">
          <div className="profile-section">
            <img src={doctorRecord?.profilePicture} className="provider-pic" />
            <div>
              <p><b>{doctorRecord?.name}</b></p>
              <p><i>{doctorRecord?.specialty}</i></p>
            </div>
          </div>
          <nav>
            <button className={activeComponent=== "dashboard" ? "active" : ""} onClick={() => setActiveComponent("dashboard")}
            > Dashboard
            </button>
            <button className={activeComponent === "patient-center" ? "active" : ""} onClick={() => setActiveComponent("patient-center")}
            > Patient Center
            </button>
            <button className={activeComponent === "appointments" ? "active" : ""} onClick={() => setActiveComponent("appointments")}
            > Appointment Center
            </button>
          </nav>
        </div>
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);

export default DoctorPortal;
