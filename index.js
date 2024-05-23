const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectToDatabase } = require('./utils/monogdb.connect');



const app = express();
const STATIC_FILES_PATH = path.join(__dirname, "public");
const VIEW_ENGINE_TEMPLATES_PATH = path.join(__dirname, "views");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(STATIC_FILES_PATH));

app.set('views', VIEW_ENGINE_TEMPLATES_PATH);
app.set('view engine', 'ejs');

const startServer = async () => {
    try {
        connectToDatabase(
            encodeURIComponent(process.env.MONGO_DB_USERNAME),
            encodeURIComponent(process.env.MONGO_DB_PASSWORD),
            encodeURIComponent(process.env.CLUSTER_NAME),
            encodeURIComponent(process.env.APP_NAME)
        ).then(() => require('./requireStack').callAndExecuteRequireStack(app));

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`app is live at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("failed to connect to database: ", error);
        process.exit(1);
    }

}

startServer().catch(console.error);
