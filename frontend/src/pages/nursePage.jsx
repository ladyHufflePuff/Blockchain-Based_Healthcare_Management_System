import { createContext, useContext, useState, useEffect } from "react";

import PostConsultation from "../components/outPatient";
import DisplayPatientSchedule from "../components/nurseIn-Patient";

const NurseContext = createContext();

const NursePortal = ({user}) => {
  const [activeComponent, setActiveComponent] = useState("out-patient");
  const [nurseRecord, setNurseRecord] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.record) {
        setNurseRecord(user.record);
      }
    };

    fetchRecord();
  }, [nurseRecord]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "out-patient":
        return <PostConsultation/>;
      case "in-patient":
        return <DisplayPatientSchedule/>;
      default:
        return <PostConsultation/>;
    }
  };

  return (
    <NurseContext.Provider value={{user, nurseRecord}}>
      <div className="page">
        <div className="sidebar">
          <div className="profile-section">
            <img src={nurseRecord?.profilePicture} className="provider-pic" />
            <div>
              <p><b>{nurseRecord?.name}</b></p>
            </div>
          </div>
          <nav>
            <button className={activeComponent=== "out-patient" ? "active" : ""} onClick={() => setActiveComponent("out-patient")}
            > Out-Patient
            </button>
            <button className={activeComponent === "in-patient" ? "active" : ""} onClick={() => setActiveComponent("in-patient")}
            > In-Patient
            </button>
          </nav>
        </div>
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </NurseContext.Provider>
  );
};
export const useNurse = () => useContext(NurseContext);
export default NursePortal;
