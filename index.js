const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const STATIC_FILES_PATH = path.join(__dirname, "public");
const VIEW_ENGINE_TEMPLATES_PATH = path.join(__dirname, "views");

//Middleware setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(STATIC_FILES_PATH));

//view engine setup
app.set('views', VIEW_ENGINE_TEMPLATES_PATH);
app.set('view engine', 'ejs');

//Databse Credentials
const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const clusterName = encodeURIComponent(process.env.CLUSTER_NAME);
const appName = encodeURIComponent(process.env.APP_NAME);
const databasename = encodeURIComponent(process.env.DATABASE_NAME);

const uri = `mongodb+srv://${username}:${password}@${clusterName}.jwscxvu.mongodb.net/${databasename}?retryWrites=true&w=majority&appName=${appName}`;

//Connect to Database and start server
(async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');

        // Call and execute require stack
        require('./requireStack').callAndExecuteRequireStack(app);

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`App is live at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
})();

