module.exports = (io) => {
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on("disconnect", function() {
            console.log("a user go out");
        });

        socket.on("message", function(obj) {
            io.emit("message", obj);
        });
    });
}