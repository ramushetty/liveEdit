// src/App.js
import React, { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';
import CreateNote from './components/CreateNote';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import Navbar from './components/Navbar'
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';

import { Outlet, Link } from "react-router-dom";

const email = localStorage.getItem('email')
const App = () => {
    
    return (
        
        <Router>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/edit/:noteId" element={<PrivateRoute><NoteEditor /></PrivateRoute>} />
                
                {/* Other routes can go here */}
            </Routes>
            </AuthProvider>
        </Router>
        
    );
};

export default App;
