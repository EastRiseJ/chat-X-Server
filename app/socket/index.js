module.exports = (io) => {
    const liveUser = new Set();
    
    io.on('connection', (socket) => {
        const socketId = socket.id
        console.log(`一位用户上线`);
        
        socket.on('login', (userId) => {
            console.log(userId)
        });

        socket.on("disconnect", () => {
            console.log(`一位用户下线`);
        });
    });
}