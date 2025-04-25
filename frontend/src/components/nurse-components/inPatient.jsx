import { useState } from 'react';
import { BsPersonRaisedHand } from "react-icons/bs";
import { PiNotepadBold, PiSyringeFill } from "react-icons/pi";
import { IoIosFlask } from "react-icons/io";
import { RiMedicineBottleFill } from "react-icons/ri";
import { TbSoupFilled } from "react-icons/tb";
import { MdBathtub } from "react-icons/md";
import chimeSound from '/chime.mp3';

const DisplayPatientSchedule = () => {
  const [activePRNs, setActivePRNs] = useState({});

  // Toggles PRN state and plays chime if activating
  const handlePrnClick = (patientName) => {
    setActivePRNs(prev => {
      const isActive = prev[patientName];
      if (!isActive) {
        const audio = new Audio(chimeSound); 
        audio.play();
      }
      return { ...prev, [patientName]: !isActive };
    });
  };

  // Mock patient schedule data
  const patients = [
    {
      name: 'Eliza White',
      age: "25",
      gender: "F",
      room: '254-01',
      doctor: 'Dr. Mark Malunga',
      condition: 'Infection',
      picture: 'https://randomuser.me/api/portraits/women/44.jpg',
      allergies: ['cats', 'penicillin'],
      schedule: {
        '12:00': <TbSoupFilled style={{ fontSize: '1.6rem', color: '#f97316' }} />,
        '08:00': <RiMedicineBottleFill style={{ fontSize: '1.6rem', color: '#FF00FF' }} />,
        '14:00': <PiSyringeFill style={{ fontSize: '1.6rem', color: '#10b981' }} />
      }
    },
    {
      name: "Kingsley O'Brien",
      age: "32",
      gender: "M",
      room: '254-03',
      doctor: 'Dr. Mark Malunga',
      condition: 'Consumption',
      picture: 'https://randomuser.me/api/portraits/men/32.jpg',
      allergies: ['gluten', 'nuts'],
      schedule: {
        '07:00': <MdBathtub style={{ fontSize: '1.6rem', color: '#6366f1' }} />,
        '08:00': <TbSoupFilled style={{ fontSize: '1.6rem', color: '#f97316' }} />,
        '13:00': <TbSoupFilled style={{ fontSize: '1.6rem', color: '#f97316' }} />,
        '18:00': <PiSyringeFill style={{ fontSize: '1.6rem', color: '#10b981' }} />
      }
    }
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00',
    '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  return (
    <div className="patient-schedule-grid">
      {/* Header row */}
      <div className="grid-header">
        <div className="grid-cell header-cell"></div>
        {timeSlots.map((time, index) => (
          <div key={index} className="grid-cell header-cell">{time}</div>
        ))}
      </div>

      {/* Patient rows */}
      {patients.map((patient, pIndex) => (
        <div className="grid-row" key={pIndex}>
          <div className="grid-cell patient-info-cell">
            {/* Patient details section */}
            <div className="info">
              <div className="lvl1">
                <img src={patient.picture} className="provider-pic" />
                <div>
                  <h4>{patient.name}</h4>
                  <p>{patient.age} y.o / {patient.gender}</p>
                </div>
              </div>
              <div className="patient-details-text">
                <p>Attending: {patient.doctor}</p>
                <p>Condition: {patient.condition}</p>
                <p>Allergies: {patient.allergies?.length > 0 ? patient.allergies.join(', ') : 'None'}</p>
              </div>
            </div>

            {/* Action icons */}
            <div className="icons">
              <b>{patient.room}</b>
              <div className="icon-wrapper">
                <PiNotepadBold />
                <span>Orders</span>
              </div>
              <div className="icon-wrapper">
                <IoIosFlask />
                <span>Labs</span>
              </div>
              <div
                className={`icon-wrapper prn-icon ${activePRNs[patient.name] ? 'active' : 'inactive'}`}
                onClick={() => handlePrnClick(patient.name)}
                style={{ cursor: 'pointer' }}
              >
                <BsPersonRaisedHand />
                <span>PRN</span>
              </div>
            </div>
          </div>

          {/* Time slot cells with icons */}
          {timeSlots.map((time, tIndex) => (
            <div key={tIndex} className="grid-cell schedule-cell">
              <div className="schedule-icon">
                {patient.schedule[time] || null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisplayPatientSchedule;
