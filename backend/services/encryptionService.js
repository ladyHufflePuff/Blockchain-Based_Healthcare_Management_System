import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const masterKey = process.env.MASTER_KEY;

// Generate a random encryption key
export const generateEncryptionKey = () => {
    const rawKey = crypto.randomBytes(32).toString('hex');
    let encryptedKey = encrypt(rawKey, masterKey);
    return { rawKey, encryptedKey };
};

// Decrypts encrypted key
export const decryptEncryptionKey = (encryptedKey, iv) => {
    const encryptionKey= decrypt(encryptedKey, iv, masterKey);
    return encryptionKey;
};

// Encrypts data
export const encrypt = (data, encryptionKey) => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    
    let encrypted = cipher.update(data, 'utf-8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return { encryptedData: encrypted.toString('hex'), iv: iv.toString('hex') };
};

// Decrypts data
export const decrypt = (encryptedData, iv, encryptionKey) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
};


