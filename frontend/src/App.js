import React from 'react';
import NoteEditor from './NoteEditor';
import './App.css';

function App() {
  const noteId = '123'; // This should be dynamically obtained, e.g., from the URL

  return (
    <div className="App">
      <header className="App-header">
        <NoteEditor noteId={noteId} />
      </header>
    </div>
  );
}

export default App;
