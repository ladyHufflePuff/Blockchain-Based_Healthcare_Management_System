import Ajv from 'ajv';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bip39 from 'bip39';

import doctorSchema from '../models/doctorModel.json' assert {type: 'json' };
import { decryptEncryptionKey } from '../services/encryptionService.js';
import { uploadToIPFS } from '../services/ipfsService.js';
import { timestamp } from '../services/timestampService.js';

dotenv.config();
const fireflyApiUrl = process.env.CURABLOCK_API;

// Schema validator setup with date format
const ajv = new Ajv();
ajv.addFormat('date', (data) => /^\d{4}-\d{2}-\d{2}$/.test(data));
const validateDoctorSchema = ajv.compile(doctorSchema);

// Register a new doctor with DID and mnemonic
export const registerDoctor = async (req, res) => {
  const { name, profilePicture, hospital, specialty, status, appointments, consultations, patientAccess, serviceCatalog } = req.body;

  const doctorData = { name, profilePicture, hospital, specialty, status, appointments, consultations, patientAccess, serviceCatalog };
  const valid = validateDoctorSchema(doctorData);
  if (!valid) {
    return res.status(400).json({ success: false, message: 'Invalid input data', errors: validateDoctorSchema.errors });
  }

  try {
    const UuID = uuidv4();
    const did = `did:${UuID}`;
    const uuidBuffer = Buffer.from(UuID.replace(/-/g, ''), 'hex');
    const mnemonic = bip39.entropyToMnemonic(uuidBuffer);

    const input = { did, role: 'doctor', dataJSON: JSON.stringify(doctorData) };
    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/registerIdentity`, { input });

    res.status(200).json({ message: "Doctor registered successfully", passphrase: mnemonic, record: input });
  } catch (error) {
    console.error("Error registering doctor:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to register doctor", error: error.message });
  }
};

// Upload general health record PDF to IPFS and update patient record
export const uploadHealthRecord = async (req, res) => {
  const { patientDid, doctorDid, base64Pdf, record } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const patientData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: patientDid } })).data.record;
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    const encryptionKey = decryptEncryptionKey(patientData.encryptedKey.encryptedData, patientData.encryptedKey.iv);
    const filename = `Health Report [${today}]`;
    const buffer = Buffer.from(base64Pdf.split(',')[1], 'base64');
    const fileCID = await uploadToIPFS(buffer, filename, encryptionKey);

    patientData.healthReports.push({ filename, file: fileCID });
    patientData.auditLog.push({ field: "Medical Record", timestamp: timestamp(), performedBy: doctorData.name });
    Object.assign(patientData, record); // add medicalHistory, allergies, etc.

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: patientDid, newDataJSON: JSON.stringify(patientData) }
    });

    res.status(200).json({ message: `Record uploaded successfully`, updatedPatientData: patientData });
  } catch (err) {
    console.error('Error uploading record:', err);
    res.status(500).json({ error: 'Server error while uploading record' });
  }
};

// Upload test results as encrypted PDF to IPFS
export const uploadTestResults = async (req, res) => {
  const { patientDid, doctorDid, base64Pdf, filename } = req.body;

  try {
    const patientData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: patientDid } })).data.record;
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    const encryptionKey = decryptEncryptionKey(patientData.encryptedKey.encryptedData, patientData.encryptedKey.iv);
    const buffer = Buffer.from(base64Pdf.split(',')[1], 'base64');
    const fileCID = await uploadToIPFS(buffer, filename, encryptionKey);

    patientData.testResults.push({ filename, uploadedBy: doctorData.name, file: fileCID });
    patientData.auditLog.push({ field: "Test Results", timestamp: timestamp(), performedBy: doctorData.name });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: patientDid, newDataJSON: JSON.stringify(patientData) }
    });

    res.status(200).json({ message: `Test Results uploaded successfully`, updatedPatientData: patientData });
  } catch (err) {
    console.error('Error uploading test results:', err);
    res.status(500).json({ error: 'Server error while uploading test result' });
  }
};

// Upload encrypted bill (invoice) to IPFS and update billing data
export const uploadBill = async (req, res) => {
  const { patientDid, doctorDid, invoice } = req.body;

  try {
    const patientData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: patientDid } })).data.record;
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    const encryptionKey = decryptEncryptionKey(patientData.encryptedKey.encryptedData, patientData.encryptedKey.iv);
    const buffer = Buffer.from(invoice.file.split(',')[1], 'base64');
    const fileCID = await uploadToIPFS(buffer, invoice.filename, encryptionKey);

    patientData.insuranceDetails.coverageBalance = invoice.coverageBalance;
    patientData.billing.push({ filename: invoice.filename, file: fileCID, status: invoice.status });
    patientData.auditLog.push({ field: "Billing", timestamp: timestamp(), performedBy: doctorData.name });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: patientDid, newDataJSON: JSON.stringify(patientData) }
    });

    res.status(200).json({ message: `Billing uploaded successfully`, updatedPatientData: patientData });
  } catch (err) {
    console.error('Error uploading bill:', err);
    res.status(500).json({ error: 'Server error while uploading bill' });
  }
};

// Upload consultation record and prescriptions
export const uploadConsultation = async (req, res) => {
  const { patientDid, doctorDid, base64Pdf, prescription } = req.body;
  const today = new Date().toLocaleDateString("en-CA");

  try {
    const patientData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: patientDid } })).data.record;
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    const encryptionKey = decryptEncryptionKey(patientData.encryptedKey.encryptedData, patientData.encryptedKey.iv);
    const filename = `Consultation [${today}]`;
    const buffer = Buffer.from(base64Pdf.split(',')[1], 'base64');
    const fileCID = await uploadToIPFS(buffer, filename, encryptionKey);

    const validPrescription = prescription.map(med => ({
      date: today, doctor: doctorData.name, medication: med.name,
      dosage: med.dosage, frequency: med.frequency, instructions: med.instructions, duration: med.duration
    }));

    patientData.consultation.push({ doctor: doctorData.name, date: today, file: fileCID });
    patientData.auditLog.push({ field: "Consultation", timestamp: timestamp(), performedBy: doctorData.name });
    patientData.vitals = { bloodPressure: null, heartRate: null, temperature: null, weight: null, height: null };
    patientData.prescriptions = [...(patientData.prescriptions || []), ...validPrescription];

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: patientDid, newDataJSON: JSON.stringify(patientData) }
    });

    res.status(200).json({ message: `Consultation uploaded successfully`, updatedPatientData: patientData });
  } catch (err) {
    console.error('Error uploading consultation:', err);
    res.status(500).json({ error: 'Server error while uploading record' });
  }
};

// Save an appointment request between doctor and patient
export const saveAppointment = async (req, res) => {
  const { doctorDid, newAppointment } = req.body;
  const patientDid = newAppointment.patient;

  try {
    const patientData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: patientDid } })).data.record;
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    doctorData.appointments.push({ ...newAppointment, patient: patientData.name });
    patientData.appointmentRequests.push({ ...newAppointment, doctor: doctorData.name });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: doctorDid, newDataJSON: JSON.stringify(doctorData) }
    });

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: patientDid, newDataJSON: JSON.stringify(patientData) }
    });

    res.status(200).json({ message: `Appointment created successfully`, updatedDoctorData: doctorData });
  } catch (err) {
    console.error('Error uploading consultation:', err);
    res.status(500).json({ error: 'Server error while creating appointment' });
  }
};

// Delete an appointment based on match
export const deleteAppointment = async (req, res) => {
  const { doctorDid, appt } = req.body;

  try {
    const doctorData = (await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input: { did: doctorDid } })).data.record;

    // Filter out the specific appointment
    doctorData.appointments = doctorData.appointments?.filter(a =>
      !(a.name === appt.name && a.time === appt.time && a.date === appt.date && a.patient === appt.patient)) || [];

    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, {
      input: { did: doctorDid, newDataJSON: JSON.stringify(doctorData) }
    });

    res.status(200).json({ message: `Appointment deleted successfully`, updatedDoctorData: doctorData });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Server error while updating record' });
  }
};
