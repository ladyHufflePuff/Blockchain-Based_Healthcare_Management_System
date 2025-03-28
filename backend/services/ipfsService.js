import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

import { encryptFile } from './encryptionService';
import { decryptFile } from './encryptionService';

dotenv.config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const ipfsGatewayUrl = process.env.IPFS_GATEWAY;

// Upload a file to Pinata IPFS and return the CID
export const uploadToIPFS = async (fileBuffer, fileName, encryptionKey) => {
    try {
        const encryptedFile = encryptFile(fileBuffer, encryptionKey);
        const form = new FormData();
        form.append('file', encryptedFile, fileName);
    
        const headers = {
            ...form.getHeaders(),
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        };
    
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            form,
            { headers }
        );
    
        const fileCID = response.data.IpfsHash;
        return fileCID;
        } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw new Error('Failed to upload file to IPFS');
        }
  };
  
  // Retrieve the file using the CID
  export const getFileFromIPFS = async (cid, encryptionKey) => {
    try {
        const fileUrl = `${ipfsGatewayUrl}/ipfs/${cid}`;
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const decryptedFile = decryptFile(response.data, encryptionKey);
        return decryptedFile;
        } catch (error) {
        console.error('Error retrieving file from IPFS:', error);
        throw new Error('Failed to retrieve file from IPFS');
        }
  };