var http = require('http'),
    socket = require('socket.io');

module.exports = (app)=>{
    var server = http.Server(app),
        io = socket(server);
    require('../app/socket')(io);
    return server;
}