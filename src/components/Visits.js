import React, { useState, useEffect } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import Button from 'react-bootstrap/Button';
import SignInModal from './components2/SignInModal';
import { useNavigate } from 'react-router-dom';
import { getAllVisits, openDB, getAllStudents, deleteVisitByDate, addAdmissionRequestToDB, getAllAdmissionRequests, VISITS_STORE_NAME, ADMISSION_REQUESTS_STORE_NAME, saveNotificationToDB } from '../indexedDB';
import { useFilter } from '../FilterContext';
import { Modal, Form } from 'react-bootstrap';
import '../css/visits.css';

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

function Visits({ userType, user }) {
  const { globalFilter } = useFilter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [admissionRequests, setAdmissionRequests] = useState([]);
  const [admissionType, setAdmissionType] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [admissionDate,setAdmissionDate] = useState([]);


  const columns = React.useMemo(
    () => [
      {
        Header: 'ID Number',
        accessor: 'idNumber',
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Admission Type',
        accessor: 'admissionType',
      },
      {
        Header: 'Symptoms',
        accessor: 'symptoms',
        Cell: ({ value }) => {
          return value ? value.join(', ') : '';
        },
      },
      {
        Header: 'Admission Date',
        accessor: 'visitDate',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable({ columns, data: visits }, useGlobalFilter);

  useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  useEffect(() => {
    const fetchVisits = async () => {
      const db = await openDB();
      const visitsData = await getAllVisits(db);
      const admissionRequestsData = await getAllAdmissionRequests(db);

      const filteredVisits = visitsData.filter((visit) =>
        Object.values(visit).some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
          )

      );
      setAdmissionRequests(admissionRequestsData)
      setVisits(filteredVisits.reverse());
    };

    fetchVisits();
  }, [globalFilter, visits]);

  const openModal = () => {
    openDB();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigate = useNavigate();

  const handleRowClick = async (row) => {
    if (deleteMode) {
      const selectedVisitDate = row.visitDate;
      console.log(selectedVisitDate)
      try {
        const db = await openDB();
        await deleteVisitByDate(db, selectedVisitDate);
        console.log(`Deleting visit with date: ${selectedVisitDate}`);

        const updatedVisits = await getAllVisits(db);
        setVisits(updatedVisits.reverse());
      } catch (error) {
        console.error('Error deleting visit data:', error);
      }
    } else {
      const selectedIdNumber = row.idNumber;

      try {
        const db = await openDB();
        const students = await getAllStudents(db);
        const selectedStudent = students.find((student) => student.idNumber === selectedIdNumber);

        if (selectedStudent) {
          setSelectedStudent(selectedStudent);
          navigate(`/patients/${selectedStudent.idNumber}`, { state: { selectedStudent } });
        } else {
          console.error(`Student with ID number ${selectedIdNumber} not found.`);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
  };

  const handleAdmissionRequest = async () => {
    try {
      const db = await openDB();
      console.log(user);
      const requestDate = new Date(admissionDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const requesterName = `${user.firstName} ${user.lastName}`;
      

      await addAdmissionRequestToDB(db, {
        requesterName,
        requesterID: user.idNumber,
        requestDate,
        admissionType,
        symptoms,
      });

      const updatedAdmissionRequests = await getAllAdmissionRequests(db);
      console.log(updatedAdmissionRequests);
      setAdmissionRequests(updatedAdmissionRequests);
    } catch (error) {
      console.error('Error adding admission request to IndexedDB:', error);
    }

    setModalIsOpen(false);
  };

  const admissionRequestsColumns = React.useMemo(
    () => [
      {
        Header: 'Requester Name',
        accessor: 'requesterName',
      },
      {
        Header: 'Request Date',
        accessor: 'requestDate',
      },
      {
        Header: 'Admission Type',
        accessor: 'admissionType',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        width: '20%',
        Cell: ({ row }) => ( // Use row instead of value
          <div style={{ marginLeft: '1rem' }}>
            <button
              style={{ marginRight: '1rem' }}
              className='default-btn'
              onClick={() => handleCheckAction(row.original)} // Pass the entire row.original
            >
              Check
            </button>
            <button
              className="red-btn"
              onClick={() => handleDeleteAction(row.original)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const admissionRequestsColumns2 = React.useMemo(
    () => [
      {
        Header: 'Requester Name',
        accessor: 'requesterName',
      },
      {
        Header: 'Request Date',
        accessor: 'requestDate',
      },
      {
        Header: 'Admission Type',
        accessor: 'admissionType'
      }
    ],
    []
  );
  

  const handleCheckAction = async (admissionRequest) => {
    try {
      const db = await openDB();
  
      const admissionRequester = admissionRequest.requesterName;
      const students = await getAllStudents(db);
      const correspondingStudent = students.find((student) => (student.firstName+ ' ' + student.lastName) === admissionRequester);
  
      if (correspondingStudent) {
        const visitData = {
          idNumber: correspondingStudent.idNumber,
          firstName: correspondingStudent.firstName,
          lastName: correspondingStudent.lastName,
          admissionType: admissionRequest.admissionType,
          symptoms: admissionRequest.symptoms, 
          visitDate: admissionRequest.requestDate,
        };

        const notificationData = {
          idNumber: correspondingStudent.idNumber,
          imageType: 'check',
          message: `The admission you requested on ${admissionRequest.requestDate} has been accepted!`
        }
  
        // Add the visit to the database
        await saveVisitToDB(db, visitData);
        await saveNotificationToDB(db, notificationData);
  
        // Update the visits state with the new data
        const updatedVisits = await getAllVisits(db);
        setVisits(updatedVisits);

        console.log('Visit added:', visitData);
        handleDeleteAction(admissionRequest)
      } else {
        console.log('Corresponding student not found.');
      }
    } catch (error) {
      console.error('Error checking admission request:', error);
    }
  };
  
  
  const handleDeleteAction = async (admissionRequest) => {
    try {
      const db = await openDB();
  
      // Delete the admission request from the database
      await deleteAdmissionRequestFromDB(db, admissionRequest.id);
  
      // Fetch the updated admission requests from the database
      const updatedAdmissionRequests = await getAllAdmissionRequests(db);
  
      // Update the state with the updated admission requests
      setAdmissionRequests(updatedAdmissionRequests.reverse());
  
      console.log(`Deleting admission request with ID: ${admissionRequest.id}`);
    } catch (error) {
      console.error('Error deleting admission request:', error);
    }
  };

  const {
    getTableProps: getAdmissionRequestsTableProps,
    getTableBodyProps: getAdmissionRequestsTableBodyProps,
    headerGroups: admissionRequestsHeaderGroups,
    rows: admissionRequestsRows,
    prepareRow: prepareAdmissionRequestsRow,
  } = useTable({ columns: admissionRequestsColumns, data: admissionRequests });

  const {
    getTableProps: getAdmissionRequestsTableProps2,
    getTableBodyProps: getAdmissionRequestsTableBodyProps2,
    headerGroups: admissionRequestsHeaderGroups2,
    rows: admissionRequestsRows2,
    prepareRow: prepareAdmissionRequestsRow2,
  } = useTable({ columns: admissionRequestsColumns2, data: admissionRequests });

  

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const rowClass = (row) => {
    return deleteMode ? 'delete-mode-row' : '';
  };

  return (
    <div>

    {userType === 'user' && (
    <div className='visits-container'>
        <div className='admission-requests-container'>
          <div className='admission-requests-head'><h2>Admission Requests</h2>
        <button className='default-btn' onClick={openModal}>Request Admission</button> </div>

        <table {...getAdmissionRequestsTableProps2()} className='admission-requests-table'>
          <thead>
            {admissionRequestsHeaderGroups2.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getAdmissionRequestsTableBodyProps2()}>
            {admissionRequestsRows2.map((row) => {
              prepareAdmissionRequestsRow2(row);
              return (
                <tr {...row.getRowProps()} className={rowClass(row)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal show={modalIsOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request Admissions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
<Form.Group>
            <Form.Label>Admission Date</Form.Label>
            <Form.Control type="datetime-local" className='mb-2' min={new Date().toISOString().slice(0, 16)}
            value={admissionDate}
            onChange={(e) => setAdmissionDate(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formSymptoms" className="mb-2">
            <Form.Label>What Are You Feeling?</Form.Label>
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
                  <option value="" disabled>Select</option>
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
              Add Option
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleAdmissionRequest}>
          Submit
        </Button>
        <Button variant='secondary' onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
    )}


    {userType === 'doctor' && (
            <div className='visits-container'>
                <div className='recent-visits-container'>
                <div className='recent-visits-header'>
                  <h2>Admissions List</h2>
                  <div className='recent-visits-button'>
                    <button className='default-btn' onClick={() => openModal()}>Admit</button>
                    <button className='red-btn' onClick={toggleDeleteMode}>
                      {deleteMode ? 'Cancel' : 'Delete'}
                    </button>
                  </div>
                </div>
        
                <table {...getTableProps()} className='visits-table'>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          onClick={() => handleRowClick(row.original)}
                          className={rowClass(row)}
                        >
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
        
              <div className='admission-requests-container'>
          <div className='admission-requests-head'>        <h2>Admission Requests</h2></div>

        <table {...getAdmissionRequestsTableProps()} className='admission-requests-table'>
          <thead>
            {admissionRequestsHeaderGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getAdmissionRequestsTableBodyProps()}>
            {admissionRequestsRows.map((row) => {
              prepareAdmissionRequestsRow(row);
              return (
                <tr {...row.getRowProps()} className={rowClass(row)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

        
              <SignInModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
              
          </div>
          )}
    </div>
  );
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

export async function deleteAdmissionRequestFromDB(db, admissionRequestId) {
  const transaction = db.transaction(ADMISSION_REQUESTS_STORE_NAME, 'readwrite');
  const objectStore = transaction.objectStore(ADMISSION_REQUESTS_STORE_NAME);

  await objectStore.delete(admissionRequestId);
}

export default Visits;
