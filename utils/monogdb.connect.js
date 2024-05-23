const { MongoClient, ServerApiVersion } = require("mongodb");

let client;

module.exports.connectToDatabase = async (username, password, clusterName, appName) => {

    if (client) {
        return client;
    }

    const uri = `mongodb+srv://${username}:${password}@${clusterName}.jwscxvu.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });


    try {
        await client.connect();
        console.log("connected successfully to the server");
        return client;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await client.close();
    //     console.log("connection to client has closed");
    // }

}

module.exports.getDatabase = async () => {
    if (!client) {
        return await client.db("at-file_server");
        // throw new Error("Client is not connected!. Make sure to connect to database first!");
    }

    return client.db("at-file_server");
}

module.exports.closeDatabaseConnection = async () => {
    try {
        await client.close();
        console.log("connection successfully closed!");
        return 0;
    }
    catch(error) {
        throw new Error("Failed to close connection to client");
    }
}