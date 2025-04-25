import React, { useState, useEffect } from "react";

import { useDoctor } from "../../pages/doctorPortal.jsx";
import { fetchRecord } from "../../client.js";

// Section components
import ConsultationSection from "./consultationSection.jsx";
import TestResultSection from "./testResultSection.jsx";
import PrescriptionSection from "./prescriptionSection.jsx";
import BillingSection from "./billingSection.jsx";
import MedicalRecordSection from "./medicalRecordsSection.jsx";
import AuditLogSection from "./auditLogSection.jsx";

const DoctorPatientView = ({ patient, onBack }) => {
  const { user } = useDoctor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("consultations");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [patientData, setPatientData] = useState(null);

  // Fetch patient data on component mount or patient change
  useEffect(() => {
    const loadPatient = async () => {
      const data = await fetchRecord(patient);
      if (data) setPatientData(data);
    };
    loadPatient();
  }, [patient]);

  // Utility: Calculate patient's age based on DOB
  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const handleTabChange = (tab) => setActiveTab(tab);

  // Show loading message until patient data is fetched
  if (!patientData) return <p>Loading patient data...</p>;

  return (
    <div>
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>← Back</button>

      {/* Patient basic info */}
      <div className="patient-details">
        <div>
          <img src={patientData.profilePicture} className="profile-pic" />
          <p><strong>{patientData.name}</strong></p>
        </div>
        <div>
          <p><strong>Age:</strong> {calculateAge(patientData.dob)}</p>
          <p><strong>Mobile:</strong> {patientData.mobileNumber}</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === "consultations" ? "active" : ""}`} onClick={() => handleTabChange("consultations")}>Consultation</button>
        <button className={`tab ${activeTab === "record" ? "active" : ""}`} onClick={() => handleTabChange("record")}>Medical Record</button>
        <button className={`tab ${activeTab === "prescriptions" ? "active" : ""}`} onClick={() => handleTabChange("prescriptions")}>Prescriptions</button>
        <button className={`tab ${activeTab === "results" ? "active" : ""}`} onClick={() => handleTabChange("results")}>Test Results</button>
        <button className={`tab ${activeTab === "billing" ? "active" : ""}`} onClick={() => handleTabChange("billing")}>Billing</button>
        <button className={`tab ${activeTab === "audit" ? "active" : ""}`} onClick={() => handleTabChange("audit")}>Audit log</button>
      </div>

      {/* Tab content based on selected view */}
      <div className="list-items">
        {activeTab === "consultations" && (
          <ConsultationSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === "record" && (
          <MedicalRecordSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === "prescriptions" && (
          <PrescriptionSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === "results" && (
          <TestResultSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === "billing" && (
          <BillingSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
        {activeTab === "audit" && (
          <AuditLogSection
            patientData={patientData}
            patient={patient}
            user={user}
            setPatientData={setPatientData}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientView;
