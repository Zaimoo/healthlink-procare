// Sidebar.js
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { CiLogout } from 'react-icons/ci';
import { RxDashboard } from 'react-icons/rx';
import { IconContext } from 'react-icons';
import { BsPeople } from 'react-icons/bs'
import { IoFileTrayOutline } from 'react-icons/io5';
import { IoPersonOutline } from "react-icons/io5";

const Sidebar = ({ onLogout, userType, idNumber, student }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  useEffect(() => {
    console.log('ID NUMBER: ' + idNumber)
  }, [navigate])

  return (
    <IconContext.Provider value={{ size: '1.4em', className: 'icons' }}>
      <div className="sidebar">
        <div className='sidebar-header'>
          <h2 className='title-site'>HealthLink ProCare</h2>
        </div>

        <div className='sidebar-body'>
          <ul>
          {userType === "user" && (
              <li>
                <IoPersonOutline />
                <NavLink to={`/patients/${idNumber}`} state={{ user : student }}>Profile</NavLink>
              </li>
            )}
         {userType === "user" && (
              <li>
                <IoFileTrayOutline />
                <NavLink to="/admissions" activeClassName="active-link">Admissions</NavLink>
              </li>
            )}  
            {userType === "doctor" && (
               <li>
               <RxDashboard />
               <NavLink to="/" activeClassName="active-link">Dashboard</NavLink>
             </li>
            )}
            {userType === "doctor" && (
              <li>
                <BsPeople />
                <NavLink to="/patients" activeClassName="active-link">Patients</NavLink>
              </li>
            )}
            {userType === "doctor" && (
              <li>
                <IoFileTrayOutline />
                <NavLink to="/admissions" activeClassName="active-link">Admissions</NavLink>
              </li>
            )}
          </ul>
        </div>

        <div className='sidebar-footer'>
          <li onClick={handleLogout}>
            <CiLogout />
            <span>Logout</span>
          </li>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Sidebar;
