// src/App.js
import React, { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';
import CreateNote from './components/CreateNote';
import axios from 'axios';
import './App.css';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [creatingNewNote, setCreatingNewNote] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notes/');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleCreateNewNote = () => {
        setCreatingNewNote(true);
        setCurrentNoteId(null);
    };

    const handleNoteCreated = (noteId) => {
        setCreatingNewNote(false);
        setCurrentNoteId(noteId);
        fetchNotes();
    };

    const handleSelectNote = (noteId) => {
        setCurrentNoteId(noteId);
        setCreatingNewNote(false);
    };

    return (
        <div className="App">
            <button onClick={handleCreateNewNote}>Create New Note</button>
            <NoteList notes={notes} onSelectNote={handleSelectNote} />

            {creatingNewNote && <CreateNote onNoteCreated={handleNoteCreated} />}
            {currentNoteId && !creatingNewNote && <NoteEditor noteId={currentNoteId} />}
        </div>
    );
};

export default App;
