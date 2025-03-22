import { useLocation } from "react-router-dom";

import PatientLogin from "../components/patientLogin";
import ProviderLogin from "../components/doctorLogin";

const LoginPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get("role"); // Get role from URL query

    return (
        <div className="full-page">
          {role === "patient" ? <PatientLogin /> : role === "provider" ? <ProviderLogin /> : <p>Invalid Role</p>}
        </div>
      );
    };
    
    export default LoginPage;