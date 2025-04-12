import { useState } from "react";
import { handleLogin } from "../services/authService";

const LandingPage = ({setUser}) => {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(null);
  
  return(
    <div className="full-page">
      <div className="login-form">
        <div className="header">
          <img src='/public/logo.png'/>
          <h1> Sign In to Curablock </h1>
        </div>
        <form onSubmit={(event) =>{
          event.preventDefault();
          handleLogin(passphrase, setUser, setError);
        }}>
          <h5><i>Enter Passphrase </i></h5>
          <div className="mb-3">
            <input type="text"
             className="form-control" 
             value={passphrase} 
             onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button  type="submit">Login</button>
        </form>
        
      </div>
    </div>
  );
};

export default LandingPage;
