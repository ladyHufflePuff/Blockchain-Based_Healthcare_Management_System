import axios from 'axios';
import fs from 'fs';


describe('/getRecord route', () => {
    test('should return patient identity and record', async () => {
      const res = await axios.post("http://localhost:8080/getRecord",{ mnemonic: "wrap ship undo iron stamp this toast valley avocado apple cousin sun" });
  
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('identity');
      expect(res.data).toHaveProperty('record');
    });
  
    test('should return throw error if mnemonic is invalid', async () => {
      try {
          await axios.post("http://localhost:8080/getRecord", {
          mnemonic: "invalid mnemonic phrase"
        });
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toHaveProperty('message', 'Error Fetching user');
        expect(error.response.data).toHaveProperty('error');
      }
    });
  });


describe('/fetchRecord route', () => {
  test('should return patient record', async () => {
    const res = await axios.post("http://localhost:8080/fetchRecord",{ did: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec"});

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('identity');
    expect(res.data).toHaveProperty('record');
  });
});


describe('/appointmentRequest route', () => {
    const baseRequest = {
      did: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
      appointment: {
        date: '2025-04-01',
        description: 'Follow-up for PCOS management',
        doctor: 'Dr. Erica Monroe',
        name: 'Routine Gynae Checkup',
        time: '10:30'
      }
    };
  
    test('should handle appointment request (accept)', async () => {
      const res = await axios.post("http://localhost:8080/appointmentRequest",{ ...baseRequest, action: 'accept' });
  
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Appointment accepted successfully');
      expect(res.data.updatedPatientData).toHaveProperty('appointments');
    });
  
    test('should handle appointment request (reject)', async () => {
      const res = await axios.post("http://localhost:8080/appointmentRequest",{ ...baseRequest, action: 'reject' });
  
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Appointment rejected successfully');
    });
  });
  

describe('/revokeAccess route', () => {
    test('should revoke doctor access to patient', async () => {
      const res = await axios.post("http://localhost:8080/revokeAccess",{ patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec", doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87" });
      
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Access Revoked');
        expect(
          res.data.updatedPatientData.accessControl.some(
            (entry) =>
              entry.provider === "did:583b642e-d6ee-48ce-a208-08946af83c87" &&
              entry.hasAccess === false &&
              entry.dateRevoked
          )
        ).toBe(true);
      }); 
  });
  

describe('/grantAccess route', () => {
  test('should allow doctor access to patient', async () => {
    const res = await axios.post("http://localhost:8080/grantAccess",
      { patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec", doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87" });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'Access Granted successfully');
    expect(res.data.updatedDoctorData).toHaveProperty('patientAccess');
    expect(
      res.data.updatedDoctorData.patientAccess.some(
        (p) => p.patient === "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec"
      )
    ).toBe(true);
  });

  test('should return throw error if patient DID is invalid', async () => {
    try {
      await axios.post("http://localhost:8080/grantAccess",
        { patientDid: "invalid-patient-did", doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87" });
    } catch (error) {
      expect(error.response.status).toBe(500);
      expect(error.response.data).toHaveProperty('error','Invalid DID');
    }
    
  });
});


describe('/viewDocument route', () => {
    test('should return base64-encoded PDF file', async () => {
        const mockRequest = {
            patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
           encryptedCID: {
                encryptedData: "e514fd247a316bdfcb52c190abee7555078737477d6e0a3f1971f935b096d8b4724df15e053316bd273d9bb2a393928b",
                    iv: "59cabf48b9f2656dab39c73d1d32523d"
            }
          };
          
        const res = await axios.post("http://localhost:8080/viewDocument", mockRequest);
    
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('file');
      }, 10000);
    
  });


describe('/uploadTestResults route', () => {
    test('should upload test results and update patient data', async () => {
        const mockRequest = {
          patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
          doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
          base64Pdf: fs.readFileSync('base64Output.txt', 'utf8').trim(),
          filename: 'test-results.pdf'
        };
      
        const res = await axios.post("http://localhost:8080/uploadTestResults", mockRequest);
      
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Test Results uploaded successfully');
        expect(res.data.updatedPatientData).toHaveProperty('testResults');
      });
  });


describe('/uploadHealthRecord route', () => {
    test('should upload health record and update patient data', async () => {
        const mockRequest = {
          patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
          doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
          base64Pdf: fs.readFileSync('base64Output.txt', 'utf8').trim(),
          record: {
            medicalHistory: 'None',
            allergies: 'Pollen',
            medications: 'Ibuprofen',
            familyHistory: 'Diabetes',
            specialists: ['Neurologist']
          }
        };
      
        const res = await axios.post("http://localhost:8080/uploadHealthRecord", mockRequest);

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Record uploaded successfully');
        expect(res.data.updatedPatientData).toHaveProperty('healthReports');
      });
  });


describe('/uploadBill route ' , () => {
  const baseRequest = {
    patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
    doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
    invoice: {
      filename: 'invoice-001.pdf',
      file: fs.readFileSync('base64Output.txt', 'utf8').trim(),
      coverageBalance: 1500
    }
  };

  test('should upload invoice with status "Paid" and update billing info', async () => {
    const mockRequest = {
      ...baseRequest,
      invoice: {
        ...baseRequest.invoice,
        status: 'Paid'
      }
    };

    const res = await axios.post("http://localhost:8080/uploadBill", mockRequest);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'Billing uploaded successfully');
    expect(res.data.updatedPatientData).toHaveProperty('billing');
  });

  test('should upload invoice with status "Pending" and update billing info', async () => {
    const mockRequest = {
      ...baseRequest,
      invoice: {
        ...baseRequest.invoice,
        status: 'Pending'
      }
    };

    const res = await axios.post("http://localhost:8080/uploadBill", mockRequest);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'Billing uploaded successfully');
    expect(res.data.updatedPatientData).toHaveProperty('billing');
  });
});


describe('/uploadConsultation route', () => {
    test('should upload consultation file and update patient record with prescription and vitals', async () => {
        const mockRequest = {
          patientDid: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
          doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
          base64Pdf: fs.readFileSync('base64Output.txt', 'utf8').trim(),
          prescription: [
            {
              name: 'Amoxicillin',
              dosage: '500mg',
              frequency: '3 times daily',
              instructions: 'After meals',
              duration: '7 days'
            }
          ]
        };
      
        const res = await axios.post("http://localhost:8080/uploadConsultation", mockRequest);
      
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Consultation uploaded successfully');
        expect(res.data.updatedPatientData).toHaveProperty('consultation');
      });
  });


describe('/saveAppointment route', () => {
    test('should save the appointment and update both doctor and patient records', async () => {
        const mockRequest = {
          doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
          newAppointment: {
            name: 'General Checkup',
            patient: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
            date: '2025-04-25',
            time: '10:00',
            description: 'Routine annual health checkup',
            duration: '30 minutes'
          }
        };
      
        const res = await axios.post("http://localhost:8080/saveAppointment", mockRequest);
      
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Appointment created successfully');
        expect(res.data.updatedDoctorData).toHaveProperty('appointments');
      });
  });


describe('/deleteAppointment route', () => {
    test('should remove an appointment from doctor record', async () => {
        const mockRequest = {
          doctorDid: "did:583b642e-d6ee-48ce-a208-08946af83c87",
          appt: {
            name: 'Consultation with Jane Doe',
            time: '10:00',
            date: '2025-04-25',
            patient: 'Jane Doe'
          }
        };
      
        const res = await axios.post("http://localhost:8080/deleteAppointment", mockRequest);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('message', 'Appointment deleted successfully');
        expect(res.data.updatedDoctorData).toHaveProperty('appointments');
        
      });
  });

describe('/postConsultation route', () => {
    test('should add a consultation to the doctor record', async () => {
      const mockRequest = {
        doctor: "did:583b642e-d6ee-48ce-a208-08946af83c87",
        patient: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec",
        bloodPressure: '120/80',
        heartRate: '75',
        temperature: '37.0',
        weight: '70kg',
        height: '170cm'
      };
  
      const res = await axios.post("http://localhost:8080/postConsultation", mockRequest);
  
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Consultation posted successfully');
    });
  
    test('should throw an error if incomplete form submission', async () => {
      const badRequest = {
        doctor: '',
        patient: '',
        bloodPressure: '120/80',
        heartRate: '75',
        temperature: '37.0',
        weight: '70kg',
        height: '170cm'
      };
      try {
        await axios.post("http://localhost:8080/postConsultation", badRequest);
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toHaveProperty('message', 'Error posting consultation');
      }
    });
  });