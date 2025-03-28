export const organizationSchema = {
    did: { type: String, required: true },
    apiUrl: { type: String, required: true }, 
    logo: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['hospital', 'insurance'] },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    members: [{
      did: { type: String}, 
      role: { type: String }, 
    }],
  };

  