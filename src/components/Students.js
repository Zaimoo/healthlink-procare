import React, { useState, useEffect } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import AddStudentModal from './components2/AddStudentModal';
import { openDB, getAllStudents, saveStudentToDB, STORE_NAME } from '../indexedDB';
import { useNavigate } from 'react-router-dom';
import '../css/students.css'
import { useFilter } from '../FilterContext';

function Students() {
  const { globalFilter } = useFilter();
  const [students, setStudents] = useState([]);

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
        Header: 'Contact Number',
        accessor: 'mobileNumber',
      },
    ],
    []
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddStudent = async (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);

    const db = await openDB();
    await saveStudentToDB(db, newStudent);

    const updatedStudents = await getAllStudents(db);

    setStudents(updatedStudents);
    closeModal();
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter: setTableGlobalFilter,
} = useTable({ columns, data: students }, useGlobalFilter);

useEffect(() => {
  setTableGlobalFilter(globalFilter);
}, [globalFilter, setTableGlobalFilter]);


  const initializeDB = async () => {
    const db = await openDB();
    const students = await getStudentsByUserType(db, 'user');
    setStudents(students);
  };

  useEffect(() => {
    initializeDB();
  }, []);

const navigate = useNavigate();

const handleRowClick = (student) => {
  navigate(`/patients/${student.idNumber}`, { state: { student } });
};

  return (
      <div className='students-container'>
      <div className='student-list-container'>
        <div className='student-list-header'>
          <h2>Patients List</h2>    
          <button className='default-btn' onClick={openModal}>Add Patient</button>
        </div>

        <table {...getTableProps()} className="students-table">
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
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <AddStudentModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          handleAddStudent={handleAddStudent}
        />
      </div>

    </div>
  );
}

async function getStudentsByUserType(db, userType) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const idx = objectStore.index('roleTypeIDX')
    const cursor = idx.openCursor(userType);
    let patients = [];

    cursor.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        patients.push(cursor.value);
        cursor.continue();
      } else {
        resolve(patients);
      }

    };

    cursor.onerror = (event) => {
      reject(event.target.error);
    };

  });
}

export default Students;