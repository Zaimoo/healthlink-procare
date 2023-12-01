// AddStudentModal.js

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddStudentModal = ({ modalIsOpen, closeModal, handleAddStudent }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setbirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = async () => {
    const newStudent = {
      firstName,
      lastName,
      birthDate,
      gender,
      address,
      contactNumber,
    };

    handleAddStudent(newStudent);

  };

  return (
    <Modal show={modalIsOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='formFirstName'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter the First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formLastName'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter the Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formBirth'>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              className='mb-2'
              type='date'
              placeholder='Enter your date of birth'
              value={birthDate}
              onChange={(e) => setbirthDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formGender'>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              className='mb-2'
              onChange={(e) => setGender(e.target.value)}>
                <option>Select a Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId='formaAddress'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            className='mb-2'
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}>
          </Form.Control>
        </Form.Group>

          <Form.Group controlId='formContactNumber'>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              className='mb-2'
              type='text'
              placeholder='Enter the Contact Number'
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant='secondary' onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStudentModal;
