const express = require('express');
const path = require("path");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


const app = express();
const STATIC_FILES_PATH = path.join(__dirname, "public");
const VIEW_ENGINE_TEMPLATES_PATH = path.join(__dirname, "views");

dotenv.config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(STATIC_FILES_PATH));

app.set('views', VIEW_ENGINE_TEMPLATES_PATH);
app.set('view engine', 'ejs');

app.use((req, res) => {
    res.end("Setup is initiated.");
});

const { MongoClient, ServerApiVersion } = require("mongodb");

const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const clusterName = encodeURIComponent(process.env.CLUSTER_NAME);
const appName = encodeURIComponent(process.env.APP_NAME);

const uri = `mongodb+srv://${username}:${password}@${clusterName}.jwscxvu.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

run().catch(console.dir);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app is live at http://localhost:${PORT}`);
});