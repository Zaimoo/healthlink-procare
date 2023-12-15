// StudentDetails.js

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import AddReadingModal from './components2/AddReadingModal';
import '../css/studentdetails.css';
import {
  openDB,
  getAllVisits,
  saveReadingToDB,
  getAllReadings,
  READINGS_STORE_NAME,
} from '../indexedDB';

const StudentDetails = ({user}) => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [student, setStudent] = useState(null);
  const [studentType, setStudentType] = useState('');
  const [readings, setReadings] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [updateReadingsTrigger, setUpdateReadingsTrigger] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!student) {
        return;
      }

      const db = await openDB();

      // Fetch visits
      const visitsData = await getAllVisits(db);
      if (isMounted) {
        setVisits(visitsData.reverse());
      }

    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [student]);

  useEffect(() => {
    const fetchReadings = async () => {
      if (!student) {
        return;
      }
  
      const db = await openDB();
      
      const readingsData = await getReadingsByID(db, student.idNumber);
      setReadings(readingsData);
  
      setLatestReading(readingsData.length > 0 ? readingsData[readingsData.length - 1] : null);
    }
  
    fetchReadings();
  }, [updateReadingsTrigger]);
  

  useEffect(() => {
    const { state } = location;
    console.log(state)
    let studentID;
    if (state && state.student) {
      setStudent(state.student);
      setStudentType('student');
      studentID=state.student.idNumber;
    } else if (state && state.selectedStudent) {
      setStudent(state.selectedStudent);
      setStudentType('selectedStudent');
      studentID = state.selectedStudent.idNumber;
    } else if (state && state.user) {
      setStudent(state.user);
      setStudentType('selectedStudent');
      studentID = state.user.idNumber;
    }


    const fetchReadings = async () => {
      const db = await openDB();
      
      const readingsData = await getReadingsByID(db, studentID);
      setReadings(readingsData);

      
      setLatestReading(readingsData.length > 0 ? readingsData[readingsData.length - 1] : null);
    }

    fetchReadings()
  }, [location, updateReadingsTrigger]);

  useEffect(() => {
    setFilteredVisits(visits.filter((visit) => visit.idNumber === student.idNumber));
  }, [visits, student]);

  if (!student) {
    return <div>Loading...</div>;
  }
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddReading = async (newReading) => {
    const readingsWithStudentID = {
      ...newReading,
      idNumber: student.idNumber,
    };
    
    setReadings((prevReadings) => [...prevReadings, readingsWithStudentID]);

    const db = await openDB();
    await saveReadingToDB(db, readingsWithStudentID);

    setUpdateReadingsTrigger((prev) => !prev);
    
    closeModal();
  };


  return (
    <>
      <div className='details-container'>
        <div className='back-button-container'>
          {studentType === 'selectedStudent' ? (
            <Link to='/admissions' className='back-button'>
              <IoMdArrowRoundBack /> Back to Admissions
            </Link>
          ) : (
            <Link to='/patients' className='back-button'>
              <IoMdArrowRoundBack /> Back to Patients List
            </Link>
          )}
        </div>

        <div className='details-content'>
          <div className='details-header'>
            <h1>{student.firstName} {student.lastName}'s Profile</h1>
          </div>

          <div className='details-body'>
            <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>ID Number: </strong>{student.idNumber}</p>
            <p><strong>Date of Birth:</strong> {new Date(student.birthDate).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Contact Number:</strong> {student.mobileNumber}</p>
            <p><strong>Emergency Contact Number:</strong> {student.emergencyNumber}</p>
          </div>
        </div>

        <div className='readings-container'>
          <div className='readings-header'>
            <h2>Readings</h2>
            {user.roleType === 'doctor' && (
              <button className='default-btn' onClick={() => setModalIsOpen(true)}>
              Add Reading
            </button>
            )}
          
          </div>
          <div className='readings-body'>
            {latestReading && (
              <div>
                <p><strong>Latest Reading:</strong></p>
                <p><strong>Height:</strong> {latestReading.height || 'N/A'}</p>
                <p><strong>Weight:</strong> {latestReading.weight || 'N/A'}</p>
                <p><strong>Temperature:</strong> {latestReading.temperature || 'N/A'}</p>
                <p><strong>Blood Pressure:</strong></p>
                <div style={{ marginLeft: '3rem' }}>
                  <p><strong>Systolic:</strong> {latestReading.systolic || 'N/A'}</p>
                  <p><strong>Diastolic:</strong> {latestReading.diastolic || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='visit-history-container'>
          <div className='visit-history-header'>
            <h2>Upcoming Admissions</h2>
          </div>
          <div className='visit-history-content'>
            {filteredVisits.map((visit) => (
              <div className='visit-history' key={visit.id}>
                <h4>{visit.visitDate}</h4>
                <span><strong>Admission Type:</strong> {visit.admissionType}</span>
                <br />
                <span><strong>Symptoms:</strong> {visit.symptoms.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddReadingModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        handleAddReading={handleAddReading}
        studentID={student.idNumber}
      />
    </>
  );
};

async function getReadingsByID(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(READINGS_STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(READINGS_STORE_NAME);
    const idx = objectStore.index('idNumIDX');
    const cursor = idx.openCursor(id);

    let readings = [];

    cursor.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        readings.push(cursor.value);
        cursor.continue();
      } else {
        resolve(readings);
      }

    };

    cursor.onerror = (event) => {
      reject(event.target.error);
    };

  });
}

export default StudentDetails;


