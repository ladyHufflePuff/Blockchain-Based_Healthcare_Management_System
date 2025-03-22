import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { FaUserCog } from "react-icons/fa"; 

import Dashboard from "../components/patientDashboard";
import Appointment from "../components/patientAppointment";
import Record from "../components/patientRecords";
import AccessManagement from "../components/patientAccessManagement";
import AccountInformation from "../components/patientAccountInformation";

const PatientPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="patient-portal">
      <div className="sidebar">
        <nav>
          <button className={location.pathname === "/patient-portal/dashboard" ? "active" : ""} onClick={() => navigate("/patient-portal/dashboard")}
          > Dashboard
          </button>
          <button className={location.pathname === "/patient-portal/appointments" ? "active" : ""} onClick={() => navigate("/patient-portal/appointments")}
          > Appointments
          </button>
          <button className={location.pathname === "/patient-portal/records" ? "active" : ""} onClick={() => navigate("/patient-portal/records")}
          > Records
          </button>
          <button className={location.pathname === "/patient-portal/access-management" ? "active" : ""} onClick={() => navigate("/patient-portal/access-management")}
          > Access Management
          </button>
        </nav>
        <button className={`account-section ${location.pathname === "/patient-portal/account" ? "active" : ""}`}
          onClick={() => navigate("/patient-portal/account")}>
          <div className="icon-text-wrapper">
            <FaUserCog size={20} />
            <span>Account Information</span>
          </div>
        </button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientPortal;
