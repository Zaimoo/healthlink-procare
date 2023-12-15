import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {openDB, getAllStudents, saveStudentToDB} from './indexedDB.js'
import NavBar from './navbar';
import Students from './components/Students';
import Dashboard from './components/Dashboard';
import Visits from './components/Visits';
import StudentDetails from './components/StudentDetails';
import User from './components/User';
import Register from './components/Register.js';
import './navbar.css';
import './css/app.css';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token') || null;
  });

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const mockUser = 
    {
      firstName: 'user',
      lastName: 'example',
      email: 'user@example.com',
      password: 'password1',
      roleType: 'user',
      birthDate: '2001-01-01',
      emergencyNumber: '09315828492',
      gender: 'Male',
      mobileNumber: '09331063386',
      address: 'Tibanga',
      idNumber: 1
    }
  const mockDoctor = {
      firstName: 'doctor',
      lastName: 'example',
      email: 'doctor@example.com',
      password: 'password2',
      roleType: 'doctor',
      birthDate: '2001-01-01',
      emergencyNumber: '09315828492',
      gender: 'Male',
      mobileNumber: '09331063386',
      address: 'Tibanga',
      idNumber: 2
    }


  useEffect(() => {
    const applyMockData = async () => {
      try {
        const db = await openDB();
        const users = await getAllStudents(db);
        const mockUserDB = users.find((user) =>  mockUser.firstName === user.firstName);
        const mockDoctorDB = users.find((user) => mockDoctor.firstName === user.firstName );
        console.log(mockDoctorDB, mockDoctorDB);

        if(!mockUserDB && !mockDoctorDB) {
          saveStudentToDB(db, mockUser);
          saveStudentToDB(db, mockDoctor);
          console.log('Mock User and Doctor added to database successfully.');
        } else {
          return;
        }
        

      } catch (e){
        console.log('Error: ' + e);
      }
    }

    applyMockData();
  }, [])

  useEffect(() => {
    console.log('Effect started');
  
    const fetchUserDetails = async () => {
      try {
        const db = await openDB();
        console.log('Opened DB successfully');
  
        const students = await getAllStudents(db);
        console.log('Fetched students from IndexedDB:', students);

  
        const foundUser = students.find((student) => student.idNumber === parseInt(token));
  
        if (foundUser) {
          setUserType(foundUser.roleType);
          setUser(foundUser);
        } else {
          console.error('User not found in IndexedDB');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user details from IndexedDB', error);
      }
    };
  
    if (token) {
      fetchUserDetails();
    } else {
      setUser(null);
      setUserType("");
      navigate('/');
    }
  
    console.log('Effect finished');
  }, [token, navigate]);
  
  


  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null); // Reset user state on logout
    setUserType("");
    navigate('/');
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  

  return (
    <div className="app-container">
      <Sidebar onLogout={handleLogout} userType={userType} student={user} />
      <div className="main-content">
        <NavBar userName={user ? user.firstName : 'null'} user= {user} />
        {!token && (
          <Routes>
            <Route path='/register' element={<Register />} />
          </Routes>
        )}
        <Routes>
          <Route path="/" element={userType === 'doctor' ? <Dashboard /> : <Visits usertType={userType} user={user} />} />
          <Route path="/patients" element={<Students />} />
          <Route path="/admissions" element={<Visits userType={userType} user={user} />} />
          <Route path="/patients/:idNumber" element={<StudentDetails user={user}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;