import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDDataStore } from '@glazed/did-datastore';

import { patientSchema } from '../models/patientModel';
import { organizationSchema } from '../models/organizationModel';
import { doctorSchema, nurseSchema } from '../models/providerModel';

// Ceramic client setup
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

const patientDatastore = new DIDDataStore({ ceramic, model: { PatientProfile: patientSchema } });
const organizationDatastore = new DIDDataStore({ ceramic, model: { Organization: organizationSchema } });
const doctorDatastore = new DIDDataStore({ ceramic, model: { Doctor: doctorSchema } });
const nurseDatastore = new DIDDataStore({ ceramic, model: { Nurse: nurseSchema } });


export default { patientDatastore, organizationDatastore, doctorDatastore, nurseDatastore};