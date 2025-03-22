const ProviderLogin = () => {
    return (
      <div className="login-form">
        <h2>Provider Login</h2>
        <form>
          <div className="mb-3">
            <label>Organization Code</label>
            <input type="text" className="form-control"/>
          </div>
          <div className="mb-3">
            <label>Access Code</label>
            <input type="password" className="form-control"/>
          </div>
          <button className="btn btn-primary ">Login</button>
        </form>
      </div>
    );
  };
  
  export default ProviderLogin;
  