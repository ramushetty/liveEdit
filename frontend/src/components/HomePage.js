// import React,{useState,useEffect} from 'react';
// import './HomePage.css'; // You can create a corresponding CSS file for styling
// import NoteEditor from './NoteEditor';
// import NoteList from './NoteList';
// import CreateNote from './CreateNote';
// import axios from 'axios';

// function HomePage() {



//     const [notes, setNotes] = useState([]);
//     const [currentNoteId, setCurrentNoteId] = useState(null);
//     const [creatingNewNote, setCreatingNewNote] = useState(false);

//     useEffect(() => {
//         fetchNotes();
//     }, []);

//     const fetchNotes = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/notes/');
//             setNotes(response.data);
//         } catch (error) {
//             console.error('Error fetching notes:', error);
//         }
//     };

//     const handleCreateNewNote = () => {
//         setCreatingNewNote(true);
//         setCurrentNoteId(null);
//     };

//     const handleNoteCreated = (noteId) => {
//         setCreatingNewNote(false);
//         setCurrentNoteId(noteId);
//         fetchNotes();
//     };

//     const handleSelectNote = (noteId) => {
//         setCurrentNoteId(noteId);
//         setCreatingNewNote(false);
//     };


//   return (
//     <div className="App">
//          <button onClick={handleCreateNewNote}>Create New Note</button>
//          <NoteList notes={notes} onSelectNote={handleSelectNote} />

//          {creatingNewNote && <CreateNote onNoteCreated={handleNoteCreated} />}
//          {currentNoteId && !creatingNewNote && <NoteEditor noteId={currentNoteId} />}
//      </div>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './Note'; // A component to render each note
import './HomePage.css'; // CSS for styling
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [notes, setNotes] = useState([]);
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [newNoteName, setNewNoteName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };



    const handleDelete = async (noteId) => {
        try {
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
            fetchNotes(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };



    const handleCreateNew = () => {
        setShowNewNoteForm(true);
    };

    const handleNewNoteSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/notes/create-note', { content: newNoteName });
            setNewNoteName('');
            setShowNewNoteForm(false);
            fetchNotes(); // Refresh the notes list
        } catch (error) {
            console.error('Error creating new note:', error);
        }
    };

    const handleEdit = (noteId) => {
        navigate(`/edit/${noteId}`);
    };

    return (
        <div className="home-container">
            <h1>Notes</h1>
            {/* <button onClick={handleCreateNew} className="create-note-button">Create New Note</button>
             */}

            <button onClick={handleCreateNew} className="create-note-button">
                Create New Note
            </button>
            {showNewNoteForm && (
                <form onSubmit={handleNewNoteSubmit} className="new-note-form">
                    <input
                        type="text"
                        value={newNoteName}
                        onChange={(e) => setNewNoteName(e.target.value)}
                        placeholder="Enter note name"
                    />
                    <button type="submit">Save Note</button>
                </form>
            )}
            <div className="notes-list">
                {notes.map((note) => (
                    <Note 
                        key={note.noteId} 
                        note={note} 
                        onEdit={() => handleEdit(note.noteId)} 
                        onDelete={() => handleDelete(note.noteId)} 
                    />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
