import React, {useState} from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

const DoctorDashboard = () => {
  const totalAppointments = 10;
  const completedAppointments = 6; // Change this dynamically
  const percentage = (completedAppointments / totalAppointments) * 100;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const appointments = {
    "2025-03-18": [
      { name: "Gary McLaren", type: "Craniotomy Follow-up", time: "13:00" },
      { name: "Susan Shaw", type: "Lumbar Puncture", time: "14:30" },
    ],
    "2025-03-23": [
      { name: "James Carter", type: "MRI Scan", time: "10:00" },
    ],
  };

  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Handle date selection and close modal
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <div>
      <div className="visuals">
        <div className="progress-container">
          <CircularProgressbar 
            value={percentage} 
            text={`${completedAppointments}/${totalAppointments}`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: "#007bff",
              textColor: "#000",
              trailColor: "#eee",
            })} 
          />
        </div>
        <div className="appointment-container">
          <p>0</p>
          <p>Appointments</p>
        </div>
        <div className="calendar-container">
          <button onClick={() => setIsCalendarOpen(true)}>
            <FaCalendarAlt /> {selectedDate.toLocaleDateString()}
          </button>
        </div>
      </div>
      <div>
        <div className="appointment-details"> Appointment Details</div>
        {appointments[formattedDate] ? (
          appointments[formattedDate].map((appt, index) => (
            <div className="dashboard-card">
              <div key={index} className="card-header">
                <span className="clinic">{appt.name}</span>
                <span className="date">{appt.type}</span>
                <span className="date">{appt.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No appointments for this date.</p>
        )}
      </div>
  
      <Modal isOpen={isCalendarOpen} onRequestClose={() =>      setIsCalendarOpen(false)} className="calendar-modal">
        <Calendar onChange={handleDateChange} value={selectedDate} />
      </Modal>
    </div>
    );
  };
  
  export default DoctorDashboard;
  