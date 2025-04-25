import axios from 'axios';
import fs from 'fs';
import { performance } from 'perf_hooks';

// Test credentials and data used across benchmarking calls
const testMnemonic = "six rough metal brain behave differ view infant horse empty chapter trick";
const doctorDid = "did:65cb0849-7439-42cf-a745-e2af35dce52e";
const testFile = fs.readFileSync('base64Output.txt', 'utf8').trim();
const patientDid = "did:c9d78a30-0d71-467b-bcfb-9a6dc92499f4";

const encryptedCID = {
  encryptedData: "76c3d8675f44557fa80368058525d110b84a1d55409adbc68db30b3bc22e6bbb44c4f0adb203bb8d8296a41e14f61e3e",
  iv: "73b57905e32b5f0270b7364143b5436d"
};

/**
 * Executes a single iteration of all benchmarking operations.
 * Measures time taken for each key API endpoint involved in core functionality.
 * @returns {Object} result timings per action
 */
const runOnce = async () => {
  const results = {};

  // Measure login time
  const t1 = performance.now();
  await axios.post("http://localhost:8080/getRecord", { mnemonic: testMnemonic });
  const t2 = performance.now();
  results.login = t2 - t1;

  // Measure grant access time
  const t3 = performance.now();
  await axios.post("http://localhost:8080/grantAccess", { patientDid, doctorDid });
  const t4 = performance.now();
  results.grantAccess = t4 - t3;

  // Measure blockchain record fetch time
  const t5 = performance.now();
  await axios.post("http://localhost:8080/fetchRecord", { did: patientDid });
  const t6 = performance.now();
  results.blockchainFetch = t6 - t5;

  // Measure IPFS health record upload
  const t7 = performance.now();
  await axios.post("http://localhost:8080/uploadHealthRecord", {
    patientDid,
    doctorDid,
    base64Pdf: testFile,
    record: "Sample consultation notes",
  });
  const t8 = performance.now();
  results.ipfsUpload = t8 - t7;

  // Measure document retrieval (IPFS fetch)
  const t9 = performance.now();
  await axios.post("http://localhost:8080/viewDocument", { patientDid, encryptedCID });
  const t10 = performance.now();
  results.ipfsFetch = t10 - t9;

  // Measure consultation posting time
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
  results.consultationPost = t12 - t11;

  return results;
};

// Helper functions for computing performance statistics
const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const min = arr => Math.min(...arr);
const max = arr => Math.max(...arr);

/**
 * Runs multiple benchmarking iterations and logs statistical summaries.
 * @param {number} iterations - Number of times to repeat benchmarking
 */
const runEvaluation = async (iterations = 10) => {
  console.log("=== CuraBlock Performance Evaluation Started ===\n");
  const allResults = [];

  for (let i = 0; i < iterations; i++) {
    console.log(`Iteration ${i + 1}...`);
    try {
      const result = await runOnce();
      allResults.push(result);
    } catch (err) {
      console.error(`Iteration ${i + 1} failed: ${err.message}`);
    }
  }

  const stats = {};
  const keys = Object.keys(allResults[0] || {});
  keys.forEach(key => {
    const values = allResults.map(r => r[key]);
    stats[key] = {
      avg: average(values).toFixed(2),
      min: min(values).toFixed(2),
      max: max(values).toFixed(2)
    };
  });

  console.log("\n=== Evaluation Summary ===");
  console.table(stats);
};

// Start evaluation
runEvaluation(10);
