import React, {useState} from "react";
import ConsultationSection from "./consultationSection.jsx";
import TestResultSection from "./testResultSection.jsx";
import PrescriptionSection from "./prescriptionSection.jsx";
import BillingSection from "./billingSection.jsx";
import MedicalRecordSection from "./medicalRecordsSection.jsx";
import AuditLogSection from "./auditLogSection.jsx";

const DoctorPatientView = ({onBack}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("consultations");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const patient = {
        profilePic: "/public/person 6.png", // Make sure the image is in the public folder
        name: "John Doe",
        min: " 123456789",
        dob: " 05-12-1990",
        email: "johndoe@email.com",
        mobile: "+1 234 567 8901",
        emergencyContact: "+1 987 654 3210",
      };

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
 

  return (
    <div>
       <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="patient-details">
        <div>
          <img src={patient.profilePic} className="profile-pic" />
          <p><strong>{patient.name} </strong></p> 
        </div>
        <div className="">
            <p><strong>MIN:</strong> {patient.min}</p>
            <p><strong>DOB:</strong> {patient.dob}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Mobile:</strong> {patient.mobile}</p>
        </div>
      </div>
      <div>
      <div className="tabs">
        <button className={`tab ${activeTab === "consultations" ? "active" : ""}`} 
          onClick={() => handleTabChange("consultations")}>Consultation</button>
        <button className={`tab ${activeTab === "record" ? "active" : ""}`} 
          onClick={() => handleTabChange("record")}>Medical Record</button>
        <button className={`tab ${activeTab === "prescriptions" ? "active" : ""}`} 
          onClick={() => handleTabChange("prescriptions")}>Prescriptions</button>
        <button className={`tab ${activeTab === "results" ? "active" : ""}`} 
          onClick={() => handleTabChange("results")}>Test Results</button>
        <button className={`tab ${activeTab === "billing" ? "active" : ""}`} 
          onClick={() => handleTabChange("billing")}>Billing</button>
        <button className={`tab ${activeTab === "audit" ? "active" : ""}`} 
          onClick={() => handleTabChange("audit")}>Audit log</button>
        </div>
      </div>
      <div className="list-items">
      {activeTab === "consultations" && <ConsultationSection />}
      {activeTab === "record" && <MedicalRecordSection />}
      {activeTab === "prescriptions" && <PrescriptionSection />}
      {activeTab === "results" && <TestResultSection />}
      {activeTab === "billing" && <BillingSection />}
      {activeTab === "audit" && <AuditLogSection />}
      </div>
    </div>
  );
};
  
export default DoctorPatientView;
  