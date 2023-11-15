const AWS = require('aws-sdk');
const docClient = require('../config/dbConfig');


const tableName = 'Notes'; 

const noteModel = {
    // Get a note by ID
    async getNoteById(noteId) {
        const params = {
            TableName: tableName,
            Key: {
                'noteId': noteId
            }
        };

        try {
            const data = await docClient.get(params).promise();
            return data.Item;
        } catch (error) {
            throw new Error('Error retrieving note:', error);
        }
    },

    // Create a new note
    async createNote(noteId, content) {
        const params = {
            TableName: tableName,
            Item: {
                'noteId': noteId,
                'content': content,
                'createdAt': new Date().toISOString()
            }
        };

        try {
            await docClient.put(params).promise();
            return params.Item;
        } catch (error) {
            throw new Error('Error creating note:', error);
        }
    },

    // Update an existing note
    async updateNote(noteId, content) {
        const params = {
            TableName: tableName,
            Key: {
                'noteId': noteId
            },
            UpdateExpression: 'set content = :c',
            ExpressionAttributeValues: {
                ':c': content
            },
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            await docClient.update(params).promise();
            return { noteId, content };
        } catch (error) {
            throw new Error('Error updating note:', error);
        }
    },

    // Delete a note
    async deleteNote(noteId) {
        const params = {
            TableName: tableName,
            Key: {
                'noteId': noteId
            }
        };

        try {
            await docClient.delete(params).promise();
            return { noteId };
        } catch (error) {
            throw new Error('Error deleting note:', error);
        }
    },

        async getAllNotes() {
            const params = {
                TableName: tableName
            };
    
            try {
                const data = await docClient.scan(params).promise();
                return data.Items;
            } catch (error) {
                console.error('Error fetching all notes:', error);
                throw error;
            }
        }
};

module.exports = noteModel;
