import axios from 'axios';
import dotenv from 'dotenv';
import bip39 from 'bip39';

dotenv.config();

const fireflyApiUrl = process.env.CURABLOCK_API;

export const authenticate = async (req, res) =>{
  try{
    const { mnemonic } = req.body;

    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const uuidBuffer = Buffer.from(entropy, 'hex');  
    const uuid = uuidBuffer.toString('hex');  
    const formattedUUID = uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

    const did = `did:${formattedUUID}`
    const input = {
      did: did
    };

    const response = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input });
    
    const { identity, record } = response.data;


    if (identity.role === 'doctor'){
      record.status = "active"
      const input = {
        did,
        newDataJSON: JSON.stringify(record)
      }
      const updatedResponse = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`, { input });
    }

    await res.status(200).json({
      identity,
      record
  });

    console.log("Record successfully retreived")
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    res.status(500).json({ message: "Error Fetching user", error: error.message });
  }
}

export const fetchRecord= async (req, res) =>{
  try{
    const { did } = req.body;
    const input = {
      did: did
    };
    const response = await axios.post(`${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`, { input });
    
    const { identity, record } = response.data;

    await res.status(200).json({
      identity,
      record
  });
    console.log("Record successfully retreived")
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    res.status(500).json({ message: "Error Fetching user", error: error.message });
  }
}
