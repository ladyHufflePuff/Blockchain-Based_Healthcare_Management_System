import React, {useState, useEffect, useMemo} from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { FaEdit, FaTrash} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

import { useDoctor } from "../pages/doctorPortal";
import { fetchRecord, handleSaveAppointment, handleDeleteAppointment } from "../services/authService";

const DoctorAppointmentCenter = () => {
  const { doctorRecord, setDoctorRecord, user } = useDoctor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState([])
  const [accessiblePatients, setAccessiblePatients] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [blocked, setBlocked] = useState(new Set());
  const [newAppointment, setNewAppointment] = useState({ name: "", notes: "", patient: "", time: "" ,duration: ""});

  useEffect(() => {
    if (doctorRecord?.appointments) {
      setAppointments(doctorRecord.appointments);
    };  

    const fetchAccessiblePatients = async () => {
      if (!doctorRecord?.patientAccess || doctorRecord.patientAccess.length === 0) return;
      try {
        const patientRecords = await Promise.all(
          doctorRecord.patientAccess.map(async (entry) => {
            const did = entry.patient; 
            const record = await fetchRecord(did);
            return { name: record.name, did };
          })
        );
        setAccessiblePatients(patientRecords);
      } catch (err) {
        console.error("Failed to fetch patient records:", err);
      }
    };

    const updateAvailableTimes = () => {
      const allTimes = generateTimeSlots("08:00", "16:00", 30);
      const blocked = getBlockedTimes();
      const available = allTimes.filter((time) => !blocked.has(time));
      setAvailableTimes(available);
    };

    const blockedSet = getBlockedTimes();
    setBlocked(blockedSet); 
  
    updateAvailableTimes();
    fetchAccessiblePatients();
  }, [doctorRecord, appointments, selectedDate]);

  const formattedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("en-CA");
  }, [selectedDate]);  

  const disableNonWeekdays = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getBlockedTimes = () => {
    const blockedTimes = new Set();
    appointments.forEach((appt) => {
      if (appt.date === formattedDate) {
        const [startHour, startMinutes] = appt.time.split(":").map(Number);
        const duration = parseInt(appt.duration, 10); 
  
        const blockedStart = new Date();
        blockedStart.setHours(startHour, startMinutes, 0, 0);
  
        const end = new Date(blockedStart.getTime() + duration * 60000);
  
        const timeSlot = new Date(blockedStart);
        while (timeSlot < end) {
          const timeStr = timeSlot.toTimeString().slice(0, 5);
          blockedTimes.add(timeStr);
          timeSlot.setMinutes(timeSlot.getMinutes() + 30);
        }
      }
    });
    return blockedTimes;
  };

  const generateTimeSlots = (startTime, endTime, interval) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
  
    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);
  
    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);
  
    while (current <= end) {
      slots.push(current.toTimeString().slice(0, 5)); 
      current = new Date(current.getTime() + interval * 60000);
    }
  
    return slots;
  };
   
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (date >= today) {
      setIsModalOpen(true); 
      setShowForm(false);
      setNewAppointment({ patient: "", name: "", description:"", time: "", duration: "30" })
    };
  }

  const saveAppointment =  async () => {
    if (newAppointment.patient && newAppointment.name) {
      const appointmentWithDate = {
        ...newAppointment,
        date: formattedDate, 
      };
      await handleSaveAppointment(user, appointmentWithDate, setDoctorRecord);

      setAppointments((prev) => [...prev, appointmentWithDate]);
      
      setNewAppointment({
         patient: "", 
         name: "", 
         description: "", 
         time: "",
        duration: "30" });
      setIsModalOpen(false);
    }
  }; 

  return (
    <div>
      <div className="calendar">
      <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileDisabled={disableNonWeekdays}
          tileContent={({ date, view }) => {
            const formattedDate = date.toLocaleDateString("en-CA");
            const hasAppointment = appointments.some(appt => appt.date === formattedDate);
            return hasAppointment ? <div className="event-indicator"></div> : null;
          }}
        />
      </div>
      <div>
        <div className="appointment-details"> Appointment History</div>
        <div className="list-items">
          {appointments
            .filter((appt) =>{
              const apptDate = new Date(appt.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return(apptDate < today && appt.date === formattedDate);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((appt, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-header">
                <span className="clinic">{appt.patient}</span>
                <span className="date">{appt.name}</span>
                <span className="date">{appt.time}</span>
              </div>
            </div>
          ))}
          {appointments.filter(
            (appt) =>
              new Date(appt.date) < new Date() &&
              appt.date === formattedDate).length === 0 && (
              <p>No past appointments found.</p>
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

        {appointments.filter(appt => appt.date === formattedDate).length > 0 ? (
          <div className="appointment-list">
            {appointments
              .filter(appt => appt.date === formattedDate)
              .map((appt, index) => (
              <div className="dashboard-card">
                <div className="card-header">
                <span> {appt.patient}</span>
                <span> {appt.name}</span>
                <span>{appt.time}</span>
                <span>
                <FaTrash className="delete-icon" onClick={() => handleDeleteAppointment(user,appt, setDoctorRecord)} />
                </span>
                
              </div>
              </div>
              
             
            ))}
          </div>
        ) : (
          <p>No appointments scheduled for this date.</p>
        )}

        <button className="add-appointment-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Appointment"}
        </button>

        {showForm && (
          <div className="appointment-form">
            <h4>New Appointment</h4>
            <div>
            <label>Patient:</label>
            <select
              value={newAppointment.patient}
              onChange={(e) =>{
                const selectedDid = e.target.value;
                const selectedPatient = accessiblePatients.find(p => p.did === selectedDid);
                setNewAppointment({ ...newAppointment, 
                patient: selectedDid
              })
            }}
            >
              <option value="">Select a patient</option>
              {accessiblePatients.map((patient) => (
                <option key={patient.did} value={patient.did}>
                  {patient.name}
                </option>
              ))}
            </select>
            </div>

          
            <div>
            <label>Appointment Name:</label>
            <input
              type="text"
              value={newAppointment.name}
              onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
            />
            </div>
            <div>
            <label>Details:</label>
            <input
              type="text"
              value={newAppointment.description}
              onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
            />
            </div>
           
            <div>
            <label>Time:</label>
            <select
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            >
              {availableTimes.map((time) => (
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
    
            <button onClick={saveAppointment} disabled={!newAppointment.name && !newAppointment.patient}>
              Save
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

  