import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';

import { patientSchema } from '../models/patientModel';
import { organizationSchema } from '../models/organizationModel';
import { doctorSchema, nurseSchema } from '../models/providerModel';

// Ceramic client setup
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

export const patientDatastore = new DIDDataStore({ ceramic, model: { PatientProfile: patientSchema } });
export const organizationDatastore = new DIDDataStore({ ceramic, model: { Organization: organizationSchema } });
export const doctorDatastore = new DIDDataStore({ ceramic, model: { Doctor: doctorSchema } });
export const nurseDatastore = new DIDDataStore({ ceramic, model: { Nurse: nurseSchema } });

