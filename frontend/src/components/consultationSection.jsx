import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrash, FaFilePdf} from "react-icons/fa";
import { jsPDF } from "jspdf";

import { handleConsultationUpload, handleViewDocument } from "../services/authService";


const ConsultationSection = ({patientData, patient, user, setPatientData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [consultationUploaded, setConsultationUploaded] = useState(false);

  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: ""
  });
  const today = new Date().toISOString().split("T")[0]; // Current date
  useEffect(() => {
    const draft = { notes: consultationNotes, prescriptions };
    localStorage.setItem("consultationDraft", JSON.stringify(draft));
    if (patientData?.consultation) {
      setConsultations(patientData.consultation);
    }
    if (patientData?.vitals) {
      setVitals(patientData.vitals);
    }  
    
  }, [consultationNotes, prescriptions, patientData, consultationUploaded]);
  
  const addMedicationRow = () => {
    setPrescriptions([...prescriptions, { name: "", dosage: "", frequency: "", instructions: "", duration: "" }]);
  };
  const handleSave = async () => {
    const newConsultation = {
      date: today,
      doctor: user?.record.name,
      notes: consultationNotes,
      prescription: prescriptions,
    };
    const validPrescriptions = prescriptions.filter(
      (med) => med.name.trim() !== "" || med.dosage.trim() !== "" ||med.frequency.trim() !== "" || med.instructions.trim() !== "" || med.duration.trim() !== ""
    );

    // Convert to PDF
    const doc = new jsPDF();
    let yPosition = 10; 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Consultation Summary", 70, yPosition);
    yPosition += 10;
  
    // **General Information**
    doc.setFontSize(12);
    doc.text("Date: ", 10, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(newConsultation.date, 22, yPosition);
  
    doc.setFont("helvetica", "bold");
    doc.text("Doctor: ", 130, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(newConsultation.doctor, 145, yPosition);
    yPosition += 10;
  
    doc.setFont("helvetica", "bold");
    doc.text("Blood Pressure :", 10, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(vitals.bloodPressure, 45, yPosition);
  
    doc.setFont("helvetica", "bold");
    doc.text("Heart Rate: ", 130, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(vitals.heartRate, 155, yPosition);
    yPosition += 10;
  
    doc.setFont("helvetica", "bold");
    doc.text("Temperature: ", 10, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(vitals.temperature, 40, yPosition);
  
    doc.setFont("helvetica", "bold");
    doc.text("Height: ", 130, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(vitals.height, 145, yPosition);
    yPosition += 10;
  
    doc.setFont("helvetica", "bold");
    doc.text("Weight: ", 10, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(vitals.weight, 27, yPosition);
    yPosition += 10;
  
    // **Consultation Notes**
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Note", 10, yPosition);
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(newConsultation.notes || "No notes added", 10, yPosition, { maxWidth: 180 });
    yPosition += 20; 
  
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Prescription", 10, yPosition);
    yPosition += 10;
    // **Prescriptions Table**
    doc.setFontSize(12);
    if (validPrescriptions.length > 0) {
      // Table Headers
      doc.setFont("helvetica", "bold");
      doc.text("Medication", 10, yPosition);
      doc.text("Dosage", 50, yPosition);
      doc.text("Frequency", 80, yPosition);
      doc.text("Instructions", 120, yPosition);
      doc.text("Duration", 170, yPosition);
      yPosition += 5;
  
      doc.line(10, yPosition, 200, yPosition);
      yPosition += 5;
  
      doc.setFont("helvetica", "normal"); 
      validPrescriptions.forEach((med) => {
        doc.text(med.name, 10, yPosition, { maxWidth: 35 });
        doc.text(med.dosage, 50, yPosition, { maxWidth: 25} );
        doc.text(med.frequency, 80, yPosition, { maxWidth: 35 });
        doc.text(med.instructions, 120, yPosition, { maxWidth: 45 });
        doc.text(`${med.duration} days`, 170, yPosition), { maxWidth: 15 };
        yPosition += 15;
      });
  
      doc.line(10, yPosition, 200, yPosition); 
    } else {
      doc.setFont("helvetica", "normal");
      doc.text("No prescription added", 10, yPosition);
      yPosition += 10;
    }
    
    const convertBlobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const pdfBlob = doc.output('blob');
    const file = await convertBlobToBase64(pdfBlob); 
   
    return file
  };

  return (
    <div>
      {!consultationUploaded &&(
        <div className="dashboard-card">
          <div className="card-header">
            <span>{today}</span>
            <span>Reviewing: {user.record.name}</span>
            <button className="edit-toggle back-btn" onClick={() => setIsModalOpen(true)}>
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      )}
   
      {consultations.length > 0 ? (
        <div className="consultation-list">
          {[...consultations].reverse().map((consultation, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-header">
              <span>{consultation.date}</span>
              <span>Reviewed by: {consultation.doctor}</span>
              <button className="edit-toggle back-btn" onClick={() => handleViewDocument(patient, consultation.file)}>
                <FaFilePdf /> View</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No past consultations available.</p>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Consultation Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>Consultation Notes</h3>

        {/* Vitals */}
        <div className="vitals">
          <p><strong>Blood Pressure:</strong> {vitals.bloodPressure}</p>
          <p><strong>Heart Rate:</strong>{vitals.heartRate}</p>
          <p><strong>Temperature:</strong>{vitals.temperature}</p>
          <p><strong>Height:</strong>{vitals.weight}</p>
          <p><strong>Weight:</strong>{vitals.height}</p>
        </div>

        {/* Consultation Notes */}
        <textarea
          placeholder="Enter consultation notes..."
          value={consultationNotes}
          onChange={(e) => setConsultationNotes(e.target.value)}
          className="notes-input"
        />

        {/* Prescription Section */}
        <h4>Prescriptions</h4>
        <table className="prescription-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Instructions</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((med, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        placeholder="Medication Name"
                        value={med.name}
                        onChange={(e) => {
                          const newPrescriptions = [...prescriptions];
                          newPrescriptions[index].name = e.target.value;
                          setPrescriptions(newPrescriptions);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => {
                          const newPrescriptions = [...prescriptions];
                          newPrescriptions[index].dosage = e.target.value;
                          setPrescriptions(newPrescriptions);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => {
                          const newPrescriptions = [...prescriptions];
                          newPrescriptions[index].frequency = e.target.value;
                          setPrescriptions(newPrescriptions);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Instructions"
                        value={med.instructions}
                        onChange={(e) => {
                          const newPrescriptions = [...prescriptions];
                          newPrescriptions[index].instructions = e.target.value;
                          setPrescriptions(newPrescriptions);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Duration (days)"
                        value={med.duration}
                        onChange={(e) => {
                          const newPrescriptions = [...prescriptions];
                          newPrescriptions[index].duration = e.target.value;
                          setPrescriptions(newPrescriptions);
                        }}
                      />
                    </td>
                    <td>
                      <FaTrash
                        className="delete-icon"
                        onClick={() => {
                          setPrescriptions(prescriptions.filter((_, i) => i !== index));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="add-medication-btn" onClick={addMedicationRow}>
              + Add Medication
            </button>
            

            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              <button onClick={async () =>{
                const base64pdf = await handleSave();
                await handleConsultationUpload(user, patient, base64pdf, prescriptions, setPatientData, setConsultationUploaded)
                setConsultationNotes("");
                setVitals({
                  bloodPressure: "",
                  heartRate: "",
                  temperature: "",
                  weight: "",
                  height: ""
                });                
                setPrescriptions([]);
                setIsModalOpen(false);
              }}>
                Save</button>
            </div>
      </Modal>
    </div>
  );
};

export default ConsultationSection;
