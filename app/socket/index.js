module.exports = (io) => {
    const liveUser = new Set();

    io.on('connection', (socket) => {
        console.log(`一位用户上线`);
        socket.on('login', function(data) {
            console.log(data)
        });

        socket.on("disconnect", () => {
            console.log(`一位用户下线`);
        });
    });
}