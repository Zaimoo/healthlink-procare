
import React, { useState } from 'react';
import { Modal, Form, Button, FormLabel } from 'react-bootstrap';
import { openDB, saveStudentToDB, getAllStudents } from '../indexedDB';
import '../css/register.css'

const Register = ({modalIsOpen, closeModal}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [address, setAddress] = useState('');
  const [roleType, setRoleType] = useState('');


  const handleSubmit = async () => {
    const newPatient = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      birthDate: birthDate,
      gender: gender,
      mobileNumber: mobileNumber,
      emergencyNumber: emergencyNumber,
      address: address,
      roleType: roleType,
    };

    const db = await openDB();
    await saveStudentToDB(db, newPatient);
    alert('You have successfully registered!');
    closeModal();
  };

  return (
    <>

      <Modal show={modalIsOpen} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
                    <Form.Group className='register-forms' size='lg' controlId='registerFirstName'>
                        <FormLabel>First Name</FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='First Name'
                                    onChange = {(e) => setFirstName(e.target.value)}
                                    />
                                        
                            
                    </Form.Group>

                    <Form.Group className='register-forms' size='lg' controlId='registerLastName'>
                        <FormLabel>Last Name</FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='Last Name'
                                    onChange = {(e) => setLastName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='register-forms' size='lg' controlId='registerEmail'>
                        <FormLabel>Email </FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='Email'
                                    onChange = {(e) => setEmail(e.target.value)} />

                    </Form.Group>

                    <Form.Group className='register-forms' size='lg' controlId='registerPassword'>
                        <FormLabel>Password </FormLabel>
                        <Form.Control autoFocus
                                    type='password'
                                    placeholder='Password'                        
                                    onChange = {(e) => setPassword(e.target.value)} />

                    </Form.Group>

                    <Form.Group className='register-forms' size='lg' controlId='registerNumber'>
                        <FormLabel>Mobile Number</FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='Mobile Number'                        
                                    onChange = {(e) => setMobileNumber(e.target.value)} />
                    </Form.Group>

                    <Form.Group className='register-forms' size='lg' controlId='registerEmergencyNumber'>
                        <FormLabel>Emergency Number</FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='Emergency Number'                        
                                    onChange = {(e) => setEmergencyNumber(e.target.value)} />
                    </Form.Group>

                        <div className='role-gender-birthdate-container'>
                        <Form.Group size='lg' controlId='registerRole'>
                                                <FormLabel>Role Type</FormLabel>
                                                <Form.Select autoFocus                    
                                                            onChange = {(e) => setRoleType(e.target.value)}>
                                                                <option>Select Role</option>
                                                                <option>user</option>
                                                                <option>doctor</option>
                                                                <option>administrator</option>
                                                            </Form.Select>
                                            </Form.Group>


                                            <Form.Group className='register-gender-container'size='lg' aria-label='Selected Gender' controlId='registerGender'>
                                            <FormLabel>Gender</FormLabel>
                                                <Form.Select autoFocus
                                                            onChange = {(e) => setGender(e.target.value)}>
                                                                <option>Select a Gender</option>
                                                                <option>Male</option>
                                                                <option>Female</option>
  </Form.Select>

      </Form.Group>

            <Form.Group size='lg' controlId='registerBirthDate'>
                  <FormLabel>Date of Birth </FormLabel>
                        <Form.Control autoFocus
                                                            type='date'                    
                                                            onChange = {(e) => setBirthDate(e.target.value)} />

                                            </Form.Group>
                        </div>
                    <Form.Group className='register-forms' size='lg' controlId='registerAddress'>
                        <FormLabel>Address </FormLabel>
                        <Form.Control autoFocus
                                    type='text'
                                    placeholder='Address'  
                                    onChange = {(e) => setAddress(e.target.value)} />

                    </Form.Group>
                    
                </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Register;
