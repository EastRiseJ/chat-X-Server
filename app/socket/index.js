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
            let data = await controller.userInfo(userId)
            // let dataMessage = await controller.getWaitMessage(userId)
            io.to(socketId).emit('userInfo', data)
            // io.to(socketId).emit('getMessage', dataMessage)
            // io.to(socketId).emit('waitAddDirectorie', data)
        }

        socket.on('login', (userId) => {
            redis.setOnline(userId, socketId)
        });

        socket.on('addDirectorie', async (userId, otherUserId) => {     
            controller.addList(userId, otherUserId)
            let socketId = await redis.isOnline(otherUserId)
            if(socketId){
                User.findOne({ _id: userId }, '_id name email avatar')
                    .then(data => {
                        io.to(socketId).emit('addDirectorie', data)
                    })
            }
        })

        socket.on('addDirectorieAgree', async (userId, otherUserId) => {
            controller.addListAgree(userId, otherUserId)
            let socketId = await redis.isOnline(otherUserId)
            if(socketId){
                // socket.to(socketId).emit('addDirectorieAgree', userId)
                // 同意后的操作
            } else{
                controller.addListAgreeMessage(otherUserId, userId)
            }
        })

        socket.on('message', async ({userId, otherUserId, message}) => {
            let socketId = await redis.isOnline(otherUserId)
            let data = {is: false, id: userId, message: message, date: new Date().getTime()}
            if(socketId){
                //转发给用户
                io.to(socketId).emit('getMessage', [data])
            } else {
                // controller.addWaitMessage(otherUserId, data)
            }
        });

        socket.on('close', () => {
            redis.delOnline(socketId)
        });

        socket.on('disconnect', () => {
            redis.delOnline(socketId)
            console.log(`一位用户非正常下线`);
        });
    });
}
