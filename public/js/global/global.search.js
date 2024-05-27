
const handleSearch = () => {

    const socket = io();

    socket.emit('search', "input");

    socket.on('searchResults', (searchResults) => {
        socket.disconnect();
    });
};

handleSearch()