const socket = io();

const handleSearch = () => {


    socket.emit('search', "input");

    socket.on('searchResults', (searchResults) => {
        console.log(searchResults)
        socket.disconnect();
    });
};

handleSearch()