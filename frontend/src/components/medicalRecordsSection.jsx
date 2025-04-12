import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { jsPDF } from "jspdf";

import { handleReportUpload } from "../services/authService";

const MedicalRecordSection = ({patientData, patient, user, setPatientData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [record, setRecord] = useState({
    fullName: patientData.name,
    sex: patientData.gender,
    dob: patientData.dob,
    emergencyContact: patientData.emergencyContact ? patientData.emergencyContact.name : '',
    emergencyPhone: patientData.emergencyContact ? patientData.emergencyContact.contact : '',
    insuranceProvider: patientData.insuranceDetails ? patientData.insuranceDetails.providerName : '',
    insuranceNumber: patientData.insuranceDetails ? patientData.insuranceDetails.policyNumber : '',
    medicalHistory: patientData.medicalHistory || [],
    allergies:patientData.allergies || [],
    medications: patientData.medications || [],
    familyHistory:patientData.familyHistory || [],
    generalPractitioner: patientData.generalPractitioner || {},
    specialists: patientData.specialists || [],
    dentist: patientData.dentist || {},
  });

  const handleAddRow = (field) => {
    const newRow =
      field === "medicalHistory"
        ? { condition: "", history: "", doctor: "" }
        : field === "allergies"
        ? { allergy: "" }
        : field === "medications"
        ? { name: "", dosage: "", frequency: "", use: "" }
        : { relationship: "", sex: "", condition: "" };

    setRecord({ ...record, [field]: [...record[field], newRow] });
  };

  const handleAddSpecialist = () => {
    setRecord({
      ...record,
      specialists: [...record.specialists, { name: "", specialty: "", practice: "", contact: "" }],
    });
  };

  const handleInputChange = (field, index, subField, value) => {
    const updatedRecords = [...record[field]];
    updatedRecords[index][subField] = value;
    setRecord({ ...record, [field]: updatedRecords });
  };

  const handleSave = async()  => {
    const cleanRecord = {
        ...record,
        medicalHistory: record.medicalHistory.filter((row) => row.condition.trim() && row.history.trim() && row.diagnosedBy.trim()),
        allergies: record.allergies.filter((row) => row.allergy.trim()),
        medications: record.medications.filter((row) => row.dosage.trim() && row.use.trim() && row.use.trim()),
        familyHistory: record.familyHistory.filter((row) => row.relationship.trim() && row.gender.trim() && row.medicalCondition.trim()),
        specialists: record.specialists.filter((row) => row.name.trim() && row.specialty.trim() && row.practice.trim() && row.contact.trim()),
      };

      const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
  
      setRecord(cleanRecord);
      setIsEditing(false);
      const pdfBlob = handleSaveAsPDF(cleanRecord);
      const base64Pdf =  await convertBlobToBase64(pdfBlob);
      handleReportUpload( user, patient, base64Pdf, record, setPatientData)
    };

  // Save as PDF
  const handleSaveAsPDF = (cleanRecord) => {
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;

    const addHeader = () => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(" Medical Summary", 70, 24);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 10);
        y = 30; 
      };
    
      // Function to add footer
      const addFooter = () => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Page " + doc.internal.getNumberOfPages(), 180, pageHeight - 10);
      };

      const checkPageBreak = (extraSpace = 20) => {
        if (y + extraSpace > pageHeight - 20) {
            addFooter();
            doc.addPage();
            y = 20;
        }
    };

    addHeader();

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Full Name: ", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(cleanRecord.fullName, 35, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Sex :", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(cleanRecord.sex,  22, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Date of Birth :", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(cleanRecord.dob,  42, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Emergency Contact :", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${cleanRecord.emergencyContact} (${cleanRecord.emergencyPhone})`,  55, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Insurance Provider :", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(cleanRecord.insuranceProvider, 55, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Insurance Number :", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(cleanRecord.insuranceNumber, 52, y);
    y += 10;

    checkPageBreak();

    y += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Medical History", 10, y);
    y+= 10;

    doc.setFontSize(12);
    if (cleanRecord.medicalHistory.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Condition", 10, y);
      doc.text("History", 60, y);
      doc.text("Diagnosed By",140, y);
      y += 5;

      doc.line(10, y, 200, y); // Horizontal line
      y += 5;

      doc.setFont("helvetica", "normal"); // Reset font for data rows
      cleanRecord.medicalHistory.forEach((item) => {
        doc.text(item.condition, 10, y, { maxWidth: 35 });
        doc.text(item.history, 60, y, { maxWidth: 70} );
        doc.text(item.diagnosedBy, 140, y, { maxWidth: 50 });
        y += 15;
        checkPageBreak();
      });
      doc.line(10, y, 200, y); 
    }
    else {
        doc.setFont("helvetica", "normal");
        doc.text("No identified medical condition", 10, y);
        y += 8;
    }

    checkPageBreak();

    y += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Allergies", 10, y);
    y += 10;

    doc.setFontSize(12);
    if (cleanRecord.allergies.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Allergy", 10, y);
      doc.text("Severity", 60, y);
      doc.text("Diagnosed By",140, y);
      y += 5;

      doc.line(10, y, 200, y); // Horizontal line
      y += 5;

      doc.setFont("helvetica", "normal"); // Reset font for data rows
      cleanRecord.allergies.forEach((item) => {
        doc.text(item.allergy, 10, y, { maxWidth: 35 });
        doc.text(item.severity, 60, y, { maxWidth: 70} );
        doc.text(item.diagnosedBy, 140, y, { maxWidth: 50 });
        y += 8;
        checkPageBreak();
      });
      doc.line(10, y, 200, y); 
    }
    else {
        doc.setFont("helvetica", "normal");
        doc.text("No identified allergies", 10, y);
        y += 8;
    }

    checkPageBreak();

    y += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Medications", 10, y);
    y += 10;

    doc.setFontSize(12);
    if (cleanRecord.medications.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Medication", 10, y);
      doc.text("Dosage", 60, y);
      doc.text("Reason for Use",140, y);
      y += 5;

      doc.line(10, y, 200, y); // Horizontal line
      y += 5;

      doc.setFont("helvetica", "normal"); // Reset font for data rows
      cleanRecord.medications.forEach((item) => {
        doc.text(item.name, 10, y, { maxWidth: 35 });
        doc.text(item.dosage, 60, y, { maxWidth: 70} );
        doc.text(item.use, 140, y, { maxWidth: 50 });
        y += 8;
        checkPageBreak();
      });
      doc.line(10, y, 200, y); 
    }
    else {
        doc.setFont("helvetica", "normal");
        doc.text("No long term medication", 10, y);
        y += 8;
    }

    checkPageBreak();

    y += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Family History", 10, y);
    y += 10;

    doc.setFontSize(12);
    if (cleanRecord.familyHistory.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Relationship", 10, y);
      doc.text("Sex", 60, y);
      doc.text("Medical Condition",140, y);
      y += 5;

      doc.line(10, y, 200, y); // Horizontal line
      y += 5;

      doc.setFont("helvetica", "normal"); // Reset font for data rows
      cleanRecord.familyHistory.forEach((item) => {
        doc.text(item.relationship, 10, y, { maxWidth: 35 });
        doc.text(item.gender, 60, y, { maxWidth: 70} );
        doc.text(item.medicalCondition, 140, y, { maxWidth: 50 });
        y += 8;
        checkPageBreak();
      });
      doc.line(10, y, 200, y); 
    }
    else {
        doc.setFont("helvetica", "normal");
        doc.text("No identified family medical condition", 10, y);
        y += 8;
    }

    checkPageBreak();

    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("General Practitioner", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${cleanRecord.generalPractitioner.name}`,  10, y);
    y += 8;
    checkPageBreak();
    doc.text(`Practice: ${cleanRecord.generalPractitioner.practice}`,  10, y);
    checkPageBreak();
    y += 8;
    doc.text(`Name: ${cleanRecord.generalPractitioner.contact}`,  10, y);
    checkPageBreak();

   
    
    if (cleanRecord.specialists.length > 0) {
      cleanRecord.specialists.forEach((item,index) => {

        y += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Specialist ${index + 1}`, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${item.name}`,  10, y);
        y += 8;
        checkPageBreak();
        doc.text(`Specialty: ${item.specialty}`,  10, y);
        y += 8;
        checkPageBreak();
        doc.text(`Practice: ${item.practice}`,  10, y);
        y += 8;
        checkPageBreak();
        doc.text(`Contact: ${item.contact}`,  10, y);
        checkPageBreak();
        });
    }

    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Dentist", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${cleanRecord.dentist.name}`,  10, y);
    y += 8;
    checkPageBreak();
    doc.text(`Practice: ${cleanRecord.dentist.practice}`,  10, y);
    y += 8;
    checkPageBreak();
    doc.text(`Name: ${cleanRecord.dentist.contact}`,  10, y);
    checkPageBreak();

    addFooter();
    return doc.output('blob');
  };



  return (
    <div className="record">
      <button onClick={() => setIsEditing(!isEditing)}
        className="edit-toggle">
        {isEditing ?(
           <span className="cancel-text">Cancel</span>
         ) :( <span className="edit-icon"><FaEdit /> Edit</span>
        )}
          </button>
      
      {isEditing && <button className="edit-toggle" onClick={handleSave}>Save Changes</button>}

      <div>
        <h3>Patient Information</h3>
        <div>
        <p><strong>Full Name:</strong> {record.fullName}</p>
            <p><strong>Sex:</strong> {record.sex}</p>
            <p><strong>Date of Birth:</strong> {record.dob}</p>
            <p><strong>Emergency Contact:</strong> {record.emergencyContact} ({record.emergencyPhone})</p>
          
            <p><strong>Insurance Provider:</strong> {record.insuranceProvider}</p>
            <p><strong>Insurance Number:</strong> {record.insuranceNumber}</p>
        </div>

        <h3>Medical History</h3>
        {record.medicalHistory.length === 0 ? (
        <p>No identified medical conditions</p>
      ) : (
        <table className="prescription-table">
          <thead><tr><th>Condition</th><th>History</th><th>Diagnosed By</th></tr></thead>
          <tbody>
            {record.medicalHistory.map((entry, index) => (
              <tr key={index}>
              <td>{isEditing ? <input type="text" value={entry.condition} onChange={(e) => handleInputChange("medicalHistory", index, "condition", e.target.value)} /> : entry.condition}</td>
              <td>{isEditing ? <input type="text" value={entry.history} onChange={(e) => handleInputChange("medicalHistory", index, "history", e.target.value)} /> : entry.history}</td>
              <td>{isEditing ? <input type="text" value={entry.diagnosedBy} onChange={(e) => handleInputChange("medicalHistory", index, "doctor", e.target.value)} /> : entry.diagnosedBy}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
      {isEditing && <button onClick={() => handleAddRow("medicalHistory", { condition: "", history: "", diagnosedBy: "" })}>Add Condition</button>}

        <h3>Allergies</h3>
        {record.allergies.length === 0 ? (
        <p>No identified allergies</p>
      ) : (
        <table className="prescription-table">
          <thead><tr><th>Allergy</th><th>Severity</th><th>Diagnosed By</th></tr></thead>
          <tbody>
            {record.allergies.map((entry, index) => (
              <tr key={index}>
              <td>{isEditing ? <input type="text" value={entry.allergy} onChange={(e) => handleInputChange("allergies", index, "allergy", e.target.value)} /> : entry.allergy}</td>
              <td>{isEditing ? <input type="text" value={entry.severity} onChange={(e) => handleInputChange("allergies", index, "severity", e.target.value)} /> : entry.severity}</td>
              <td>{isEditing ? <input type="text" value={entry.diagnosedBy} onChange={(e) => handleInputChange("allergies", index, "doctor", e.target.value)} /> : entry.diagnosedBy}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
      {isEditing && <button onClick={() => handleAddRow("allergies", { allergy: "", severity: "", diagnosedBy: "" })}>Add Allergy</button>}
        <h3>Medications</h3>

        {record.medications.length === 0 ? (
        <p>No longterm medication</p>
      ) : (
        <table className="prescription-table">
          <thead><tr><th>Medication</th><th>Dosage</th><th>Reason for Use</th></tr></thead>
          <tbody>
            {record.medications.map((entry, index) => (
             <tr key={index}>
             <td>{isEditing ? <input type="text" value={entry.name} onChange={(e) => handleInputChange("medications", index, "name", e.target.value)} /> : entry.name}</td>
             <td>{isEditing ? <input type="text" value={entry.dosage} onChange={(e) => handleInputChange("medications", index, "dosage", e.target.value)} /> : entry.dosage}</td>
             <td>{isEditing ? <input type="text" value={entry.use} onChange={(e) => handleInputChange("medications", index, "use", e.target.value)} /> : entry.use}</td>
           </tr>
            ))}
          </tbody>
        </table>
      )}
      {isEditing && <button onClick={() => handleAddRow("medications", { name: "", dosage: "", use: "" })}> Add Medication</button>}

        <h3>Family History</h3>
        {record.familyHistory.length === 0 ? (
        <p>No identified family medical conditions</p>
      ) : (
        <table className="prescription-table">
          <thead><tr><th>Relationship</th><th>Sex</th><th>Medical Condition</th></tr></thead>
          <tbody>
            {record.familyHistory.map((entry, index) => (
              <tr key={index}>
              <td>{isEditing ? <input type="text" value={entry.relationship} onChange={(e) => handleInputChange("familyHistory", index, "relationship", e.target.value)} /> : entry.relationship}</td>
              <td>{isEditing ? <input type="text" value={entry.gender} onChange={(e) => handleInputChange("familyHistory", index, "sex", e.target.value)} /> : entry.gender}</td>
              <td>{isEditing ? <input type="text" value={entry.medicalCondition} onChange={(e) => handleInputChange("familyHistory", index, "condition", e.target.value)} /> : entry.medicalCondition}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
      {isEditing && <button onClick={() => handleAddRow("familyHistory", { relationship: "", gender: "", medicalCondition: "" })}>Add Family History</button>}
        
        <h5><u>General Practitioner</u></h5>
        <p>Name: {record.generalPractitioner.name}</p>
        <p>Practice: {record.generalPractitioner.practice}</p>
        <p>Contact: {record.generalPractitioner.contact}</p>
        
        {record.specialists.map((entry, index) => (
              <div key={index}>
                <h5><u>Specialist {index + 1}</u></h5>
              <p>Name: {isEditing ? <input type="text" value={entry.name} onChange={(e) => handleInputChange("specialists", index, "name", e.target.value)} /> : entry.name}</p>
              <p>Specialty type: {isEditing ? <input type="text" value={entry.specialty} onChange={(e) => handleInputChange("specialists", index, "specialty", e.target.value)} /> : entry.specialty}</p>
              <p>Practice: {isEditing ? <input type="text" value={entry.practice} onChange={(e) => handleInputChange("specialists", index, "practice", e.target.value)} /> : entry.practice}</p>
              <p>Contact: {isEditing ? <input type="text" value={entry.contact} onChange={(e) => handleInputChange("specialists", index, "contact", e.target.value)} /> : entry.contact}</p>
            </div>
            ))}
        {isEditing && <button onClick={handleAddSpecialist}>+ Add Specialist</button>}
        <h5><u>Dentist</u></h5>
        <p>Name: {record.dentist.name}</p>
        <p>Practice: {record.dentist.practice}</p>
        <p>Contact: {record.dentist.contact}</p>
      </div>
    </div>
  );
};

export default MedicalRecordSection;
