// Import core React functionality
import React, { useState } from 'react';

// Import logout icon from react-icons
import { FaSignOutAlt } from 'react-icons/fa';

// Import route components for each user role
import LoginPage from './pages/loginPage';
import PatientPortal from "./pages/patientPortal";
import DoctorPortal from './pages/doctorPortal';
import NursePortal from './pages/nursePortal';

function App() {
  // Track the logged-in user (null if not logged in)
  const [user, setUser] = useState(null);

  // Controls visibility of "Sign Out" text on hover
  const [showText, setShowText] = useState(false);

  // Show header only if a user is logged in and has a valid role
  const showHeader = user !== null && (user.role === "patient" || user.role === "doctor" || user.role === "nurse");

  // Logout handler resets user state
  const handleLogout = async () => {
    setUser(null); 
  };

  return (
    <div className="app-container">
      {showHeader && (
        <header>
          {/* Logo and title */}
          <h1 className='logo'> 
            <img src='/logo.png' alt='Curablock Logo' />
            Curablock 
          </h1>

          {/* Logout icon and hover text */}
          <div
            className="logout-container"
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            onClick={handleLogout}
          >
            <FaSignOutAlt className='icon' />
            {showText && <span className="logout-text">Sign Out</span>}
          </div>
        </header>
      )}
 
      <main>
        {/* Render based on login state and user role */}
        {user === null ? ( 
          <LoginPage setUser={setUser} />   // Unauthenticated view
        ) : user.role === "patient" ? (
          <PatientPortal user={user} />     // Patient dashboard
        ) : user.role === "doctor" ? (
          <DoctorPortal user={user} />      // Doctor dashboard
        ) : user.role === "nurse" ? (
          <NursePortal user={user} />       // Nurse dashboard
        ) : (
          <LoginPage setUser={setUser} />   // Fallback login page
        )}
      </main>
    </div>
  );
}

export default App;
