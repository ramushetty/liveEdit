const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const http = require('http');
const socketIO = require('socket.io');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const cors = require('cors');
// For development, allow requests from your React development server
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the port your React app is served on
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };


app.use(cors(corsOptions));
const server = http.createServer(app);
// const io = socketIO(server);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",  // This should match the URL of your frontend application
      methods: ["GET", "POST"],          // The methods to allow
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });


const port = process.env.PORT || 5000;






app.use(bodyParser.json());

// Set up the AMQP channel
let amqpChannel;
amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
  if (err) {
    console.error("Failed to connect to RabbitMQ", err);
    process.exit(1);
  }
  connection.createChannel((channelErr, channel) => {
    if (channelErr) {
      console.error("Failed to create a channel in RabbitMQ", channelErr);
      process.exit(1);
    }
    amqpChannel = channel;
    const EXCHANGE = 'note_updates';
    channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
  });
});

// WebSocket setup
io.on('connection', socket => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('join_note', noteId => {
    socket.join(noteId);
    console.log(`User joined note: ${noteId}`);
  });

  socket.on('leave_note', noteId => {
    socket.leave(noteId);
    console.log(`User left note: ${noteId}`);
  });
});

// Route for updating notes
app.post('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  const content = req.body.content;

  // Here you would interact with DynamoDB to save the note

  // Publish message to RabbitMQ
  const EXCHANGE = 'note_updates';
  const msg = JSON.stringify({ noteId, content });
  amqpChannel.publish(EXCHANGE, '', Buffer.from(msg));

  // Emit update to all clients editing the same note
  io.in(noteId).emit('note_updated', { noteId, content });

  res.status(200).json({ message: 'Note updated', noteId, content });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(port, () => console.log(`Server running on port ${port}`));
