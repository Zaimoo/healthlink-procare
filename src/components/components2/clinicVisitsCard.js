
import React from 'react';

const ClinicVisitsCard = ({ visits, patientCount }) => {
  
  return (
    <div className='cards'>
      <div className="clinic-visits-card">
        <h5>Total Patients</h5>
        <span>Count: {patientCount}</span>
      </div>

      <div className="clinic-visits-card">
        <h5>Total Admissions</h5>
        <span>Count: {visits}</span>
      </div>

    </div>
  );
};

export default ClinicVisitsCard;
