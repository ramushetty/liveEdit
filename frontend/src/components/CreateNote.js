// src/components/CreateNote.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateNote = ({ onNoteCreated }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            const noteId = generateNoteId(); // Function to generate a unique note ID
            await axios.post('http://localhost:5000/api/notes/create-note', { noteId, content });
            onNoteCreated(noteId);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleSubmit}>Create Note</button>
        </div>
    );
};

export default CreateNote;

function generateNoteId() {
    // Implement a logic to generate unique noteId
    // This can be a random string, a UUID, or any unique identifier
    return 'note_' + Date.now(); // Example: simple timestamp-based ID
}
