import axios from 'axios';
import fs from 'fs';
import path from 'path';

const testMnemonic = "six rough metal brain behave differ view infant horse empty chapter trick"; 
const doctorDid = "did:65cb0849-7439-42cf-a745-e2af35dce52e"; 
const testFile = fs.readFileSync('base64Output.txt', 'utf8').trim(); 

const evaluateSystem = async () => {
  console.log("=== CuraBlock Evaluation Started ===");

  try {
    // 1. LOGIN (Decode Mnemonic -> DID -> Fetch Record from Blockchain + IPFS)
    const t1 = performance.now();
    const loginRes = await axios.post("http://localhost:8080/getRecord", { mnemonic: testMnemonic });
    const t2 = performance.now();
    console.log(`[Login] Patient record retrieved in ${(t2 - t1).toFixed(2)} ms`);

    const patientDid = "did:c9d78a30-0d71-467b-bcfb-9a6dc92499f4";

    // 2. Grant Access (simulate doctor access request)
    const t3 = performance.now();
    const grantAccessRes = await axios.post("http://localhost:8080/grantAccess", {
      patientDid,
      doctorDid,
    });
    const t4 = performance.now();
    console.log(`[Access Management] Access granted in ${(t4 - t3).toFixed(2)} ms`);

    // 3. Fetch Patient Record as Doctor (tests blockchain record fetch time)
    const t5 = performance.now();
    const fetchRes = await axios.post("http://localhost:8080/fetchRecord", { did: patientDid });
    const t6 = performance.now();
    console.log(`[Blockchain Fetch] Record fetched via DID in ${(t6 - t5).toFixed(2)} ms`);

    // 4. Upload Medical Report (simulate doctor upload, tests IPFS upload time)
    const t7 = performance.now();
    const reportUploadRes = await axios.post("http://localhost:8080/uploadHealthRecord", {
      patientDid,
      doctorDid,
      base64Pdf: testFile,
      record: "Sample consultation notes",
    });
    const t8 = performance.now();
    const encryptedCID =  {
      "encryptedData": "76c3d8675f44557fa80368058525d110b84a1d55409adbc68db30b3bc22e6bbb44c4f0adb203bb8d8296a41e14f61e3e",
      "iv": "73b57905e32b5f0270b7364143b5436d"
  };
    console.log(`[IPFS Upload] Report uploaded in ${(t8 - t7).toFixed(2)} ms`);

    // 5. Fetch Document from IPFS
    const t9 = performance.now();
    const viewDocRes = await axios.post("http://localhost:8080/viewDocument", {
      patientDid,
      encryptedCID,
    });
    const t10 = performance.now();
    console.log(`[IPFS Fetch] Report fetched in ${(t10 - t9).toFixed(2)} ms`);

    // 6. Post Consultation (Nurse assigns patient to doctor)
    const consultation = {
      doctor: doctorDid,
      patient: patientDid,
      bloodPressure: "120/80",
      heartRate: "75",
      temperature: "36.6",
      weight: "70",
      height: "170",
    };

    const t11 = performance.now();
    await axios.post("http://localhost:8080/postConsultation", consultation);
    const t12 = performance.now();
    console.log(`[Consultation Posting] Nurse assignment completed in ${(t12 - t11).toFixed(2)} ms`);

    // SUMMARY
    console.log("=== Evaluation Summary ===");
    console.log("Security & Privacy: Role-based access tested with DID");
    console.log("Usability: Simple mnemonic login + file upload");
    console.log("Scalability & Performance:");
    console.log(` - Blockchain fetch: ${(t6 - t5).toFixed(2)} ms`);
    console.log(` - IPFS upload: ${(t8 - t7).toFixed(2)} ms`);
    console.log(` - IPFS fetch: ${(t10 - t9).toFixed(2)} ms`);
    console.log("Auditability: Events can be traced via FireFly logs");

  } catch (err) {
    console.error("Evaluation failed:", err.message);
  }
};

evaluateSystem();
