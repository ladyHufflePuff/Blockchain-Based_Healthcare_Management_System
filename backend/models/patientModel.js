export const patientSchema = {
    did: { type: String, required: true }, // Decentralized Ide
    name: { type: String, required: true },
    address: { type: String, required: true },
    mrn: { type: String, required: true },
    dob: { type: Date, required: true }, 
    mobileNumber: { type: String, required: true },
    profilePicture: { type: String, required: true }, // IPFS CID of the profile picture
    gender: { type: String, required: true, enum: ['male', 'female'] }, 
    emergencyContact: {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        relationship: { type: String, required: true }
      },
    insuranceDetails:  {
        providerName: { type: String, required: true },
        policyNumber: { type: String, required: true },
        policyExpiryDate: { type: Date, required: true },
        coverageDetails: [{ type: String }], // Covered services
        policyStatus: { type: String, enum: ['active', 'inactive'], required: true },
        coverageBalance: { type: Number, required: true }
      },
    consultationDetails: {
      doctor: { type: String, required: true },
      date: { type: Date, required: true },
      vitals: {
        bloodPressure: { type: String },
        heartRate: { type: Number },
        temperature: { type: Number },
        weight: { type: Number },
        height: { type: Number }
      }
    },
    consultation: [{
      doctor: String, 
      date: { type: Date, required: true },
      notes: { type: String, required: true } 
    }],
    medicalHistory: [{
      condition: String,
      history: String,
      diagnosedBy: String 
    }],
    allergies: [{
      allergy: String,
      severity: String,
      diagnosedBy: String 
    }],
    familyHistory: [{
      relationship: String,
      gender: String,
      medicalCondition: String
    }],
    generalPractitioner: {
        name: { type: String, required: true },
        practice: { type: String, required: true },
        contact: { type: String, required: true } 
      },
    specialists: [{
      name: String,
      specialty: String,
      practice: String,
      contact: String 
    }],
    dentist:  {
        name: { type: String, required: true },
        practice: { type: String, required: true },
        contact: { type: String, required: true } // Valid phone number
      },
    prescriptions: [{
      date: Date,
      doctor: String,
      medication: String,
      dosage: String,
      frequency: String,
      instructions: String,
      duration: String,
      isActive: Boolean
    }],
    testResults: [{
      filename: String,
      dateUploaded: Date,
      file: String // IPFS CID
    }],
    billing: [{
      filename: String,
      file: String, // IPFS CID
      isPaid: Boolean
    }],
    appointments: [{
      name: String,
      doctor: String,
      date: Date,
      time: String,
      description: String
    }],
    accessControl: [{
      provider: String,
      dateGranted: Date,
      dateRevoked: Date,
      hasAccess: Boolean
    }],
    auditLog: [{
        action: { type: String, enum: ['added', 'updated', 'deleted'] },
        field: { type: String},
        oldValue: { type: String }, 
        newValue: { type: String }, 
        timestamp: { type: Date, default: Date.now },
        performedBy: { type: String } 
      }]
  };
  