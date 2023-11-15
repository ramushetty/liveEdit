const noteModel = require('../models/noteModels');
const channel = require('../services/rabbitMQService')
const redisService = require('../services/redisService')

exports.getNote = async (req, res) => {
    try {
        const noteId = req.params.noteId
        // Check if the note is in the cache

        let cachedData =  await redisService.get(`note:${noteId}`);
        

        if (cachedData) {
            return res.json({ content: cachedData, source: 'cache' });
        }

        const note = await noteModel.getNoteById(noteId);
        console.log(note)
        if (note) {
            await redisService.set(`note:${noteId}`, note.content);
        }
        res.json(note);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createNote = async (req, res) => {
    try {
        const { content } = req.body;
        const note = await noteModel.createNote(content);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { content } = req.body;
        const noteId = req.params.noteId;
        const note = await noteModel.updateNote(req.params.noteId, content);
         // Publish message to RabbitMQ
         await channel.publish('notesExchange', '', JSON.stringify({
            action: 'noteUpdated',
            noteId,
            content
        }));
        await redisService.set(`note:${noteId}`, content);

        res.json(note);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteNote = async (req, res) => {
    try {
        await noteModel.deleteNote(req.params.noteId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await noteModel.getAllNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
