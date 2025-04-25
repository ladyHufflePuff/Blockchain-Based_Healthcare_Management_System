import axios from 'axios';
import dotenv from 'dotenv';
import bip39 from 'bip39';

dotenv.config();

const fireflyApiUrl = process.env.CURABLOCK_API;

// Authenticate a user via their mnemonic phrase and retrieve their DID record
export const authenticate = async (req, res) => {
  try {
    const { mnemonic } = req.body;

    // Convert mnemonic to entropy and then to UUID format
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const uuidBuffer = Buffer.from(entropy, 'hex');
    const uuid = uuidBuffer.toString('hex');
    const formattedUUID = uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

    const did = `did:${formattedUUID}`;
    const input = { did };

    // Query FireFly for the identity record
    const response = await axios.post(
      `${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`,
      { input }
    );

    const { identity, record } = response.data;

    // If the user is a doctor, update their status to active
    if (identity.role === 'doctor') {
      record.status = 'active';
      const updateInput = {
        did,
        newDataJSON: JSON.stringify(record),
      };
      await axios.post(
        `${fireflyApiUrl}/namespaces/default/apis/identity_management/invoke/updateIdentityRecord`,
        { input: updateInput }
      );
    }

    res.status(200).json({
      identity,
      record,
    });

    console.log('Record successfully retrieved');
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// Fetch a user's identity record via their DID
export const fetchRecord = async (req, res) => {
  try {
    const { did } = req.body;
    const input = { did };

    const response = await axios.post(
      `${fireflyApiUrl}/namespaces/default/apis/identity_management/query/getIdentity`,
      { input }
    );

    const { identity, record } = response.data;

    res.status(200).json({
      identity,
      record,
    });

    console.log('Record successfully retrieved');
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
};
