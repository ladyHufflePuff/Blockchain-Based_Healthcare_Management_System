// Import core packages
import express from 'express';
import cors from 'cors';

// Import route controllers for different roles
import { authenticate, fetchRecord } from './controllers/userController.js';
import { 
  registerPatient, handleAppointmentRequest, revokeAccess, 
  grantAccess, viewDocument  
} from './controllers/patientController.js';
import { 
  registerDoctor, uploadHealthRecord, uploadTestResults, 
  uploadBill, uploadConsultation, saveAppointment, deleteAppointment 
} from './controllers/doctorController.js';
import { 
  registerNurse, postConsultation 
} from './controllers/nurseController.js';

const app = express();

// ----------- Security Middleware ----------- //
app.use((req, res, next) => {
  // Remove the default Express header for security
  res.removeHeader('X-Powered-By');

  // Prevent caching of sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Restrict what content can be loaded on the page
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'");

  // Limit browser features like mic/camera access
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Prevent MIME-sniffing attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enforce cross-origin isolation for better security
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  // Move on to the next middleware/route
  next();
});

// ----------- CORS Configuration ----------- //
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'], // Allowed frontend origins
  methods: ['GET', 'POST'], // Allowed HTTP methods
}));

// ----------- Body Parser Middleware ----------- //
// Accept large JSON and URL-encoded payloads (e.g., for base64 medical files)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------- Routes for All Roles ----------- //

// --- Patient Routes ---
app.post('/registerPatient', registerPatient);             // Create new patient identity
app.post('/appointmentRequest', handleAppointmentRequest); // Send appointment request to doctor
app.post('/revokeAccess', revokeAccess);                   // Revoke doctor's access to data
app.post('/grantAccess', grantAccess);                     // Grant doctor access to data
app.post('/viewDocument', viewDocument);                   // Decrypt and view stored document

// --- Doctor Routes ---
app.post('/registerDoctor', registerDoctor);               // Register doctor identity
app.post('/uploadHealthRecord', uploadHealthRecord);       // Upload health report PDF to IPFS
app.post('/uploadTestResults', uploadTestResults);         // Upload test result PDF to IPFS
app.post('/uploadBill', uploadBill);                       // Upload billing invoice PDF
app.post('/uploadConsultation', uploadConsultation);       // Upload consultation record
app.post('/saveAppointment', saveAppointment);             // Save appointment details
app.post('/deleteAppointment', deleteAppointment);         // Delete scheduled appointment

// --- Nurse Routes ---
app.post('/registerNurse', registerNurse);                 // Register nurse identity
app.post('/postConsultation', postConsultation);           // Submit vitals and nurse notes

// --- Common/User Routes ---
app.post('/getRecord', authenticate);                      // Login/authenticate using mnemonic
app.post('/fetchRecord', fetchRecord);                     // Fetch full identity record (e.g., for dashboard)

// ----------- Start Server ----------- //
app.listen(8080, () => {
  console.log('Backend running on http://localhost:8080');
});
