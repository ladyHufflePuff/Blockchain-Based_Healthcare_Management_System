'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

class IdentityContract extends Contract {

    // Helper: Get private data collection name based on role
    getCollectionForRole(role) {
        switch (role.toLowerCase()) {
          case 'patient':
            return 'PatientPrivateData';
          case 'doctor':
            return 'DoctorPrivateData';
          case 'nurse':
            return 'NursePrivateData';
          default:
            throw new Error(`Invalid role: ${role}`);
        }
    }

    // Helper: Hash data with SHA-256
    hashData(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
      }    

      /**
     * Register a new identity
     * @param {Context} ctx - the transaction context
     * @param {String} did - the decentralized identifier
     * @param {String} role - user role (patient, doctor, nurse)
     * @param {String} dataJSON - JSON string of role-specific data
     */
    async registerIdentity(ctx, did, role, dataJSON) {
        const identityExists = await ctx.stub.getState(did);
        if (identityExists && identityExists.length > 0) {
            throw new Error(`Identity with DID ${did} already exists`);
        }

        const data = JSON.parse(dataJSON);
        const collection = this.getCollectionForRole(role);  

        // Store private role-specific data
        await ctx.stub.putPrivateData(collection, did, Buffer.from(JSON.stringify(data)));

        // Hash private data and create public identity object
        const hash = this.hashData(data);
        const identity = {
            did,
            role,
            dataHash: hash,
            createdAt: new Date().toISOString(),
        };

        // Save to public state
        await ctx.stub.putState(did, Buffer.from(JSON.stringify(identity)));

        return { message: 'Identity registered successfully', did: did };
    }

      /**
     * Retrieve identity by DID and its private role-specific data
     */
    async getIdentity(ctx, did) {
        const identityData = await ctx.stub.getState(did);
        if (!identityData || identityData.length === 0) {
            throw new Error(`Identity with DID ${did} not found`);
        }

        const identity = JSON.parse(identityData.toString());
        const collection = this.getCollectionForRole(identity.role);

        const privateBytes = await ctx.stub.getPrivateData(collection, did);
        const privateData = privateBytes.toString();

        return JSON.stringify({
            identity,
            record: privateData ? JSON.parse(privateData) : null
        });
    }

    /**
     * Update role-specific private record and hash
     */
    async updateIdentityRecord(ctx, did, newDataJSON) {
        const identityData = await ctx.stub.getState(did);
        if (!identityData || identityData.length === 0) {
            throw new Error(`Identity with DID ${did} not found`);
        }
    
        const identity = JSON.parse(identityData.toString());
        const collection = this.getCollectionForRole(identity.role);
    
        const newData = JSON.parse(newDataJSON);

         // Update private record
        await ctx.stub.putPrivateData(collection, did, Buffer.from(JSON.stringify(newData)));
    
         // Update public hash
        identity.dataHash = this.hashData(newData);
        identity.updatedAt = new Date().toISOString();
    
        await ctx.stub.putState(did, Buffer.from(JSON.stringify(identity)));
        return JSON.stringify(identity);
    }

     /**
     * Delete identity and its private data
     */
    async deleteIdentity(ctx, did) {
        const identityData = await ctx.stub.getState(did);
        if (!identityData || identityData.length === 0) {
            throw new Error(`Identity with DID ${did} not found`);
        }
    
        const identity = JSON.parse(identityData.toString());
        const collection = this.getCollectionForRole(identity.role);
    
        await ctx.stub.deletePrivateData(collection, did);
        await ctx.stub.deleteState(did);
    
        return `Identity ${did} and associated record deleted successfully.`;
    }

     /**
     * Get all public identities stored in the ledger
     */
     async getAllIdentities(ctx) {
        const allIdentities = [];
        const iterator = await ctx.stub.getStateByRange('', '');  // Getting the iterator
    
        let result = await iterator.next();  // Get the first record
    
        while (!result.done) {
            if (result.value && result.value.toString()) {
                const identity = JSON.parse(result.value.toString());  // Parse to JSON
    
                if (identity.did && identity.role && identity.dataHash) {
                    allIdentities.push(identity);
                }
            }
    
            result = await iterator.next();  // Get the next record
        }
    
        await iterator.close();
    
        return { identities: allIdentities };  // Return as an object
    }
    
}

module.exports = IdentityContract;
