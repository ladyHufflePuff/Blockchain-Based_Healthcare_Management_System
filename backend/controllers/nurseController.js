import Ajv from 'ajv';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bip39 from 'bip39';

import nurseSchema from '../models/nurseModel.json' assert {type: 'json' };

dotenv.config();

const fireflyApiUrl = process.env.CURABLOCK_API;

const ajv = new Ajv();
ajv.addFormat('date', (data) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;  
  return datePattern.test(data);
});
const validateNurseSchema = ajv.compile(nurseSchema);

export const registerNurse = async (req, res) => {
    const { name, profilePicture, hospital, avaliableDoctors, assignedPatients} = req.body;

    const nurseData = {
      name,
      profilePicture,
      hospital,
      avaliableDoctors,
      assignedPatients
    };

    const valid = validateNurseSchema(nurseData);

    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: validateNurseSchema.errors });
    }
    try
    {
      const UuID = uuidv4();
      const did = `did:${UuID}`;
      const uuidBuffer = Buffer.from(UuID.replace(/-/g, ''), 'hex');
      const mnemonic = bip39.entropyToMnemonic(uuidBuffer);
    
      const input = {
        did: did,  
        role: 'nurse',
        dataJSON: JSON.stringify(nurseData)
      };

      await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/registerIdentity`, { input });

      res.status(200).json({ 
        message: "Nurse registered successfully", 
        passphrase: mnemonic
      });
  } catch (error) {
    console.error("Error registering nurse:", error.response?.data || error.message);
    res.status(500).json({ message: "Error registering nurse", error: error.message });
  }
  
};

export const postConsultation = async(req, res) =>{
    const { doctor, patient, bloodPressure,  heartRate, temperature, weight, height} = req.body;
    const today = new Date().toLocaleDateString("en-CA");
  
  try {
    const doctorResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, {
      input: { did: doctor }
    });
    const doctorData = doctorResponse.data.record;

    doctorData.consultations.push({
      patient: patient,
      bloodPressure:bloodPressure,
      heartRate: heartRate,
      temperature: temperature,
      weight: weight,
      height: height,
      date: today,
      consulted: false
    });
    console.log(doctorData);
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


  
  
  