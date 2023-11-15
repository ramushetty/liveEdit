const amqp = require('amqplib');


const rabbitMQService = {
    connection: null,
    channel: null,

    // Connect to RabbitMQ server
    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost'); // Update as needed
            this.channel = await this.connection.createChannel();
            console.log('Connected to RabbitMQ');
        } catch (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            throw err;
        }
    },

    // Create and assert an exchange
    async assertExchange(exchangeName, type = 'fanout', options = { durable: false }) {
        try {
            await this.channel.assertExchange(exchangeName, type, options);
            console.log(`Exchange '${exchangeName}' asserted`);
        } catch (err) {
            console.error(`Failed to assert exchange '${exchangeName}':`, err);
            throw err;
        }
    },

    // Publish a message to an exchange
    async publish(exchangeName, routingKey, message) {
        try {
            this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
            console.log(`Message published to exchange '${exchangeName}'`);
        } catch (err) {
            console.error(`Failed to publish message to exchange '${exchangeName}':`, err);
            throw err;
        }
    },

    // Create and assert a queue
    async assertQueue(queueName, options = {}) {
        try {
            await this.channel.assertQueue(queueName, options);
            console.log(`Queue '${queueName}' asserted`);
            return queueName;
        } catch (err) {
            console.error(`Failed to assert queue '${queueName}':`, err);
            throw err;
        }
    },

    // Bind a queue to an exchange
    async bindQueueToExchange(queueName, exchangeName, pattern = '') {
        try {
            await this.channel.bindQueue(queueName, exchangeName, pattern);
            console.log(`Queue '${queueName}' bound to exchange '${exchangeName}'`);
        } catch (err) {
            console.error(`Failed to bind queue '${queueName}' to exchange '${exchangeName}':`, err);
            throw err;
        }
    },

    // Consume messages from a queue
    async consume(queueName, onMessage) {
        try {
            console.log("Starting to consume from:", queueName);
            await this.channel.consume(queueName, (msg) => {
    
                if (msg && msg.content) {
                    // console.log("Message content:", msg.content.toString());
                    // const message = JSON.parse(msg.content.toString());
                    onMessage(msg);
                    this.channel.ack(msg);
                } else {
                    console.log("Received null or undefined message");
                }
            });
            console.log(`Consuming messages from queue '${queueName}'`);
        } catch (err) {
            console.error(`Failed to consume messages from queue '${queueName}':`, err);
            throw err;
        }
    
    }
};

module.exports = rabbitMQService;
