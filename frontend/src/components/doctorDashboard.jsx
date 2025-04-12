import React, {useState, useEffect} from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

import { useDoctor } from "../pages/doctorPortal";
import { fetchRecord } from "../services/authService";

const DoctorDashboard = () => {
  const {doctorRecord} = useDoctor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
   const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    if (doctorRecord?.appointments) {
      setAppointments(doctorRecord.appointments);
    };  
    if (doctorRecord?.consultations) {
      setConsultations(doctorRecord.consultations);
    };
  
  }, [doctorRecord, selectedDate]);

  const formattedDate = selectedDate.toLocaleDateString("en-CA");

  const consultationsForSelectedDate = consultations.filter(
    (consult) => consult.date === formattedDate
  );
  
  const completedConsultations = consultationsForSelectedDate.filter(
    (consult) => consult.consulted !== false 
  );
  
  const totalAppointments = consultationsForSelectedDate.length;
  const completedAppointments = completedConsultations.length;
  const percentage =
    totalAppointments > 0
      ? (completedAppointments / totalAppointments) * 100
      : 0;

  const appointmentsForSelectedDate = appointments.filter(
    (appt) => appt.date === formattedDate
  );

  const tileDisabled = ({ date }) => {
    const isPast = date < new Date().setHours(0, 0, 0, 0);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return isPast || isWeekend;
  };

  const tileContent = ({ date }) => {
    const isDisabled = tileDisabled({ date });
    if (isDisabled) return null;
    
    const dateStr = date.toLocaleDateString("en-CA");
    const hasAppointments = appointments.some(appt => appt.date === dateStr);
    return hasAppointments ? <div className="event-indicator" /> : null;
  };

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
              pathColor: "#43A000",
              textColor: "#000",
              trailColor: "#8d8e8b4e",
            })} 
          />
        </div>
        <div className="appointment-container">
          <p>{appointmentsForSelectedDate.length}</p>
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
        {appointmentsForSelectedDate.length > 0 ? (
          appointmentsForSelectedDate.map((appt, index) => (
            <div className="dashboard-card" key={index}>
              <div  className="card-header">
                <span className="clinic">{appt.patient}</span>
                <span className="date">{appt.name}</span>
                <span className="date">{appt.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No appointments for this date.</p>
        )}
      </div>
  
      <Modal isOpen={isCalendarOpen} onRequestClose={() =>      setIsCalendarOpen(false)} className="calendar-modal">
        <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
        tileDisabled={tileDisabled}
        tileContent={tileContent}
        />
      </Modal>
    </div>
    );
  };
  
  export default DoctorDashboard;
  