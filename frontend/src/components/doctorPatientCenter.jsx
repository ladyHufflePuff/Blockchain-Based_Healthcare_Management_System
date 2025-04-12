import React, {useState, useEffect} from "react";
import {FaSearch , FaChevronRight} from "react-icons/fa";
import { LuNfc } from "react-icons/lu"; 


import { useDoctor } from "../pages/doctorPortal";
import { handleAccessRequest, fetchRecord } from "../services/authService";
import DoctorPatientView from "./doctorPatientView";


const DoctorPatientCenter = () => {
    const { doctorRecord, setDoctorRecord, user } = useDoctor();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [patientDetailsMap, setPatientDetailsMap] = useState({});

    useEffect(() => {
      const fetchPatientNames = async () => {
        if (!doctorRecord?.patientAccess) return;
  
        const detailsMap = {};
        for (const access of doctorRecord.patientAccess) {
          const record = await fetchRecord(access.patient); 
          if (record) {
            detailsMap[access.patient] = record;
          }
        }
        setPatientDetailsMap(detailsMap);
      };
  
      fetchPatientNames();
    }, [doctorRecord]);

    useEffect(() => {
        if (!doctorRecord) return;

        const consultations = (doctorRecord.consultations || [])
        .filter((consultation) => consultation.consulted === false)
        .map((consultation) => ({
          patient: consultation.patient,
          isConsultation: true,
        }));
    
      const accessPatients = (doctorRecord.patientAccess || []).map((access) => ({
        patient: access.patient,
        isAccessGranted: true,
      }));
        const patients = [...consultations, ...accessPatients];

        const filtered = patients.filter((p) =>{
          const name = p.isAccessGranted
        ? patientDetailsMap[p.patient]?.name || ""
        : p.patient;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
        setFilteredPatients(filtered);
      }, [doctorRecord, searchTerm, patientDetailsMap]); 

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
      };
    
    const handleBack = () => {
        setSelectedPatient(null);
      };    
 
      return (
        <div>
          {selectedPatient ? (
            <DoctorPatientView patient={selectedPatient} onBack={handleBack} />
          ) : (
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
                  filteredPatients.map((patient, index) => {
                    const name = patient.isAccessGranted
                      ? patientDetailsMap[patient.patient]?.name || "Loading..."
                      : patient.patient;
    
                    return (
                      <div key={index} className="dashboard-card">
                        <div className="card-header">
                          <span className="clinic">{name}</span>
                          {patient.isAccessGranted ? (
                            <button
                              className="view-btn"
                              onClick={() => handleViewPatient(patient.patient, user)}
                            >
                              View <FaChevronRight />
                            </button>
                          ) : (
                            <button
                              className="view-btn"
                              onClick={() =>
                                handleAccessRequest(user, setDoctorRecord)
                              }
                            >
                              Request Access <LuNfc />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
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
  