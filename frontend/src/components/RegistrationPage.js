import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/user/register', {
                username, email, password
            });
            // Assuming the backend returns a success response
            if (response.status === 200 || response.status === 201) {
                // Redirect to the login page
                navigate('/');
            } else {
                // Handle errors or unsuccessful registration attempts
                console.error('Registration failed:', response);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form">
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="registration-input"
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="registration-input"
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="registration-input"
                    />
                </label>
                <button type="submit" className="registration-button">Register</button>
            </form>
        </div>
    );
}

export default RegistrationPage;
