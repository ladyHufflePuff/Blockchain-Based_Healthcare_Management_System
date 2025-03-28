import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { Ed25519Provider } from "@self.id/web";
import { getResolver } from "key-did-resolver";
import { randomBytes } from "crypto";
import * as u8a from "uint8arrays";

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com"); // Using Clay Testnet

// Function to generate a DID for the patient
export const generateDID = async () => {
  try {
    // Generate a random 32-byte seed
    const seed = randomBytes(32);
    const seedArray = u8a.fromString(seed.toString("hex"), "base16");

    // Create a DID instance
    const did = new DID({
      provider: new Ed25519Provider(seedArray),
      resolver: getResolver(),
    });

    // Authenticate the DID
    await did.authenticate();

    // Assign the DID to Ceramic
    ceramic.did = did;

    // Return the DID string (e.g., "did:key:z6Mk...xyz")
    return did.id;
  } catch (error) {
    console.error("Error generating DID:", error);
    throw new Error("Failed to generate DID");
  }
};