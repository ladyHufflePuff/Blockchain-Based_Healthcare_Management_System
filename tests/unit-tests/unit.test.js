import axios from 'axios';
import fs from 'fs';

// Tests for the /getRecord route

describe('/getRecord route', () => {
  test('should return patient identity and record', async () => {
    /**
     * Tests if a valid mnemonic returns patient identity and record.
     */
    const res = await axios.post("http://localhost:8080/getRecord", {
      mnemonic: "wrap ship undo iron stamp this toast valley avocado apple cousin sun"
    });

    expect(res.status).toBe(200); // Ensure successful response
    expect(res.data).toHaveProperty('identity'); // Check for identity
    expect(res.data).toHaveProperty('record');   // Check for record
  });

  test('should return throw error if mnemonic is invalid', async () => {
    /**
     * Tests error handling for an invalid mnemonic.
     */
    try {
      await axios.post("http://localhost:8080/getRecord", {
        mnemonic: "invalid mnemonic phrase"
      });
    } catch (error) {
      expect(error.response.status).toBe(500); // Should throw internal server error
      expect(error.response.data).toHaveProperty('message', 'Error Fetching user');
      expect(error.response.data).toHaveProperty('error');
    }
  });
});

// Tests for the /fetchRecord route

describe('/fetchRecord route', () => {
  test('should return patient record', async () => {
    /**
     * Tests retrieval of patient record using a DID.
     */
    const res = await axios.post("http://localhost:8080/fetchRecord", {
      did: "did:fe18c3b3-bb2d-47c1-b8c7-870fe154c5ec"
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('identity');
    expect(res.data).toHaveProperty('record');
  });
});

// Tests for the /appointmentRequest route

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
    /**
     * Tests acceptance of an appointment request.
     */
    const res = await axios.post("http://localhost:8080/appointmentRequest", {
      ...baseRequest,
      action: 'accept'
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'Appointment accepted successfully');
    expect(res.data.updatedPatientData).toHaveProperty('appointments');
  });

  test('should handle appointment request (reject)', async () => {
    /**
     * Tests rejection of an appointment request.
     */
    const res = await axios.post("http://localhost:8080/appointmentRequest", {
      ...baseRequest,
      action: 'reject'
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'Appointment rejected successfully');
  });
});
