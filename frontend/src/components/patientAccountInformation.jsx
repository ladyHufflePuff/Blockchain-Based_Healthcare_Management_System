const AccountInformation = () => {
    const patient = {
        profilePic: "/public/person 6.png", // Make sure the image is in the public folder
        name: "John Doe",
        min: " 123456789",
        dob: " 05-12-1990",
        email: "johndoe@email.com",
        mobile: "+1 234 567 8901",
        emergencyContact: "+1 987 654 3210",
      };
    return (
      <div className="patient-card">
        <div className="profile-section">
          <img src={patient.profilePic} className="profile-pic" />
        </div>
        <div className="details">
            <div className="column">
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>MIN:</strong> {patient.min}</p>
                <p><strong>DOB:</strong> {patient.dob}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Mobile:</strong> {patient.mobile}</p>
                <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
            </div>
            <div className="column">
              
            </div>
        </div>
      </div>
    
    );
  };
  
  export default AccountInformation
  