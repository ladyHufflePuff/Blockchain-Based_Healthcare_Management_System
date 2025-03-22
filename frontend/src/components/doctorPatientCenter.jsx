import React, {useState} from "react";
import {FaSearch , FaChevronRight } from "react-icons/fa";


import DoctorPatientView from "./doctorPatientView";


const DoctorPatientCenter = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const patients = [
        { patient: "James Carter" },
        { patient: "Sarah Thompson" },
        { patient: "Michael Johnson" },
    ];

    const filteredPatients = patients.filter((p) =>
        p.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
      };
    
      // Handle going back to the list
      const handleBack = () => {
        setSelectedPatient(null);
      };
    
 
      return (
        <div>
          {selectedPatient ? (
            // Show Patient View when a patient is selected
            <DoctorPatientView patient={selectedPatient} onBack={handleBack} />
          ) : (
            // Show Patient List when no patient is selected
            <div>
              <div className="appointment-details">
                <p>Patient List</p>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                  />
                </div>
              </div>
    
              <div className="patient-list">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <div key={index} className="dashboard-card">
                      <div className="card-header">
                        <span className="clinic">{patient.patient}</span>
                        <button
                          className="view-btn"
                          onClick={() => handleViewPatient(patient)}
                        >
                          View <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No matching patients found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      );
};
  
  export default DoctorPatientCenter;
  