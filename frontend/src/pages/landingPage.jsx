import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="full-page">
      <h1 className="text-center">Login as</h1>
      <div className="role-selection">
        <button onClick={() => navigate("/login?role=provider")} className="btn btn-primary btn-role">
          Provider
        </button>
            
        <button onClick={() => navigate("/login?role=patient")} className="btn btn-primary btn-role">
          Patient
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
