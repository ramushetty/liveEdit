import './Note.css';

function Note({ note, onEdit, onDelete }) {
    return (
        <div className="note">
            <h3>{note.title || note.noteId}</h3>
            {/* <p>{note.content}</p> */}
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
}

export default Note;
