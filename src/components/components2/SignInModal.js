import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { openDB, STORE_NAME, VISITS_STORE_NAME, getAllStudents } from '../../indexedDB';

const symptomsOptions = [
  'Headache',
  'Cold',
  'Cough',
  'High Temperature',
  'Nausea',
  'Lower Abdomen Cramps',
  'Vomiting',
];

const admissionTypes = ['Inpatient', 'Outpatient'];


const SignInModal = ({ modalIsOpen, closeModal }) => {
  const [students, setStudents] = useState([]);
  const [admissionType, setAdmissionType] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const db = await openDB();
        const studentsData = await getAllStudents(db);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const submit = async () => {
    try {
      const db = await openDB();
      const selectedStudent = students.find((student) =>
        `${student.firstName} ${student.lastName}` === selectedStudentId
      );
  
      if (selectedStudent) {
        const visit = {
          idNumber: selectedStudent.idNumber,
          firstName: selectedStudent.firstName,
          lastName: selectedStudent.lastName,
          symptoms: symptoms,
          admissionType: admissionType, // New line
          visitDate: new Date(Date.now()).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };
  
        await saveVisitToDB(db, visit);
        closeModal();
      } else {
        alert("Student not found!");
      }
    } catch (error) {
      console.error("Error opening or accessing the database:", error);
    }
  };
  

  return (
    <Modal show={modalIsOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Admit Patient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStudent">
            <Form.Label>Select Student:</Form.Label>
            <Form.Control
              as="select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="" disabled>Select a student</option>
              {students.map((student) => (
                <option key={student.idNumber} value={`${student.firstName} ${student.lastName}`}>
                  {`${student.firstName} ${student.lastName}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAdmissionType" className="mb-2">
  <Form.Label>Admission Type:</Form.Label>
  <Form.Control
    as="select"
    value={admissionType}
    onChange={(e) => setAdmissionType(e.target.value)}
  >
    <option value="" disabled>Select an admission type</option>
    {admissionTypes.map((option, optionIndex) => (
      <option key={optionIndex} value={option}>
        {option}
      </option>
    ))}
  </Form.Control>
</Form.Group>


          <Form.Group controlId="formSymptoms" className="mb-2">
            <Form.Label>Symptoms:</Form.Label>
            {symptoms.map((symptom, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  as="select"
                  value={symptom}
                  onChange={(e) => {
                    const updatedSymptoms = [...symptoms];
                    updatedSymptoms[index] = e.target.value;
                    setSymptoms(updatedSymptoms);
                  }}
                >
                  <option value="" disabled>Select a symptom</option>
                  {symptomsOptions.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  variant="outline-danger"
                  className="ml-2"
                  onClick={() => {
                    const updatedSymptoms = [...symptoms];
                    updatedSymptoms.splice(index, 1);
                    setSymptoms(updatedSymptoms);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <br></br>
            <Button
              variant="outline-primary"
              onClick={() => setSymptoms([...symptoms, ""])}
            >
              Add Symptom
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={submit}>
          Submit
        </Button>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function getStudentByIdNumber(db, idNumber) {
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const objectStore = transaction.objectStore(STORE_NAME);
  const request = objectStore.get(idNumber);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const student = event.target.result;
      console.log('Retrieved student:', student);
      resolve(student || null);
    };

    request.onerror = (event) => {
      console.error('Error retrieving student:', event.target.error);
      reject(event.target.error);
    };
  });
}

async function saveVisitToDB(db, visit) {
  const transaction = db.transaction(VISITS_STORE_NAME, 'readwrite');
  const objectStore = transaction.objectStore(VISITS_STORE_NAME);
  const request = objectStore.add(visit);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export default SignInModal;
