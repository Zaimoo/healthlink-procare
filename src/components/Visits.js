import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { getAllVisits, openDB, getAllStudents, deleteVisitByDate } from '../indexedDB';
import SignInModal from './components2/SignInModal';
import { useNavigate } from 'react-router-dom';

import '../css/visits.css'

function Visits() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      const db = await openDB();
      const visitsData = await getAllVisits(db);

      setVisits(visitsData.reverse());
    };

    fetchVisits();
  }, [visits]);

  const openModal = () => {
    openDB();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSignIn = () => {
    // Do something with selectedStudent data
    closeModal();
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
        // After deletion, you may want to fetch and update the visits list
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

    const columns = React.useMemo(
        () => [
          {
            Header: 'ID Number',
            accessor: 'idNumber',
            maxSize: 50, 
            minSize: 40, 
            size: 40,
            
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
            accessor: 'admissionType'
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
      } = useTable({ columns, data: visits });

      const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
      };
    
      const rowClass = (row) => {
        return deleteMode ? 'delete-mode-row' : '';
      };
    

      return (
        <div className='visits-container'>
          <div className='recent-visits-container'>
            <div className='recent-visits-header'>
              <h2>Admissions List</h2>
              <div className='recent-visits-button'>
                <Button onClick={() => openModal()}>Admit</Button>
                <Button variant="danger" onClick={toggleDeleteMode}>
                  {deleteMode ? 'Cancel' : 'Delete'}
                </Button>
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
          <SignInModal modalIsOpen={modalIsOpen} closeModal={closeModal} submit={handleSignIn} />
        </div>
      );
    }
export default Visits;