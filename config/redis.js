var config = require('./config'),
	redis = require('redis');

// client = redis.createClient(config.redis)
// client.on('ready', () => {
// 	console.log('redis start at 172.0.0.1:6379')
// })

// client.on("error", (err) => {
// 	console.log("Error " + err);
// })

// module.exports = client