// src/App.js
import React, { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';
import CreateNote from './components/CreateNote';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';



const App = () => {
    

    return (
        

        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/edit/:noteId" element={<NoteEditor />} />
                {/* Other routes can go here */}
            </Routes>
        </Router>
    );
};

export default App;
