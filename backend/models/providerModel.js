export const doctorSchema = {
  did: { type: String, required: true },
  name: { type: String, required: true },
  hospital: { type: String, required: true },
  specialty: { type: String, required: true },
  appointments: [{
    name: { type: String, required: true },
    patientName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
  }],
  patientsAccess: [{
    did: { type: String, required: true }, 
    name: { type: String, required: true },
  }],
  };

export const nurseSchema = {
  did: { type: String, required: true }, 
  name: { type: String, required: true },
  hospital: { type: String, required: true },
};

  
  
  