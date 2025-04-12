import React, {useState} from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

import LandingPage from './pages/landingPage';
import PatientPortal from "./pages/patientPortal";
import DoctorPortal from './pages/doctorPortal';
import NursePortal from './pages/nursePage';

function App() {
  const [user, setUser] = useState(null);
  const [showText, setShowText] = useState(false);

  const showHeader = user !== null && (user.role === "patient" || user.role === "doctor" || user.role === "nurse");

  const handleLogout = async () => {
    setUser(null); 
  };

  return (
    <div className="app-container">
      {showHeader &&(
        <header>
          <h1 className='logo'> <img src='/logo.png'/>Curablock </h1>
          <div
          className="logout-container"
          onMouseEnter={() => setShowText(true)}
          onMouseLeave={() => setShowText(false)}
          onClick={handleLogout}>
          <FaSignOutAlt className='icon'/>
          {showText && <span className="logout-text">Sign Out</span>}
          </div>
        </header>

      )}
 
      <main>
        {user === null ? ( 
          <LandingPage setUser={setUser} /> 
        ) : user.role === "patient" ? (
          <PatientPortal user={user} />
        ) : user.role === "doctor" ? (
          <DoctorPortal user={user} />
        ): user.role === "nurse" ? (
          <NursePortal user={user} />
        ): (
          <LandingPage setUser={setUser} /> 
        )}
      </main>
    </div>
  );
}
export default App;
