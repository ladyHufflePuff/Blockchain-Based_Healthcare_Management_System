import { useLocation, useNavigate, Outlet } from "react-router-dom";

import DoctorDashboard from "../components/doctorDashboard";

const DoctorPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="patient-portal">
      <div className="sidebar">
        <div className="profile-section">
          <img src={"/person 6.png"} className="provider-pic" />
          <div>
            <p><b>Dr Patel Yushra</b></p>
            <p><i>Neurology</i></p>
          </div>
        </div>
        <nav>
          <button className={location.pathname === "/doctor-portal/dashboard" ? "active" : ""} onClick={() => navigate("/doctor-portal/dashboard")}
          > Dashboard
          </button>
          <button className={location.pathname === "/doctor-portal/patient-center" ? "active" : ""} onClick={() => navigate("/doctor-portal/patient-center")}
          > Patient Center
          </button>
          <button className={location.pathname === "/doctor-portal/appointments" ? "active" : ""} onClick={() => navigate("/doctor-portal/appointments")}
          > Appointment Center
          </button>
        </nav>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorPortal;
