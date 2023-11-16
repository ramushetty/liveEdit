// const express = require('express');
// const bodyParser = require('body-parser');
// const amqp = require('amqplib/callback_api');
// const http = require('http');
// const socketIO = require('socket.io');
// const { Server } = require('socket.io');
// const redis = require('redis');
// require('dotenv').config();

// const AWS = require('aws-sdk');


// const app = express();
// const cors = require('cors');
// // For development, allow requests from your React development server
// const corsOptions = {
//     origin: 'http://localhost:3000', // Replace with the port your React app is served on
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   };


// app.use(cors(corsOptions));
// const server = http.createServer(app);
// // const io = socketIO(server);
// const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",  // This should match the URL of your frontend application
//       methods: ["GET", "POST","PUT"],          // The methods to allow
//       allowedHeaders: ["my-custom-header"],
//       credentials: true
//     }
//   });


// const port = process.env.PORT || 5000;






// // Set the region and endpoint to point to your local DynamoDB
// AWS.config.update({
//   region: "us-west-2",
//   endpoint: "http://localhost:8000",
//   accessKeyId: "fakeMyKeyId",
//   secretAccessKey: "fakeSecretAccessKey"
// });

// // const docClient = new AWS.DynamoDB();
// // const docClient = new AWS.DynamoDB.DocumentClient();
// const ddb = new AWS.DynamoDB(); // This is for operations like createTable
// const docClient = new AWS.DynamoDB.DocumentClient(); // This is for regular CRUD operations

// // Parameters for creating the table
// const tableParams = {
//   TableName : "Notes",
//   KeySchema: [
//     { AttributeName: "noteId", KeyType: "HASH"} // Partition key
//   ],
//   AttributeDefinitions: [
//     { AttributeName: "noteId", AttributeType: "S" }
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 10, // Set read capacity for your table
//     WriteCapacityUnits: 10 // Set write capacity for your table
//   }
// };

// // Create the table
// // ddb.createTable(tableParams, function(err, data) {
// //   if (err) {
// //     console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
// //   } else {
// //     console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
// //   }
// // });



// app.use(bodyParser.json());



// let channel;
// function startConsumer() {
//   amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
//       if (err) throw err;
//       connection.createChannel((err, ch) => {
//           if (err) throw err;

//           channel = ch
//           const exchange = 'notesExchange';
//           channel.assertExchange(exchange, 'fanout', { durable: false });

//           channel.assertQueue('', { exclusive: true }, (err, q) => {
//               if (err) throw err;
              
//               channel.bindQueue(q.queue, exchange, '');

//               try{

//                 channel.consume(q.queue, (msg) => {
//                     const noteUpdate = JSON.parse(msg.content.toString());
                    
//                     // Broadcast the update to relevant clients
//                     console.log(noteUpdate.content)
//                     io.to(noteUpdate.noteId).emit('noteUpdated', noteUpdate.content);
//                 }, { noAck: true });

//               } catch(error) {
//                 console.log(error)
//               }

              
//           });
//       });
//   });
// }

// // Call this function when starting the server
// startConsumer();





// const redisClient = redis.createClient({
//   url: 'redis://localhost:6379' // Adjust as per your Redis server configuration
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// async function connectRedis() {
//   try {
//       await redisClient.connect();
//       console.log('Connected to Redis');
//   } catch (err) {
//       console.error('Could not connect to Redis', err);
//   }
// }

// connectRedis();

// // WebSocket setup
// io.on('connection', socket => {
//   console.log('A user connected');

//   socket.on('joinNote', (noteId) => {
//     socket.join(noteId);
//     console.log(`User joined note ${noteId}`);
// });
// socket.on('leaveNote', (noteId) => {
//   socket.leave(noteId);
//   console.log(`User left note ${noteId}`);
// });
// socket.on('disconnect', () => {
//   console.log('Client disconnected');
//   // Perform any necessary cleanup, such as leaving rooms
// });

// });




// // Route for updating notes
// app.post('/notes/:noteId', async (req, res) => {
//   const noteId = req.params.noteId; // Corrected to match the route parameter
//   const { content } = req.body; // Removed userId if it's not used

//   // Update or create the note in DynamoDB
//   const params = {
//       TableName: 'Notes',
//       Item: {
//           noteId, // This should match the primary key in your DynamoDB table
//           content,
//           updatedAt: new Date().toISOString()
//       }
//   };
  
//   try {
//       await docClient.put(params).promise();
//       const msg = JSON.stringify({ noteId, content });
//       channel.publish('notesExchange', '', Buffer.from(msg));
//       // redisClient.setex(`note:${noteId}`, 3600, content); // cache for 1 hour
//       // await setValue(req.body.key, req.body.value);
//       await redisClient.set(`note:${noteId}`, content);
//       res.status(200).json({ message: 'Note saved!' });
//   } catch (error) {
//       console.error("Error updating note:", error); // Added console.error for better debugging
//       res.status(500).json({ message: 'Could not save the note', error });
//   }
// });





// // DELETE route to delete a note
// app.delete('/notes/:noteId', async (req, res) => {
//   const noteId = req.params.noteId;

//   const params = {
//     TableName: 'Notes',
//     Key: {
//       'noteId': noteId
//     }
//   };

//   try {
//     await docClient.delete(params).promise();
//     res.json({ message: 'Note deleted' });
//   } catch (error) {
//     console.error("Error deleting note:", error);
//     res.status(500).json({ message: 'Could not delete the note', error });
//   }
// });


// // PUT route to update an existing note
// app.put('/notes/:noteId', async (req, res) => {
//   const noteId = req.params.noteId;
//   const { content } = req.body;

//   const params = {
//     TableName: 'Notes',
//     Key: {
//       'noteId': noteId
//     },
//     UpdateExpression: 'set content = :c, updatedAt = :u',
//     ExpressionAttributeValues: {
//       ':c': content,
//       ':u': new Date().toISOString()
//     },
//     ReturnValues: 'UPDATED_NEW'
//   };

//   try {
//     const { Attributes } = await docClient.update(params).promise();
//     res.json({ message: 'Note updated', ...Attributes });
//   } catch (error) {
//     console.error("Error updating note:", error);
//     res.status(500).json({ message: 'Could not update the note', error });
//   }
// });

// app.get('/notes', async (req, res) => {
//   const params = {
//       TableName: 'Notes',
//       // If you have a large number of notes, consider implementing pagination
//   };

//   try {
//       const data = await docClient.scan(params).promise();
//       res.json(data.Items);
//   } catch (error) {
//       console.error("Error fetching notes:", error);
//       res.status(500).send({ error: 'Could not fetch notes' });
//   }
// });

// app.post('/create-note', async (req, res) => {
//   const { noteId, content } = req.body; // Assuming noteId is provided by the client or generated server-side

//   const params = {
//       TableName: 'Notes',
//       Item: {
//           noteId: noteId,
//           content: content,
//           createdAt: new Date().toISOString()
//       }
//   };

//   try {
//       await docClient.put(params).promise();
//       res.status(201).json({ message: 'Note created successfully', noteId: noteId });
//   } catch (error) {
//       console.error("Error creating note:", error);
//       res.status(500).json({ error: 'Could not create the note' });
//   }
// });




// // Add this inside your server.js file after configuring AWS and setting up the Express app

// // GET route to fetch a note
// app.get('/notes/:noteId', async (req, res) => {
//   const noteId = req.params.noteId;

//   const params = {
//     TableName: 'Notes',
//     Key: {
//       'noteId': noteId
//     }
//   };
//   // console.log("in get----------")

//   // // Try to fetch the note content from Redis cache first
//   // redisClient.get(`note:${noteId}`, async (err, cachedData) => {
//   //   if (cachedData) {
//   //     console.log("in get----------")
//   //       return res.json({ content: cachedData, source: 'cache' });
//   //   }
//       try {


//         const cachedData = await redisClient.get(`note:${noteId}`);
//         if (cachedData) {
//             console.log("in redis----------------")
//             return res.json({ content: cachedData, source: 'cache' });
//         }
//         const { Item } = await docClient.get(params).promise();
//         if (Item) {
//           // redisClient.setex(`note:${noteId}`, 3600, Item.content); // cache for 1 hour
//           res.json(Item);
//         } else {
//           res.status(404).json({ message: 'Note not found' });
//         }
//       } catch (error) {
//         console.error("Unable to read item. Error JSON:", JSON.stringify(error, null, 2));
//         res.status(500).json({ message: 'Could not retrieve the note', error });
//       }

//   // })
// });


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// process.on('exit', async () => {
//   await redisClient.quit();
//   console.log('Disconnected from Redis');
// });

// server.listen(port, () => console.log(`Server running on port ${port}`));





const http = require('http');
const app = require('./app'); // Importing the configured Express app
const socketIo = require('socket.io');
const rabbitMQService = require('./services/rabbitMQService');
const redisService = require('./services/redisService'); // Assuming you have this service

require('dotenv').config();
// Create HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server, {
    cors: {
        origin: '*', // Adjust according to your frontend setup, '*' for all origins (not recommended for production)
        methods: ['GET', 'POST','PUT']
    }
});


async function setupRabbitMQ() {
  try {
      await rabbitMQService.connect();
      await rabbitMQService.assertQueue('myQueue', { durable: true }); // Create a durable queue

      // If you're using exchanges, you might want to bind the queue to an exchange
      await rabbitMQService.bindQueueToExchange('myQueue', 'notesExchange');
      startConsumingMessages();

      // More setup like consuming messages...
  } catch (error) {
      console.error('Failed to setup RabbitMQ:', error);
  }
}

setupRabbitMQ();


function startConsumingMessages() {
  // console.log(rabbitMQService)
  try {
    rabbitMQService.consume('myQueue', (message) => {

      const firstParse = JSON.parse(message.content)
      const jsonObject = JSON.parse(firstParse)
      const msg = jsonObject
      console.log("Received message:", msg.content);

     
      // Implement other actions as needed
      // if (message.action === 'noteUpdated') {
    
        // io.emit('noteUpdated', msg.content );
        console.log(msg.noteId)
        io.to(msg.noteId).emit('noteUpdated', msg.content);
    // }
  });

  } catch(err) {
    console.log(err)
  }
  
}


redisService.connectToRedis();


async function someFunction() {
  try {
      await redisService.connectToRedis();
      await redisService.set('myKey', 'someValue');
      const value = await redisService.get('myKey');
      console.log(value);
  } catch (error) {
      console.error('Redis operation failed:', error);
  }
}
someFunction()

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

    socket.on('joinNote', (noteId) => {
      socket.join(noteId);
      console.log(`User joined note ${noteId}`);
  });
  socket.on('leaveNote', (noteId) => {
    socket.leave(noteId);
    console.log(`User left note ${noteId}`);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Perform any necessary cleanup, such as leaving rooms
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

