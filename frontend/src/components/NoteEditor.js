// // src/NoteEditor.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Connect to the server

// const NoteEditor = ({ noteId }) => {
//   const [noteContent, setNoteContent] = useState('');
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   useEffect(() => {
//     socket.on('connect', () => {
//       setIsConnected(true);
//       socket.emit('join_note', noteId);
//     });

//     socket.on('disconnect', () => {
//       setIsConnected(false);
//     });

//     socket.on('note_updated', (data) => {
//       if (data.noteId === noteId) {
//         setNoteContent(data.content);
//       }
//     });

//     // Fetch the current content of the note
//     axios.get(`http://localhost:5000/notes/${noteId}`)
//       .then(response => {
//         setNoteContent(response.data.content);
//       })
//       .catch(error => console.error('Error fetching note:', error));

//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('note_updated');
//       socket.emit('leave_note', noteId);
//     };
//   }, [noteId]);

//   const handleContentChange = (event) => {
//     setNoteContent(event.target.value);
//   };

//   const handleSave = () => {
//     axios.post(`http://localhost:5000/notes/${noteId}`, { content: noteContent })
//       .then(response => {
//         console.log('Note saved:', response.data);
//       })
//       .catch(error => console.error('Error saving note:', error));
//   };

//   return (
//     <div>
//       <h2>Collaborative Note Editor</h2>
//       <textarea value={noteContent} onChange={handleContentChange}></textarea>
//       <button onClick={handleSave}>Save Note</button>
//       <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
//     </div>
//   );
// };

// export default NoteEditor;



// src/components/NoteEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust this to match your server

const NoteEditor = ({ noteId }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        socket.emit('joinNote', noteId);

        socket.on('noteUpdated', (updatedContent) => {
            console.log("in frontend - updated contetn", updatedContent)
            setContent(updatedContent);
        });

        axios.get(`http://localhost:5000/api/notes/${noteId}`)
            .then(response => setContent(response.data.content))
            .catch(err => console.error(err));

        return () => {
            socket.off('noteUpdated');
            socket.emit('leaveNote', noteId);
        };
    }, [noteId]);

    const handleSave = () => {
        axios.put(`http://localhost:5000/api/notes/${noteId}`, { content })
            .then(response => console.log(response.data))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <textarea value={content} onChange={e => setContent(e.target.value)} />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default NoteEditor;
