import Ajv from 'ajv';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bip39 from 'bip39';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import patientSchema from '../models/patientModel.json' assert {type: 'json' };
import { generateEncryptionKey, decryptEncryptionKey } from '../services/encryptionService.js';
import { getFileFromIPFS } from '../services/ipfsService.js';


dotenv.config();

const fireflyApiUrl = process.env.CURABLOCK_API;

const ajv = new Ajv();
ajv.addFormat('date', (data) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;  
  return datePattern.test(data);
});
const validatePatientSchema = ajv.compile(patientSchema);
// Ckecks for valid phone number
const validatePhoneNumber = (phoneNumber) => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  return parsedNumber && parsedNumber.isValid();
  };

// Saves a new patient
export const registerPatient = async (req, res) => {
    const { name, address, dob, mobileNumber,profilePicture, gender, emergencyContact, insuranceDetails, vitals, consultation, medicalHistory,allergies, medications, familyHistory, generalPractitioner, specialists, dentist, healthReports, prescriptions, testResults, billing, appointments, appointmentRequests, accessControl, auditLog} = req.body;
    
    if (!validatePhoneNumber(mobileNumber) || !validatePhoneNumber(emergencyContact.contact) || !validatePhoneNumber(generalPractitioner.contact)  || specialists.some(specialist => !validatePhoneNumber(specialist.contact)) || !validatePhoneNumber(dentist.contact)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
  
    const {rawKey, encryptedKey} = generateEncryptionKey();

    const patientData = {
      encryptedKey,
      name, 
      address,
      dob,
      mobileNumber,
      profilePicture,
      gender,
      emergencyContact,
      insuranceDetails,
      vitals,
      consultation,
      medicalHistory,
      allergies,
      medications,
      familyHistory,
      generalPractitioner,
      specialists,
      dentist,
      healthReports,
      prescriptions,
      testResults,
      billing,
      appointments,
      appointmentRequests,
      accessControl,
      auditLog
    };

    const valid = validatePatientSchema(patientSchema);
   
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: validatePatientSchema.errors });
    }
    try
    {

    const UuID = uuidv4();
    const did = `did:${UuID}`;
    const uuidBuffer = Buffer.from(UuID.replace(/-/g, ''), 'hex');
    const mnemonic = bip39.entropyToMnemonic(uuidBuffer);

    const input = {
      did: did,  
      role: 'patient',
      dataJSON: JSON.stringify(patientData)
    };

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/registerIdentity`, { input });

    res.status(200).json({ 
      message: "Patient registered successfully", 
      passphrase: mnemonic
    });
  } catch (error) {
    console.error("Error registering patient:", error.response?.data || error.message);
    res.status(500).json({ message: "Error registering patient", error: error.message });
  }
  
};

export const handleAppointmentRequest = async (req, res) => {
  const { did, action, appointment } = req.body;
  console.log(req.body)

  try {
    const identityRes = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did }
    });

    const patientData = identityRes.data.record; 

    

    patientData.appointmentRequests = patientData.appointmentRequests.filter(
      (appt) => JSON.stringify(appt) !== JSON.stringify(appointment)
    );

    if (action === "accept") {
      patientData.appointments = patientData.appointments || [];
      patientData.appointments.push(appointment);
    }
    const input = {
      did: did,
      newDataJSON: JSON.stringify(patientData)
    };

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, { input });

    res.status(200).json({
      message: `Appointment ${action}ed successfully`,
      updatedPatientData: patientData 
    });
  } catch (error) {
    console.error("Error handling appointment:", error.response?.data || error.message);
    res.status(500).json({ message: "Error handling appointment", error: error.message });
  }
};

export const revokeAccess = async (req, res) => {
  const { patientDid, doctorDid } = req.body;
  const today = new Date().toISOString().split('T')[0];
  console.log(patientDid, doctorDid)

  try {
    const patientResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: patientDid }
    });
    const patientData = patientResponse.data.record; 

    patientData.accessControl = patientData.accessControl.map(entry => {
      if (entry.provider === doctorDid && entry.hasAccess) {
        return {
          ...entry,
          hasAccess: false,
          dateRevoked: today
        };
      }
      return entry;
    });
    console.log(patientData)
    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: {
        did: patientDid,
        newDataJSON: JSON.stringify(patientData)
      }
    });

    const doctorResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: doctorDid }
    });
    const doctorData = doctorResponse.data.record;

    doctorData.patientAccess = doctorData.patientAccess.filter(p => p.patient !== patientDid);
    console.log(doctorData)
    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: {
        did: doctorDid,
        newDataJSON: JSON.stringify(doctorData)
      }
    });

    res.status(200).json({
      message: `Access Revoked`,
      updatedPatientData: patientData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const grantAccess = async (req, res) => {
  const { patientDid, doctorDid } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const patientResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: patientDid }
    });
    const patientData = patientResponse.data.record; 

    const doctorResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: doctorDid }
    });
    const doctorData = doctorResponse.data.record;

    const consultationIndex = doctorData.consultations.findIndex(
      (c) => c.patient === patientData.name 
    );

    let extractedVitals = {}   
    if (consultationIndex !== -1) {
      const consultation = doctorData.consultations[consultationIndex];
      extractedVitals = {
        bloodPressure: consultation.bloodPressure,
        heartRate: consultation.heartRate,
        temperature: consultation.temperature,
        weight: consultation.weight,
        height: consultation.height
      };
      
      patientData.vitals = extractedVitals;

      doctorData.consultations[consultationIndex].consulted = true;
    }

    if (!Array.isArray(patientData.accessControl)) {
      patientData.accessControl = [];
    }

    patientData.accessControl.push({
      provider: doctorDid, 
      dateGranted: today,
      dateRevoked: null, 
      hasAccess: true, 
    });

    if (!Array.isArray(doctorData.patientAccess)) {
      doctorData.patientAccess = [];
    }

    doctorData.patientAccess.push({
      patient: patientDid,
    });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: {
        did: patientDid,
        newDataJSON: JSON.stringify(patientData)
      }
    });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: {
        did: doctorDid,
        newDataJSON: JSON.stringify(doctorData)
      }
    });
    
    res.status(200).json({
      message: `Access Granted successfully`,
      updatedDoctorData: doctorData
     });
  } catch (err) {
    console.error('Error granting access:', err);
    res.status(500).json({ error: 'Server error while granting access' });
  }
};

export const viewDocument = async(req,res) =>{
  const { patientDid, encryptedCID} = req.body;
  
  try {
      const patientResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
        input: { did: patientDid }
      });
      const patientData = patientResponse.data.record; 

      const key = patientData.encryptedKey;
      const encryptionKey = decryptEncryptionKey(key.encryptedData, key.iv);
     
      const  decryptedBuffer  = await getFileFromIPFS(encryptedCID.encryptedData, encryptedCID.iv, encryptionKey);

      const base64Pdf = decryptedBuffer.toString('base64');

      res.status(200).json({
        file: base64Pdf
      });
  
    } catch (err) {
      console.error('Error granting access:', err);
      res.status(500).json({ error: 'Server error while uploading test result' });
    }

}






