let config = require('../../config/config'),
	redis = require('redis');

const redisClient = redis.createClient(config.redis)
redisClient.on('ready', () => {
	console.log('redis start at 172.0.0.1:6379')
})

redisClient.on("error", (err) => {
	console.log("Error " + err);
})

module.exports = {
	redis: redis, 
	redisClient: redisClient, 
}
