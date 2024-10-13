const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Erro no Redis:', err);
});

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;