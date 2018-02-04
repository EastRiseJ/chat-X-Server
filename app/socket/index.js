const User = require('../user/user.model')
const redisClient = require('../redis').redisClient
const redis = require('../redis')
const auth = require('../../auth/auth.service')
const controller = require('../user/user.controller')


module.exports = (io) => {
    
    io.on('connection',async (socket) => {
        console.log(`一位用户上线`);
        const socketId = socket.id
        const token = socket.handshake.query.token
        //验证token
        let userId = await auth.isAuthenticatedSocket(token)
        if(userId){
            redis.setOnline(userId, socketId)
        }

        socket.on('login', (userId) => {
            redis.setOnline(userId, socketId)
        });

        socket.on('addDirectorie', async (userId, otherUserId) => {
            let socketId = await redis.isOnline(otherUserId)
            console.log(socketId)
            if(socketId){
                //转发给用户
                User.findOne({ _id: userId }, '_id name email avatar')
                    .then(data => {
                        io.to(socketId).emit('addDirectorie', data)
                    })
            } else {

            }
        })

        socket.on('addDirectorieAgree', async (userId, otherUserId) => {
            controller.addList(userId, otherUserId)
        })

        socket.on('message', async ({userId, otherUserId, message}) => {
            let socketId = await redis.isOnline(otherUserId)
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
