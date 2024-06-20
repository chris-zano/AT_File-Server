const socketIo = require('socket.io');

const { Files } = require('./db.exports.utils');
const file = Files();

const runQuery = async (queryString, type = "") => {
    const regex = new RegExp(queryString, "i");

    // base query
    const queryObject = {
        $and: [
            { visibility: "public" },
            {
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                    { originalname: { $regex: regex } }
                ]
            }
        ]
    };

    // Add the type condition if provided
    if (type !== "") {
        queryObject.$and.push({ type: type });
    }

    try {
        const queryResults = await file.find(queryObject);

        if (!queryResults) return [];

        return queryResults;
    } catch (error) {
        console.log(error);
        return []
    }
}

const queryAll = async (queryString) => {
    try {
        return await runQuery(queryString);
    } catch (error) {
        console.log("It came from here:", error);
        return []
    }
}
const queryImages = async (queryString) => {
    try {
        return await runQuery(queryString, 'Image File');
    } catch (error) {
        console.log("It came from here:", error);
        return []
    }
}
const queryPdf = async (queryString) => {
    try {
        return await runQuery(queryString, 'PDF document');
    } catch (error) {
        console.log("It came from here:", error);
        return []
    }
}
const queryDoc = async (queryString) => {
    try {
        return await runQuery(queryString, 'Word Document');
    } catch (error) {
        console.log("It came from here:", error);
        return []
    }
}

const handleSearchInputFromClient = async (input) => {
    if (!input || Object.keys(input).length !== 2) return { data: [] };
    const { category, searchInput } = input;
    if (!category || !searchInput) return { data: [] };

    const categoryToMethodMap = {
        all: () => runQuery(searchInput),
        images: () => runQuery(searchInput, 'Image File'),
        pdf: () => runQuery(searchInput, 'PDF document'),
        doc: () => runQuery(searchInput, 'Word Document')
    };
    const queryMethod = categoryToMethodMap[category];
    if (!queryMethod) return { data: [] };

    return { data: await queryMethod() };
}

const setupWebSocketServer = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        socket.on('search', async (input) => {
            console.log('Received search request from client:', input);
            //handle search input
            const searchResults = await handleSearchInputFromClient(input);
            socket.emit("searchResults", { type: "results", results: searchResults });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

module.exports = setupWebSocketServer;
