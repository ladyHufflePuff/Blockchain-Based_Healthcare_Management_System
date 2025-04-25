import Ajv from 'ajv';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bip39 from 'bip39';

// Import JSON schema for nurse validation
import nurseSchema from '../models/nurseModel.json' assert {type: 'json' };

dotenv.config();

const fireflyApiUrl = process.env.CURABLOCK_API;

// Initialize AJV for JSON schema validation
const ajv = new Ajv();

// Add custom date format validation
ajv.addFormat('date', (data) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;  
  return datePattern.test(data);
});

// Compile the nurse schema
const validateNurseSchema = ajv.compile(nurseSchema);

// Register a new nurse identity
export const registerNurse = async (req, res) => {
  const { name, profilePicture, hospital, avaliableDoctors, assignedPatients } = req.body;

  const nurseData = {
    name,
    profilePicture,
    hospital,
    avaliableDoctors,
    assignedPatients
  };

  // Validate nurse input against the schema
  const valid = validateNurseSchema(nurseData);

  if (!valid) {
    return res.status(400).json({ success: false, message: 'Invalid input data', errors: validateNurseSchema.errors });
  }

  try {
    // Generate UUID and corresponding DID
    const UuID = uuidv4();
    const did = `did:${UuID}`;

    // Generate mnemonic passphrase from UUID
    const uuidBuffer = Buffer.from(UuID.replace(/-/g, ''), 'hex');
    const mnemonic = bip39.entropyToMnemonic(uuidBuffer);

    // Prepare input for FireFly API
    const input = {
      did: did,  
      role: 'nurse',
      dataJSON: JSON.stringify(nurseData)
    };

    // Register the nurse identity on the blockchain
    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/registerIdentity`, { input });

    // Return success response with mnemonic
    res.status(200).json({ 
      message: "Nurse registered successfully", 
      passphrase: mnemonic
    });
  } catch (error) {
    console.error("Error registering nurse:", error.response?.data || error.message);
    res.status(500).json({ message: "Error registering nurse", error: error.message });
  }
};

// Post a new consultation by a nurse on behalf of a doctor
export const postConsultation = async (req, res) => {
  const { doctor, patient, bloodPressure, heartRate, temperature, weight, height } = req.body;

  // Format current date in ISO format (YYYY-MM-DD)
  const today = new Date().toLocaleDateString("en-CA");

  try {
    // Fetch the doctor's identity record
    const doctorResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: doctor }
    });

    const doctorData = doctorResponse.data.record;

    // Append new consultation entry to the doctor's record
    doctorData.consultations.push({
      patient: patient,
      bloodPressure: bloodPressure,
      heartRate: heartRate,
      temperature: temperature,
      weight: weight,
      height: height,
      date: today,
      consulted: false // This flag will be updated when the doctor actually performs the consultation
    });

    // Update the doctor's record on the blockchain
    await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, { 
      input: {
        did: doctor, 
        newDataJSON: JSON.stringify(doctorData), 
      }
    });

    res.status(200).json({ message: 'Consultation posted successfully' });
  } catch (error) {
    console.error('Error posting consultation:', error);
    res.status(500).json({ message: 'Error posting consultation' });
  }
};
