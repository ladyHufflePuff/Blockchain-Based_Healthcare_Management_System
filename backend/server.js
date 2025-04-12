import express from 'express';
import cors from 'cors';


import { authenticate, fetchRecord } from './controllers/userController.js';
import { registerPatient, handleAppointmentRequest, revokeAccess, grantAccess, viewDocument  } from './controllers/patientController.js';
import { registerDoctor, uploadHealthRecord, uploadTestResults, uploadBill, uploadConsultation, saveAppointment, deleteAppointment} from './controllers/doctorController.js';
import { registerNurse, postConsultation } from './controllers/nurseController.js';


const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/registerPatient', registerPatient);
app.post('/registerDoctor', registerDoctor);
app.post('/registerNurse', registerNurse);
app.post('/getRecord', authenticate) ;
app.post('/postConsultation', postConsultation);
app.post('/appointmentRequest', handleAppointmentRequest);
app.post('/fetchRecord', fetchRecord);
app.post('/revokeAccess', revokeAccess);
app.post('/grantAccess', grantAccess);
app.post('/uploadHealthRecord', uploadHealthRecord);
app.post('/uploadTestResults', uploadTestResults);
app.post('/viewDocument', viewDocument);
app.post('/uploadBill', uploadBill);
app.post('/uploadConsultation', uploadConsultation);
app.post('/saveAppointment', saveAppointment);
app.post('/deleteAppointment', deleteAppointment);



app.listen(8080, () => {
    console.log('Backend running on http://localhost:8080');
});


  

  
