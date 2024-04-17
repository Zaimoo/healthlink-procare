import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../css/login.css";
import PropTypes from "prop-types";
import Register from "./Register";
import {openDB, getAllStudents } from '../indexedDB'

const Login = ({ setToken }) => {
  Login.propTypes = {
    setToken: PropTypes.func.isRequired,
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const token = await loginUser({
        email,
        password,
      });

      sessionStorage.setItem("token", token);

      setToken(token);
    } catch (error) {
      setShakeError(true);
      setError(true)

      // Reset the shake animation after a short delay (0.5s)
      setTimeout(() => {
        setShakeError(false);
      }, 1000);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>HealthLink ProCare</h2>
        { error && (
        <div className={`error-message${shakeError ? ' shake' : ''}`}>
          <span>Invalid Email or Password!</span>
        </div>
        )
        }
        
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="login-buttons">
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Login
            </Button>
            <Button variant="primary" className="default-btn" onClick={openModal}>
            Register
            </Button>
          </div>
        </Form>

        <Button>
          
        </Button>

      <Register modalIsOpen={modalIsOpen}
          closeModal={() => closeModal()} />

      </div>
    </div>
  );
};

const loginUser = async (credentials) => {
  try {
    const db = await openDB();

    const students = await getAllStudents(db);

    const user = students.find(
      (student) => student.email === credentials.email && student.password === credentials.password
    );

    if (user) {
      const fakeToken = user.idNumber;
      

      return fakeToken;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    throw new Error("Error during login");
  }
};

export default Login;
