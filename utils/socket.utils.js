const socketIo = require('socket.io');


function setupWebSocketServer(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        socket.on('search', (input) => {
            // console.log('Received search request from client:');
            // console.log('Input:', input);
            socket.emit("searchResults", {type: "courses", results: {} });
        });

        socket.on('disconnect', () => {
            // console.log('Client disconnected');
        });
    });

    return io;
}

module.exports = setupWebSocketServer;
