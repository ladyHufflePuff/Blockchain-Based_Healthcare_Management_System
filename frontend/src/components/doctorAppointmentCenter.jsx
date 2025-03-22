import React, {useState} from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { FaEdit, FaTrash} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";


const DoctorAppointmentCenter = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAppointment, setNewAppointment] = useState({ name: "", notes: "", patient: "", time: "08:00" ,duration: "30"});

  const [appointments, setAppointments] = useState({
    "2025-02-25": [
      { name: "Gary McLaren", type: "Craniotomy Follow-up", time: "13:00" },
      { name: "Susan Shaw", type: "Lumbar Puncture", time: "14:30" },
    ],
    "2025-03-17": [
      { name: "James Carter", type: "MRI Scan", time: "10:00" },
      
    ],
  });

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const disableNonWeekdays = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Get available times (8 AM - 5 PM), excluding booked slots
  const getBlockedTimes = () => {
    const blockedTimes = new Set();
    (appointments[formattedDate] || []).forEach((appt) => {
      const [startHour, startMinutes] = appt.time.split(":").map(Number);
      let blockedTime = new Date();
      blockedTime.setHours(startHour, startMinutes, 0, 0);
      const durationMinutes = parseInt(appt.duration, 10);

      for (let i = 0; i < durationMinutes; i += 30) {
        blockedTimes.add(blockedTime.toTimeString().slice(0, 5));
        blockedTime.setMinutes(blockedTime.getMinutes() + 30);
      }
    });

    return blockedTimes;
  };

  // Get available times (8:00 AM - 4:30 PM), removing booked slots
  const getAvailableTimes = () => {
    const blockedTimes = getBlockedTimes();
    return Array.from({ length: 17 }, (_, i) => {
      const hour = 8 + Math.floor(i / 2);
      const minutes = i % 2 === 0 ? "00" : "30";
      const time = `${String(hour).padStart(2, "0")}:${minutes}`;
      return blockedTimes.has(time) ? null : time;
    }).filter(Boolean);
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison
    if (date >= today) {
      setIsModalOpen(true); // Open modal only for today and future dates
      setEditingIndex(null);
      setShowForm(false);
      setNewAppointment({ name: "", type: "", time: "08:00", duration: "30" })
    };
  }

  const handleSaveAppointment = () => {
    if (newAppointment.type && newAppointment.name) {
      const updatedAppointments = { ...appointments };
      if (!updatedAppointments[formattedDate]) {
        updatedAppointments[formattedDate] = [];
      }

      if (editingIndex !== null) {
        // Update existing appointment
        updatedAppointments[formattedDate][editingIndex] = newAppointment;
        setEditingIndex(null);
      } else {
        // Add new appointment
        updatedAppointments[formattedDate].push(newAppointment);
      }

      setAppointments(updatedAppointments);
      setNewAppointment({ name: "", notes: "", patient: "", time: "08:00", duration: "30" });
      setIsModalOpen(false);
    }
  };
  const handleEditAppointment = (index) => {
    setEditingIndex(index);
    setNewAppointment(appointments[formattedDate][index]);
  };

  const handleDeleteAppointment = (index) => {
    const updatedAppointments = { ...appointments };
    updatedAppointments[formattedDate].splice(index, 1);
    if (updatedAppointments[formattedDate].length === 0) {
      delete updatedAppointments[formattedDate];
    }
    setAppointments(updatedAppointments);
  };

  return (
    <div>
      <div className="calendar">
      <Calendar
          onChange={handleDateClick}// Updates the selected date
          value={selectedDate}
          tileDisabled={disableNonWeekdays}
          tileContent={({ date, view }) => {
            const formattedDate = date.toISOString().split("T")[0];
            return appointments[formattedDate] ? <div className="event-indicator"></div> : null;
          }}
        />
      </div>
      <div>
        <div className="appointment-details"> Appointment History</div>
        <div className="list-items">
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
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>Appointments for {selectedDate.toDateString()}</h3>

        {appointments[formattedDate]?.length > 0 ? (
          <ul className="appointment-list">
            {appointments[formattedDate].map((appt, index) => (
              <div className="dashboard-card">
                <div className="card-header">
                <span> {appt.name}</span>
                <span> {appt.type}</span>
                <span>{appt.time}</span>
                <span>
                <FaEdit className="edit-icon" onClick={() => handleEditAppointment(index)} />
                <FaTrash className="delete-icon" onClick={() => handleDeleteAppointment(index)} />
                </span>
                
              </div>
              </div>
              
             
            ))}
          </ul>
        ) : (
          <p>No appointments scheduled for this date.</p>
        )}

<button className="add-appointment-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Appointment"}
        </button>

        {/* Appointment Form (only visible when button is clicked) */}
        {showForm && (
          <div className="appointment-form">
            <h4>{editingIndex !== null ? "Edit Appointment" : "New Appointment"}</h4>
            <div>
            <label>Appointment Name:</label>
            <input
              type="text"
              value={newAppointment.name}
              onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
            />
            </div>
          
            <div>
            <label>Type:</label>
            <input
              type="text"
              value={newAppointment.type}
              onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
            />
            </div>
           
            <div>
            <label>Time:</label>
            <select
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            >
              {getAvailableTimes().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            </div>
            <div>
            <label>Duration (minutes):</label>
            <input
              type="number"
              min="30"
              max="120"
              step="30"
              value={newAppointment.duration}
              onChange={(e) => setNewAppointment({ ...newAppointment, duration: e.target.value })}
            />
            </div>
    
            <button onClick={handleSaveAppointment} disabled={!newAppointment.name || !newAppointment.type}>
              {editingIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      </Modal>
  
    </div>
    );
  };
  
  export default DoctorAppointmentCenter;

  