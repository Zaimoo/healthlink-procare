
import React from 'react';

const ClinicVisitsCard = ({ visits }) => {
  
  return (
    <div className='cards'>
      <div className="clinic-visits-card">
        <h3>Total Admissions</h3>
        <p>Count: {visits}</p>
      </div>

      <div className="clinic-visits-card">
        <h3>Total Admissions</h3>
        <p>Count: {visits}</p>
      </div>

      <div className="clinic-visits-card">
        <h3>Total Admissions</h3>
        <p>Count: {visits}</p>
      </div>
    </div>
  );
};

export default ClinicVisitsCard;
