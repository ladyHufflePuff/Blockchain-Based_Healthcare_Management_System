import { encrypt, decrypt } from "./services/encryptionService.js";
const masterKey = process.env.MASTER_KEY;
const encrypted = encrypt(Buffer.from('173fa5c1de46fd744c10e14696ece523ee34009d07440a4eb89411f2d342ffad'), masterKey);
console.log("Encrypted Data:", encrypted);

const decrypted = decrypt(Buffer.from(encrypted.encryptedData, 'hex'), encrypted.iv, masterKey);
console.log("Decrypted Data:", decrypted.toString());
