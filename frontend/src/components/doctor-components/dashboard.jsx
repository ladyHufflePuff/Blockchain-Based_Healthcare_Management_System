import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

import { useDoctor } from "../../pages/doctorPortal";
import { fetchRecord } from "../../client";

const DoctorDashboard = () => {
  // Access doctor's data from context
  const { doctorRecord } = useDoctor();

  // State for currently selected calendar date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Toggle calendar modal
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Appointments and consultations from doctor's record
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);

  // Load appointments and consultations when doctor record or date changes
  useEffect(() => {
    if (doctorRecord?.appointments) {
      setAppointments(doctorRecord.appointments);
    }
    if (doctorRecord?.consultations) {
      setConsultations(doctorRecord.consultations);
    }
  }, [doctorRecord, selectedDate]);

  // Format selected date for comparison
  const formattedDate = selectedDate.toLocaleDateString("en-CA");

  // Get consultations scheduled for the selected date
  const consultationsForSelectedDate = consultations.filter(
    (consult) => consult.date === formattedDate
  );

  // Filter consultations that have been marked as completed
  const completedConsultations = consultationsForSelectedDate.filter(
    (consult) => consult.consulted !== false
  );

  // Count total and completed consultations for progress tracking
  const totalAppointments = consultationsForSelectedDate.length;
  const completedAppointments = completedConsultations.length;

  // Compute completion percentage for the progress bar
  const percentage =
    totalAppointments > 0
      ? (completedAppointments / totalAppointments) * 100
      : 0;

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(
    (appt) => appt.date === formattedDate
  );

  // Disable selection of past dates and weekends on the calendar
  const tileDisabled = ({ date }) => {
    const isPast = date < new Date().setHours(0, 0, 0, 0);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return isPast || isWeekend;
  };

  // Add a visual indicator on calendar days that have appointments
  const tileContent = ({ date }) => {
    const isDisabled = tileDisabled({ date });
    if (isDisabled) return null;

    const dateStr = date.toLocaleDateString("en-CA");
    const hasAppointments = appointments.some(appt => appt.date === dateStr);
    return hasAppointments ? <div className="event-indicator" /> : null;
  };

  // Handle date change from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <div>
      {/* Visual Summary Section */}
      <div className="visuals">
        {/* Circular progress bar for consultations */}
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

        {/* Display number of appointments */}
        <div className="appointment-container">
          <p>{appointmentsForSelectedDate.length}</p>
          <p>Appointments</p>
        </div>

        {/* Calendar trigger button */}
        <div className="calendar-container">
          <button onClick={() => setIsCalendarOpen(true)}>
            <FaCalendarAlt /> {selectedDate.toLocaleDateString()}
          </button>
        </div>
      </div>

      {/* Appointment details section */}
      <div>
        <div className="appointment-details"> Appointment Details</div>
        {appointmentsForSelectedDate.length > 0 ? (
          appointmentsForSelectedDate.map((appt, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-header">
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

      {/* Calendar Modal for date picking */}
      <Modal
        isOpen={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}
        className="calendar-modal"
      >
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
