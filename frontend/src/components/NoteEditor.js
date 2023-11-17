import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import './NoteEditor.css'
import { Outlet, Link } from "react-router-dom";
import Navbar from './Navbar'
const socket = io('http://localhost:5000'); // Adjust this to match your server


const NoteEditor = () => {
    
    const { noteId } = useParams();
    console.log(noteId)
    const [content, setContent] = useState('');

    useEffect(() => {
        socket.emit('joinNote', noteId);        

        socket.on('noteUpdated', (updatedContent) => {
            
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
        // <div>
        //     <textarea value={content} onChange={e => setContent(e.target.value)} />
        //     <button onClick={handleSave}>Save</button>
        // </div>
        <div>
        <Navbar/>
            <div className="note-editor-container">
                <textarea
                    className="note-editor-textarea"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <div className='row'>
                    <div className='col-6'>
                    <Link to="/home">
                        <button className="btn btn-primary">Home</button>
                    </Link>
                </div>
                <div className='col-6'>
                    <button className=" btn btn-success note-editor-save-button" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;