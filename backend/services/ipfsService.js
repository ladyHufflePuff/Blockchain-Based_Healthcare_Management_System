import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

import { encrypt, decrypt } from './encryptionService.js';

dotenv.config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const publicGateway = process.env.PUBLIC_GATEWAY;
const privateGateway = process.env.PRIVATE_GATEWAY;

// Upload a file to Pinata IPFS and return the CID
export const uploadToIPFS = async (fileBuffer, fileName, encryptionKey) => {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, { filename: fileName});
    
        const headers = {
            ...form.getHeaders(),
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        };

        const response = await axios.post(
            `${publicGateway}/pinning/pinFileToIPFS`,
            form,
            { headers }
        );
        
        const fileCID = response.data.IpfsHash;
        const encryptedCID = encrypt(fileCID, encryptionKey);
        return encryptedCID;  
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw new Error('File upload failed');
    }
  };
  
  // Retrieve a file from Pinata IPFS using the CID
  export const getFileFromIPFS = async (encryptedCID, iv, encryptionKey) => {
    try {
        const cid = decrypt(encryptedCID, iv, encryptionKey);
        const fileUrl = `${privateGateway}/ipfs/${cid}`;
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        return fileUrl;
    } catch (error) {
        console.error('Error retrieving file from IPFS:', error);
        throw new Error('Failed to retrieve file from IPFS',);
    }
  };