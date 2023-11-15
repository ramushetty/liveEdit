const express = require('express');
const noteController = require('../controllers/noteController');

const router = express.Router();

// Route to get a specific note by ID
router.get('/:noteId', noteController.getNote);

// Route to create a new note
router.post('/create-note', noteController.createNote);

// Route to update an existing note
router.put('/:noteId', noteController.updateNote);

// Route to delete a note
router.delete('/:noteId', noteController.deleteNote);

// New route to get all notes
router.get('/', noteController.getAllNotes);

module.exports = router;
