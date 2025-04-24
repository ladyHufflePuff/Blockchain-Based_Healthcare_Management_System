import axios from "axios";

export const handleLogin = async (mnemonic, setUser, setError) => {
    try {
      const response = await axios.post("http://localhost:8080/getRecord", { mnemonic });
      const { identity, record} = response.data
      setUser({
        role: identity.role,
        identity,
        record,
      });

    } catch (err) {
      setError("Invalid passphrase. Please try again.")
    }
  };

export const handleAppointmentManagement = async (user, appt, action,setPatientRecord) => {
    try {
      const response = await axios.post('http://localhost:8080/appointmentRequest', {
        did: user?.identity?.did, 
        action,
        appointment: appt,
      });
      if (response.data.updatedPatientData) {
        setPatientRecord(response.data.updatedPatientData);
        console.log(`Appointment ${action}ed successfully.`);}
    } catch (error) {
      console.error("Appointment action failed:", error);
    }
  };

export const fetchRecord = async (did) => {
    try {
      const response = await axios.post('http://localhost:8080/fetchRecord', { did }); 
      return response.data.record; 
    } catch (error) {
      console.error("Error fetching identity by DID:", error.response?.data || error.message);
      return null;
    }
  };

export const handleAccessManagement = async (user, doctorDid, setPatientRecord) => {
  try {
    const patientDid =   user?.identity?.did

    const response = await axios.post('http://localhost:8080/revokeAccess', {
      patientDid,
      doctorDid,
    });
    if (response.data.updatedPatientData) {
      setPatientRecord(response.data.updatedPatientData);
      console.log(`Access revoked successfully.`);}
  } catch (error) {
    console.error("Appointment action failed:", error);
  }
};

export const handleAccessRequest = async (user, setDoctorRecord) => {
  const patientDid = prompt("Enter the patient's DID:");
  if (!patientDid) {
    return;
  }
  
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

export const handleReportUpload = async (user, patient, base64Pdf, record,setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/uploadHealthRecord', {
      patientDid,    
      doctorDid,   
      base64Pdf,
      record 
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Report uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleTestResultUpload = async (user, patient, base64Pdf, filename,setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/uploadTestResults', {
      patientDid,    
      doctorDid,   
      base64Pdf,
      filename
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Report uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleViewDocument = async ( patient, encryptedCID) => {
  try {
    const patientDid = patient;

    const response = await axios.post('http://localhost:8080/viewDocument', {
      patientDid,      
      encryptedCID
    });

    const fileUrl = response.data.file;
    window.open(fileUrl, "_blank");
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleUploadbill = async (user, patient, invoice, setPatientData) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/uploadBill', {
      patientDid,    
      doctorDid,   
      invoice
    });
  
    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      console.log(`Bill uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleConsultationUpload = async (user, patient, base64Pdf, prescription, setPatientData, setConsultationUploaded) => {
  try {
    const patientDid = patient;
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/uploadConsultation', {
      patientDid,    
      doctorDid,   
      base64Pdf,
      prescription 
    });

    if (response.data.updatedPatientData) {
      setPatientData(response.data.updatedPatientData);
      setConsultationUploaded(true);
      console.log(`Report uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleSaveAppointment = async (user, newAppointment, setDoctorData) => {
  console.log(user);
  console.log(newAppointment);
  try {
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/saveAppointment', {   
      doctorDid,   
      newAppointment
    });
  
    if (response.data.updatedDoctorData) {
      setDoctorData(response.data.updatedDoctorData);
      console.log(`Bill uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const handleDeleteAppointment = async (user, appt, setDoctorRecord) => {
  console.log(appt);
  try {
    const doctorDid = user?.identity.did;
    
    const response = await axios.post('http://localhost:8080/deleteAppointment', {   
      doctorDid,   
      appt
    });
  
    if (response.data.updatedDoctorData) {
      setDoctorRecord(response.data.updatedDoctorData);
      console.log(`Bill uploaded successfully.`);
    } 
  } catch (error) {
    console.error("Error uploading result access:", error);
  }
};

export const postVitals = async (formData, setFormData) => {
  try {
    const response = await axios.post("http://localhost:8080/postConsultation", formData);
    
    if (response) {
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


export const fetchDoctors = async (hospital, setDoctors) =>{
  try { 
      const response = await axios.get(`http://localhost:8080/doctors/${hospital}`);
      setDoctors(response.data); 
  } catch (error) {
      console.error("Error fetching doctors:", error);
  }
};


