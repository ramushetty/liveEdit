


const { createClient } = require('redis');

let redisClient;

async function connectToRedis() {
    redisClient = createClient({
        url: 'redis://localhost:6379' // Update this URL to match your Redis server
        // If using Redis 6 or newer with default configuration, 
        // you may need to specify username and password here
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
}

async function get(key) {
    try {
        return await redisClient.get(key);
    } catch (err) {
        console.error(`Error retrieving data from Redis for key ${key}:`, err);
        throw err;
    }
}

async function set(key, value, expirationInSeconds = 3600) {
    try {
        await redisClient.set(key, value, {
            EX: expirationInSeconds
        });
    } catch (err) {
        console.error(`Error setting data in Redis for key ${key}:`, err);
        throw err;
    }
}



module.exports = {
    connectToRedis,
    get,
    set,
};
