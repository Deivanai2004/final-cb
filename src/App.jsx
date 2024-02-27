import React, { useState } from 'react';
import { FloatingLabel, Form, Button } from 'react-bootstrap';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to another page
        console.log(data)
        localStorage.setItem("token",data.token);
        navigate('/home');
      } else {
        // Handle login failure
        setErrorMessage(data.error || 'Login failed'); // Set the error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Error during login'); // Set a generic error message
    }
  };

  return (
    <div className="App">
      <div className='logo'>
        <img src='src\assets\image1.png' height='50' width='150' alt='Codebuilders'></img>
        <h2 id='title'>Please sign in</h2>
      </div>
      <div className='Alignment'>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-4">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>
        <label className='checkbox'><input type='checkbox' /><p id='para'>Remember Me</p></label>
      </div>
      <Button onClick={handleLogin} style={{ backgroundColor: '#9975f3', width: '300px', marginTop: '10px' }} variant="primary">
        Sign in
      </Button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <footer className='footer'>&copy; VPS CodeBuilders Private Limited <br></br>2017-2023</footer>
    </div>
  );
}

export default App;