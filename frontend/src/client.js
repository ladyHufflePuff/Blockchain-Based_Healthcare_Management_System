import axios from "axios";

/**
 * Authenticates user using mnemonic and sets user state if successful.
 */
export const handleLogin = async (mnemonic, setUser, setError) => {
  try {
    const response = await axios.post("http://localhost:8080/getRecord", { mnemonic });
    const { identity, record } = response.data;

    // Update app state with user's role and blockchain identity
    setUser({
      role: identity.role,
      identity,
      record,
    });
  } catch (err) {
    setError("Invalid passphrase. Please try again.");
  }
};

/**
 * Handles doctor-patient appointment request (accept/reject).
 */
export const handleAppointmentManagement = async (user, appt, action, setPatientRecord) => {
  try {
    const response = await axios.post('http://localhost:8080/appointmentRequest', {
      did: user?.identity?.did,
      action,
      appointment: appt,
    });

    if (response.data.updatedPatientData) {
      setPatientRecord(response.data.updatedPatientData);
      console.log(`Appointment ${action}ed successfully.`);
    }
  } catch (error) {
    console.error("Appointment action failed:", error);
  }
};

/**
 * Fetches full identity record based on DID.
 */
export const fetchRecord = async (did) => {
  try {
    const response = await axios.post('http://localhost:8080/fetchRecord', { did });
    return response.data.record;
  } catch (error) {
    console.error("Error fetching identity by DID:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Revoke doctor's access to a patient's records.
 */
export const handleAccessManagement = async (user, doctorDid, setPatientRecord) => {
  try {
    const patientDid = user?.identity?.did;

    const response = await axios.post('http://localhost:8080/revokeAccess', {
      patientDid,
      doctorDid,
    });

    if (response.data.updatedPatientData) {
      setPatientRecord(response.data.updatedPatientData);
      console.log(`Access revoked successfully.`);
    }
  } catch (error) {
    console.error("Access revocation failed:", error);
  }
};

/**
 * Grant access to a doctor using the patient's DID.
 */
export const handleAccessRequest = async (user, setDoctorRecord) => {
  const patientDid = prompt("Enter the patient's DID:");
  if (!patientDid) return;

  try {
    const doctorDid = user?.identity?.did;

    const response = await axios.post('http://localhost:8080/grantAccess', {
      patientDid,
      doctorDid,
    });

    if (response.data.updatedDoctorData) {
      setDoctorRecord(response.data.updatedDoctorData);
    }
  } catch (error) {
    console.error("Error granting access:", error);
    alert('Failed to grant access. Please try again.');
  }
};

/**
 * Uploads a health record to IPFS and updates patient state.
 */
export const handleReportUpload = async (user, patient, base64Pdf, record, setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/uploadHealthRecord', {
      patientDid,
      doctorDid,
      base64Pdf,
      record,
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Report uploaded successfully.`);
    }
  } catch (error) {
    console.error("Error uploading health report:", error);
  }
};

/**
 * Uploads test results (e.g. bloodwork) as a base64 PDF to IPFS.
 */
export const handleTestResultUpload = async (user, patient, base64Pdf, filename, setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/uploadTestResults', {
      patientDid,
      doctorDid,
      base64Pdf,
      filename,
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Test results uploaded successfully.`);
    }
  } catch (error) {
    console.error("Error uploading test results:", error);
  }
};

/**
 * Retrieves and opens a secure document stored via IPFS.
 */
export const handleViewDocument = async (patient, encryptedCID) => {
  try {
    const patientDid = patient;

    const response = await axios.post('http://localhost:8080/viewDocument', {
      patientDid,
      encryptedCID,
    });

    const fileUrl = response.data.file;
    window.open(fileUrl, "_blank"); // Opens the decrypted file in a new tab
  } catch (error) {
    console.error("Error retrieving document:", error);
  }
};

/**
 * Uploads a bill/invoice for a patient.
 */
export const handleUploadbill = async (user, patient, invoice, setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/uploadBill', {
      patientDid,
      doctorDid,
      invoice,
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Bill uploaded successfully.`);
    }
  } catch (error) {
    console.error("Error uploading bill:", error);
  }
};

/**
 * Uploads consultation notes + prescription as a PDF.
 */
export const handleConsultationUpload = async (user, patient, base64Pdf, prescription, setPatientData, setConsultationUploaded) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/uploadConsultation', {
      patientDid,
      doctorDid,
      base64Pdf,
      prescription,
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      setConsultationUploaded(true);
      console.log(`Consultation uploaded successfully.`);
    }
  } catch (error) {
    console.error("Error uploading consultation:", error);
  }
};

/**
 * Saves new appointment slot to doctor's records.
 */
export const handleSaveAppointment = async (user, newAppointment, setDoctorData) => {
  try {
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/saveAppointment', {
      doctorDid,
      newAppointment,
    });

    if (response.data.updatedDoctorData) {
      setDoctorData(response.data.updatedDoctorData);
      console.log(`Appointment saved successfully.`);
    }
  } catch (error) {
    console.error("Error saving appointment:", error);
  }
};

/**
 * Deletes an existing appointment from the doctor's record.
 */
export const handleDeleteAppointment = async (user, appt, setDoctorRecord) => {
  try {
    const doctorDid = user?.identity.did;

    const response = await axios.post('http://localhost:8080/deleteAppointment', {
      doctorDid,
      appt,
    });

    if (response.data.updatedDoctorData) {
      setDoctorRecord(response.data.updatedDoctorData);
      console.log(`Appointment deleted successfully.`);
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
};

/**
 * Posts vitals and basic patient info from the nurse.
 */
export const postVitals = async (formData, setFormData) => {
  try {
    const response = await axios.post("http://localhost:8080/postConsultation", formData);

    if (response) {
      // Reset form fields
      setFormData({
        doctor: "",
        patient: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
        height: "",
      });
    }
  } catch (error) {
    console.error("Error posting consultation:", error);
  }
};
