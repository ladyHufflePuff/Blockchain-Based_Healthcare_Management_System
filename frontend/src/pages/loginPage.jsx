import { useState } from "react";
import { handleLogin } from "../client";

const LoginPage = ({ setUser }) => {
  // State to hold the user-entered passphrase (mnemonic)
  const [passphrase, setPassphrase] = useState("");
  // State to capture and display any login error
  const [error, setError] = useState(null);
  
  return (
    <div className="full-page">
      <div className="login-form">
        <div className="header">
          <img src='/public/logo.png'/>
          <h1> Sign In to Curablock </h1>
        </div>

        {/* Login form submission triggers handleLogin function */}
        <form onSubmit={(event) => {
          event.preventDefault();
          handleLogin(passphrase, setUser, setError); // Auth logic: resolves user or throws error
        }}>
          <h5><i>Enter Passphrase </i></h5>
          <div className="mb-3">
            {/* Controlled input for passphrase */}
            <input 
              type="text"
              className="form-control"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>

          {/* Displays any login-related errors */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Login</button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPage;
