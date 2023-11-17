// src/components/NoteList.js
import React from 'react';

const NoteList = ({ notes, onSelectNote }) => {
    return (
        <div>
            {notes.map(note => (
                <div key={note.noteId} onClick={() => onSelectNote(note.noteId)}>
                    {note.title || note.noteId}
                </div>
            ))}
        </div>
    );
};

export default NoteList;
