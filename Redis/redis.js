const redis = require('redis');

// Create a Redis client using the correct URL format
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.connect()
    .then(() => {
        console.log('Connected to Redis');
    })
    .catch((err) => {
        console.error('Redis connection error:', err);
    });

// Handle errors (optional but recommended)
client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Test Redis by setting and getting a value (optional)
async function testRedis() {
    await client.set('testKey', 'Hello, Redis!');
    const value = await client.get('testKey');
    console.log('Value from Redis:', value);
}

testRedis(); // Call the test function
