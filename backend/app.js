const express = require('express');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoute')
const bodyParser = require('body-parser');
const cors = require('cors'); // Assuming you're using CORS
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Middleware
// Use CORS (Cross-Origin Resource Sharing) for handling requests from different origins
app.use(cors()); // Configure CORS as needed for your setup

// Body parser middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
// Use the noteRoutes for any requests going to '/api/notes'
app.use('/api/notes', noteRoutes);

app.use('/api/user/',userRoutes)

// Catch-all route for handling all other requests that don't match any route
app.use((req, res, next) => {
    res.status(404).send({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});




const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'SECRET_KEY'); // Use the same secret key as before

        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Authentication failed');
    }
}
// app.use(authenticate())

module.exports = app;
