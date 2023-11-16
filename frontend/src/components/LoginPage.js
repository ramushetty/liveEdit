import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('email:', email, 'Password:', password);
    try {
        const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
        // Assuming the backend returns a success response
        if (response.status === 200) {
          // Redirect to the home page
          navigate('/home');
        } else {
          // Handle errors or unsuccessful login attempts
          console.error('Login failed:', response);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error during login:', error);
      }

  };

  const handleRegisterClick = () => {
    navigate('/register');
};
  return (
    <div className="login-container">
        {/* <h2 className="page-title">Login</h2> */}
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="login-input"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </label>
        <button type="submit" className="login-button">Login</button>
        <button onClick={handleRegisterClick} className="register-button">
                    Register
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
