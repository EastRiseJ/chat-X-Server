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
	redisClient: redisClient, 
}

/**
 * 查询用户(对方)是否在线
 * @param {用户id} id 
 */
module.exports.isOnline = (id) => {
    return new Promise((resolve,reject)=>{
        redisClient.hexists('online', id, (err, reply) => {
            if (reply === 1) {
                redisClient.hget('online', id, (err, reply) => {
                    resolve(reply)
                })
            } else {
                resolve(false)
            }
        })
    })
}

/**
 * 
 * @param {*} userId 
 * @param {*} socketId 
 */
module.exports.setOnline = (userId, socketId) => {
    return new Promise((resolve,reject)=>{
		redisClient.hset('online', userId, socketId, () => {
			console.log('登陆成功')
		})
    })
}