// AddReadingModal.js

import React, {useState} from 'react';
import { Modal, Form, Button } from 'react-bootstrap';


const AddReadingModal = ({ isOpen, onClose, handleAddReading }) => {
  const [height,setHeight] = useState('');
  const [weight,setWeight] = useState('');
  const [systolic,setSystolic] = useState('');
  const [diastolic,setDiastolic] = useState('');
  const [temperature,setTemperature] = useState('');
  

  const handleSubmit = async () => {
    const newReading = {
      height,
      weight,
      systolic,
      diastolic,
      temperature,
    };
    handleAddReading(newReading);

  };
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Reading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='height'>
            <Form.Label>Height</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter height'
              name='height'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='weight'>
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter weight'
              name='weight'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='temperature'>
            <Form.Label>Temperature</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter temperature'
              name='temperature'
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='systolic'>
            <Form.Label>Systolic</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter systolic pressure'
              name='systolic'
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='diastolic'>
            <Form.Label>Diastolic</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter diastolic pressure'
              name='diastolic'
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReadingModal;
