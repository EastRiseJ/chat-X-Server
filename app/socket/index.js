const redis = require('../redis').redisClient

let isOnline = (id) => {
    return new Promise((resolve,reject)=>{
        redis.hexists('online', id, (err, reply) => {
            if (reply === 1) {
                redis.hget('online', id, (err, reply) => {
                    resolve(reply)
                })
            } else {
                resolve(false)
            }
        })
    })
}

module.exports = (io) => {
    const liveUser = new Set();
    
    io.on('connection', (socket) => {
        const socketId = socket.id
        console.log(`一位用户上线`);

        socket.on('login', (userId) => {
            redis.hset('online', userId, socketId, () => {
                console.log('登陆成功')
            })
        });

        socket.on('addToDirectorie', async (otherUserId) => {
            let socketId = await isOnline(otherUserId)
            console.log(socketId)
            if(socketId){
                //转发给用户
                io.to(socketId).emit('getMessage', 'add to you')
            } else {

            }
        })

        socket.on('message', async ({userId, otherUserId, message}) => {
            let socketId = await isOnline(otherUserId)
            if(socketId){
                //转发给用户
                let data = {id: userId, message: message}
                socket.to(socketId).emit('getMessage', data)
            } else {
                //存到redis
            }
        });

        socket.on('close', (userId) => {
            redis.hdel('online', userId, () => {
                console.log(`一位用户下线`);
            })
        });

        socket.on('disconnect', () => {
            console.log(`一位用户非正常下线`);
        });
    });
}
