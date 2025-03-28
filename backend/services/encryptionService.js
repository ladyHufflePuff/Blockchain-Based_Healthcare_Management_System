import crypto from 'crypto';

// Generate a random encryption key
export const generateEncryptionKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 256-bit key
};

// Encrypt a file buffer
export const encryptFile = (fileBuffer, encryptionKey) => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return { encryptedData: encrypted, iv: iv.toString('hex') };
};

// Decrypt a file buffer
export const decryptFile = (encryptedData, iv, encryptionKey) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted;
};
