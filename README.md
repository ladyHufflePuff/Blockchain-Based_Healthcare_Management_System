# CuraBlock: A Blockchain-based Healthcare Management System

---

CuraBlock is a blockchain-based healthcare management system designed to streamline digital health records, ensure data integrity, and enable secure interactions between patients, doctors, and nurses. It leverages Hyperledger Fabric for permissioned blockchain infrastructure, IPFS for decentralized file storage, and FireFly for orchestrating chain interactions.

## Features

---

- **Role-based Access Control**: Supports distinct access levels for patients, doctors, and nurses using decentralized identities (DIDs).
- **IPFS Integration**: Large medical files (PDFs, reports) are offloaded to IPFS, with only encrypted references stored on-chain.
- **FireFly Middleware**: Enables seamless interaction with the Hyperledger Fabric network through FireFly.
- **Auditability and Transparency**: Immutable logs and data updates for every interaction.
- **Multi-portal Frontend**: Custom interfaces for patients, doctors, and nurses built using React.


## Project Folder Structure

---

### Backend

```
backend/
├── chaincode/
│   └── identity/
│       ├── collections-config.json           # Fabric private data collection config
│       ├── identity-contract-interface.json  # Interface defining contract structure
│       ├── identity_contract.js              # Chaincode logic for identity management
│       ├── index.js                          # Entry point to register chaincode classes
│       └── package.json                      # Dependencies for chaincode logic
│
├── controllers/
│   ├── doctorController.js                   # Routes and logic for doctor functionalities
│   ├── nurseController.js                    # Routes and logic for nurse interactions
│   ├── patientController.js                  # Routes and logic for patient-side operations
│   └── userController.js                     # Common login/auth logic across roles
│
├── models/
│   ├── doctorModel.json                      # Doctor schema/role-based metadata
│   ├── nurseModel.json                       # Nurse schema/role-based metadata
│   └── patientModel.json                     # Patient schema/role-based metadata
│
├── services/
│   ├── encryptionService.js                  # AES-based encryption and decryption helper
│   ├── ipfsService.js                        # Uploads files to IPFS, returns encrypted CID
│   └── timestampService.js                   # Adds timestamps to medical records
│
├── uploads/                                  # Temp folder to store uploaded files before processing
├── .env                                      # Environment variables 
├── .gitignore                                # Files and Folders to exclude
├── core.yaml                                 # Hyperledger Fabric network configuration
├── package.json                              # Backend dependencies and scripts
└── server.js                                 # Main Express.js server entry point
```


### Frontend

```
frontend/
├── public/
│   ├── chime.mp3                             # Audio file for notifications
│   └── logo.png                              # Project branding/logo used in UI
│
├── src/
│   ├── components/
│   │   ├── doctor-components/
│   │   │   ├── appointmentCenter.jsx         # Book/manage appointments
│   │   │   ├── auditLogSection.jsx           # Displays action logs for auditing
│   │   │   ├── billingSection.jsx            # Handle billing and invoices
│   │   │   ├── consultationSection.jsx       # Consultation notes and summaries
│   │   │   ├── dashboard.jsx                 # Doctor dashboard landing page
│   │   │   ├── medicalRecordsSection.jsx     # Access and update patient records
│   │   │   ├── patientCenter.jsx             # Overview of assigned patients
│   │   │   ├── patientView.jsx               # View detailed patient history
│   │   │   ├── prescriptionSection.jsx       # Prescribe and view medications
│   │   │   └── testResultSection.jsx         # Upload or view diagnostic test results
│   │   ├── nurse-components/
│   │   │   ├── inPatient.jsx                 # Handle in-patient nurse duties
│   │   │   └── outPatient.jsx                # Handle out-patient nurse responsibilities
│   │   └── patient-components/
│   │       ├── accessManagement.jsx         # Manage who can view records
│   │       ├── accountInformation.jsx       # Profile and account settings
│   │       ├── appointment.jsx              # Appointment management
│   │       ├── dashboard.jsx                # Patient dashboard landing page
│   │       └── records.jsx                  # View medical documents
│
│   ├── pages/
│   │   ├── doctorPortal.jsx                 # Page container for doctor layout
│   │   ├── loginPage.jsx                    # User login form
│   │   ├── nursePortal.jsx                  # Page container for nurse layout
│   │   └── patientPortal.jsx                # Page container for patient layout
│
│   ├── App.jsx                              # Main app router and layout handler
│   ├── client.js                            # Axios setup and API wrapper
│   ├── index.css                            # Base styling
│   ├── main.jsx                             # React app entry point
│   └── vite.config.js                       # Vite bundler and server config
```


### Testing

```
tests/
├── performance-tests/
│     ├── base64Output.txt                         # Sample output from data encoding tests
│     ├── evaluateSystem.js                        # Evaluates throughput, latency, error rate
│     ├── microbenchmarking.js                     # Micro-performance tests for backend services
│     ├── simulatedLoad.sh                         # Shell script for running load tests
├── security-tests/
│     ├── zap.yaml                                 # OWASP ZAP security scanning configuration filr
├── unit-tests/
│     ├── unit.test.js                             # Jest-based unit tests for backend logic
```


## Getting Started

This guide walks you through setting up the Blockchain-Based Healthcare Management System on a local machine using WSL (Ubuntu), Node.js, Hyperledger Fabric, FireFly, and IPFS.


---

### Prerequisites

Ensure the following are installed:

- Windows Subsystem for Linux (WSL2)
- Ubuntu (20.04 or later)
- Docker Desktop
- Hyperledger Firefly
- Go (v1.20+)
- Go OpenSSL
- Node.js (v18+)
- npm
- jq, curl, wget
- Postman


---


### Installations

#### 1. Install WSL & Ubuntu

Run this in PowerShell (as Administrator):
```bash
wsl --install
```

This installs WSL2 with Ubuntu as default. After installation, restart your computer.

Then open Ubuntu from the Start menu and let it initialize.


#### 2. Update & Install Base Packages

In your Ubuntu terminal:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install build-essential curl wget git jq unzip -y
```


#### 3. Install Docker

Install the Docker CLI in WSL to interact with containers easily
```bash
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo usermod -aG docker $USER
```
Restart your terminal


#### 4. Install Go (v1.20+)

```bash
wget https://go.dev/dl/go1.20.13.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.20.13.linux-amd64.tar.gz
```

Add Go to your PATH:
```bash
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
```

Check version:
```bash
go version
```


#### 5. Install OpenSSl (if not preinstalled)

```bash
sudo apt install openssl libssl-dev -y
```

#### 6. Install Node.js & npm (v18+)

Using nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```
Verify:
```bash
node -v
npm -v
```

#### 5. Install Hyperledger FireFly CLI

Download the package for your OS from the [latest release page](https://github.com/hyperledger/firefly-cli/releases)


Extract the binary and move it to /usr/bin/local

```bash
sudo tar -zxf ~/Downloads/firefly-cli_*.tar.gz -C /usr/local/bin ff && rm ~/Downloads/firefly-cli_*.tar.gz
```

If you downloaded the package from GitHub into a different directory, you will need to change the tar command above to wherever the firefly-cli_*.tar.gz file is located.

Then reload your terminal:
```bash
source ~/.bashrc
```

Verify:
```bash
ff version
```


---



### Clone the Repository & Install Dependencies

#### 1. Clone the Repository

In your WSL/Ubuntu terminal:
```bash
git clone https://github.com/ladyHufflePuff/Blockchain-Based_Healthcare_Management_System.git
cd Blockchain-Based_Healthcare_Management_System
```
#### 2. Install Backend Dependencies

```bash
cd backend
npm install
npm run start
```

#### 3. Install Chaincode Dependencies

```bash
cd chaincode
npm install
```

#### 4. Install Frontend Dependencies

```bash
cd ../../frontend
npm install
npm run dev
```

#### 5.  Install Test Suite Dependencies

```bash
cd ../tests
npm install
```


---



### Setup Blockchain Environment


#### 1. Initialize Firefly Stack

In your `backend` directory:
```bash
ff init stack fabric curablock 1
```
#### 2. Start Firefly Stack

```bash
ff start curablock
```

#### 3. Package Chaincode

```bash
peer lifecycle chaincode package chaincode.tar.gz \
  --path ./chaincode/identity \
  --lang node \
  --label chaincode
```

#### 4. Copy Chaincode and Private Data Collections into Fabric Peer

```bash
docker cp ./chaincode.tar.gz curablock_fabric_peer:/tmp/chaincod
e.tar.gz
docker cp ./chaincode/collections-config.json curablock_fabric_p
eer:/tmp/collections-config.json
```

#### 5.  Navigate to Fabric Peer

```bash
docker exec -it curablock_fabric_peer /bin/bash
```

#### 6.  Configure Admin Permission in Peer

```bash
export CORE_PEER_MSPCONFIGPATH=/etc/firefly/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp 
```

#### 6.  Install Chaincode

```bash
peer lifecycle chaincode install /tmp/chaincode.tar.gz
```
#### 7.  Approve Chaincode

Replace `new_package_id` with the package id returned from the previous step

```bash
peer lifecycle chaincode approveformyorg --channelID firefly --name chaincode --version 1.0 --package-id chaincode:<new_package_id> --sequenc
e 1 --collections-config /tmp/collections-config.json --orderer fabric
_orderer:7050 --tls --cafile /etc/firefly/organizations/ordererOrganiz
ations/example.com/orderers/fabric_orderer.example.com/msp/tlscacerts/
tlsca.example.com-cert.pem
```
#### 8.  Commit Chaincode

```bash
peer lifecycle chaincode commit --channelID firefly --name chaincode --version 1.0 --sequence 1 --collections-config ./
tmp/collections-config.json --orderer fabric_orderer:7050 --tls --cafi
le /etc/firefly/organizations/ordererOrganizations/example.com/orderer
s/fabric_orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
  --peerAddresses fabric_peer:7051 --tlsRootCertFiles /etc/firefly/org
anizations/peerOrganizations/org1.example.com/peers/fabric_peer.org1.e
xample.com/tls/ca.crt 
```
#### 9.  Invoke Chaincode

```bash
peer chaincode invoke \
  -o fabric_orderer:7050 \
  --tls \
  --cafile /etc/firefly/organizations/ordererOrganizations/example.com/orderers/fabric_orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  -C firefly \
  -n chaincode \
  -c '{"Args":["registerIdentity", "did:example:123", "doctor", "{\"na
me\":\"Musa Jones\"}"]}'
```
#### 10.  Exit  Peer Environment

```bash
exit
```

#### 11.  Setup Chaincode API

Open up [Sandbox UI](http://127.0.0.1:5108) in your browser

Navigate to Contracts

##### Define a Contract Interface

- Copy the contents of `identity-contract-interface.json` in the `chaincode` directory into the schema entry field

- Ensure publish is checked

- Click on the `run` button in application code


#####  Register a Contract API

- Select **chaincode-1.0** for the Contact interface dropdown

- Enter **identity_management** in the  Name entry field

- Enter **chaincode** in the Chaincode entry fiels

- Enter **firefly** in the Channel enty field

- Ensure publish is checked

- Click on the `run` button in application code


---


###  Register Identities

Base URL: http://localhost:8080

#### 1.  Doctor, Nurse and Patient
Make `POST`  requests to the following routes with the respective JSON files from the `sample-users` folder:

| Role    | Route             | JSON File     |
|:--------|:------------------|:--------------|
| Doctor  | `/registerDoctor` | `doctor.json` |
| Nurse   | `/registerNurse`  | `nurse.json`  |
| Patient | `/registerPatient`| `patient.json`|

- Open Postman and select POST method.

- Set the request URL to one of the above routes.

- Go to the Body tab → choose `binary`.

- Upload the respective JSON file for each roure

Important: After each registration, the API will return a mnemonic. Save the mnemonics from the doctor, nurse, and patient registrations  for future logins

#### 2. Retrieve Patient DID

- In Postman, set the method to POST and URL to http://localhost:8080/getRecord.

- Go to the Body tab → choose raw and select JSON format.

- Paste the patient's mnemonic in the following format:

```bash
{
    {
        "mnemonic": "PASTE_PATIENT_MNEMONIC_HERE"
    }

}
```




## Visit the App

Open [Curablock](http://localhost:5173) in your browser.


### Login with Mnemonics

- Use the mnemonic returned during registration (Doctor, Nurse, or Patient).

- Paste the saved mnemonic into the login input field on the home page.

- Click Login to authenticate as that user.


### User Roles & Capabilities

- **Doctor**
  - Register and login using mnemonic
  - Upload and update patient health records
  - Add test results and prescriptions

- **Nurse**
  - Login with mnemonic
  - View patient records
  - Assist with documentation

- **Patient**
  - Login with mnemonic
  - View personal health records
  - Share or revoke access

> Each user must first be registered via the backend API. The mnemonic received must be used to log in to the frontend.



---


## Disclaimer

This project is developed as part of academic research. Licensing terms can be updated based on deployment and production readiness.
