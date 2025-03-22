const PatientLogin = () => {
    return (
      <div className="login-form">
        <h2>Patient Login</h2>
        <form>
          <div className="mb-3">
            <label>Passkey</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  };
  
  export default PatientLogin;
  