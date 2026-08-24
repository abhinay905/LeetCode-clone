// day3

const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'meadow-silver-voyage-68631.db.redis.io',
        port: 14266
    }
});

redisClient.on('error', (err) => {
    console.log('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Redis Connected Successfully');
});


module.exports = redisClient;

