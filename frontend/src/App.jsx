import React, {} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import './App.css'

import LandingPage from './pages/landingPage';
import LoginPage from './pages/loginpage';
import PatientPortal from './pages/patientPortal';
import DoctorPortal from './pages/doctorPortal';
import Dashboard from "./components/patientDashboard";
import Appointment from "./components/patientAppointment";
import Record from "./components/patientRecords";
import AccessManagement from "./components/patientAccessManagement";
import AccountInformation from "./components/patientAccountInformation";
import DoctorDashboard from './components/doctorDashboard';
import DoctorPatientCenter from './components/doctorPatientCenter';
import DoctorAppointmentCenter from './components/doctorAppointmentCenter';
function App() {
  return (
    <Router>
      <div className="app-container">
        <header>CuraBlock</header>
        <main className="">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/patient-portal" element={<PatientPortal />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointment />} />
              <Route path="records" element={<Record />} />
              <Route path="access-management" element={<AccessManagement />} />
              <Route path="account" element={<AccountInformation />} />
            </Route>
            <Route path="/doctor-portal" element={<DoctorPortal />}>
            <Route path="patient-center" element={<DoctorPatientCenter />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointmentCenter />} />
            </Route> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App
