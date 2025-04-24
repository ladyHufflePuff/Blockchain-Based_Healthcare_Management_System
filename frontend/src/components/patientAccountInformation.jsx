import { usePatient } from "../pages/patientPortal";

const AccountInformation = () => {
  const { patientRecord } = usePatient();
  
  return (
    <div className="info-card">
      <div className="profile-section">
        <img src={patientRecord?.profilePicture} className="profile-pic" />
      </div>
      <div className="details">
        <div className="column">
          <p><strong>Name:</strong> {patientRecord?.name}</p>
          <p><strong>DOB:</strong> {patientRecord?.dob}</p>
          <p><strong>Mobile:</strong> {patientRecord?.mobileNumber}</p>
          <p><strong>Emergency Contact:</strong> {patientRecord?.emergencyContact.name}</p>
        </div>
        <div className="column">  
          
          <p><strong>Insurance Provider:</strong> {patientRecord?.insuranceDetails.providerName}</p>
          <p><strong>Insurance Number:</strong> {patientRecord?.insuranceDetails.policyNumber}</p>
          <p><strong>Insurance Expiry Date:</strong> {patientRecord?.insuranceDetails.policyExpiryDate}</p>  
          <p><strong>Insurance Coverage Balance:</strong> ${patientRecord?.insuranceDetails.coverageBalance}</p>         
        </div>
      </div>
    </div>
    
    );
  };
  
  export default AccountInformation
  