import React, { useState, useEffect } from "react";
import { fetchRecord, postVitals } from "../../client";
import { useNurse } from "../../pages/nursePortal";

const PostConsultation = () => {
  const { user, nurseRecord } = useNurse();
  const [hasFetched, setHasFetched] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
  });

  // Fetch list of doctors only once when nurseRecord is available
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (
        nurseRecord?.avaliableDoctors &&
        Array.isArray(nurseRecord.avaliableDoctors) &&
        !hasFetched
      ) {
        const fetchedDoctors = await Promise.all(
          nurseRecord.avaliableDoctors.map(async (doctorObj) => {
            try {
              const doctorData = await fetchRecord(doctorObj.did);
              return {
                did: doctorObj.did,
                name: doctorData.name || "Unknown",
                specialty: doctorData.specialty || "General",
                consultations: doctorData.consultations || [],
              };
            } catch (error) {
              console.error(`Failed to fetch doctor with DID ${doctorObj.did}`, error);
            }
          })
        );

        setDoctors(fetchedDoctors);
        setHasFetched(true);
      }
    };

    fetchDoctorDetails();
  }, [nurseRecord, hasFetched, formData]);

  // Handle field change in form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate that all fields are filled
  const isFormValid = () => {
    return (
      formData.doctor &&
      formData.patient &&
      formData.bloodPressure &&
      formData.heartRate &&
      formData.temperature &&
      formData.weight &&
      formData.height
    );
  };

  // Submit vitals to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    try {
      await postVitals(formData, setFormData);
    } catch (error) {
      console.error("Error posting vitals:", error);
      alert("Failed to post vitals.");
    }
  };

  return (
    <div>
      <div className="info-card">
        <h2>Consultation Posting</h2>
        <form onSubmit={handleSubmit} className="details">
          <div className="column">
            {/* Doctor selection */}
            <div className="form-group">
              <label><strong>Doctor:</strong></label>
              <select 
                name="doctor" 
                value={formData.doctor} 
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a doctor</option>
                {doctors?.length > 0 ? (
                  doctors.map((doctor) => (
                    <option key={doctor.did} value={doctor.did}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))
                ) : (
                  <option disabled>No doctors available</option>
                )}
              </select>
            </div>

            {/* Patient and vitals input */}
            <div className="form-group">
              <label><strong>Patient Name:</strong></label>
              <input type="text" name="patient" value={formData.patient} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><strong>Blood Pressure:</strong></label>
              <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><strong>Heart Rate:</strong></label>
              <input type="text" name="heartRate" value={formData.heartRate} onChange={handleChange} required />
            </div>
          </div>

          <div className="column">
            <div className="form-group">
              <label><strong>Temperature:</strong></label>
              <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><strong>Weight:</strong></label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><strong>Height:</strong></label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} required />
            </div>

            {/* Submit button */}
            <button type="submit" className="postButton" disabled={!isFormValid()}>
              Post Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostConsultation;
