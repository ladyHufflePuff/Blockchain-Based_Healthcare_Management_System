import { createContext, useContext, useState, useEffect } from "react";

import PostConsultation from "../components/nurse-components/outPatient";
import DisplayPatientSchedule from "../components/nurse-components/inPatient";

// Context to share nurse-related data across components
const NurseContext = createContext();

const NursePortal = ({ user }) => {
  // Manages currently selected portal section (out/in-patient)
  const [activeComponent, setActiveComponent] = useState("out-patient");

  // Stores nurse's record fetched from user prop
  const [nurseRecord, setNurseRecord] = useState(null);

  // On mount or nurseRecord change, assign nurse profile if available
  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setNurseRecord(user.record);
      }
    };

    fetchRecord();
  }, [nurseRecord]); 

  // Handles section switching in portal UI
  const renderComponent = () => {
    switch (activeComponent) {
      case "out-patient":
        return <PostConsultation />;
      case "in-patient":
        return <DisplayPatientSchedule />;
      default:
        return <PostConsultation />;
    }
  };

  return (
    <NurseContext.Provider value={{ user, nurseRecord }}>
      <div className="page">
        <div className="sidebar">
          <div className="profile-section">
            {/* Displays nurse avatar and name */}
            <img src={nurseRecord?.profilePicture} className="provider-pic" />
            <div>
              <p><b>{nurseRecord?.name}</b></p>
            </div>
          </div>

          {/* Sidebar navigation */}
          <nav>
            <button
              className={activeComponent === "out-patient" ? "active" : ""}
              onClick={() => setActiveComponent("out-patient")}
            >
              Out-Patient
            </button>
            <button
              className={activeComponent === "in-patient" ? "active" : ""}
              onClick={() => setActiveComponent("in-patient")}
            >
              In-Patient
            </button>
          </nav>
        </div>

        {/* Main view renders selected section */}
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </NurseContext.Provider>
  );
};

// Custom hook for accessing nurse context
export const useNurse = () => useContext(NurseContext);

export default NursePortal;
