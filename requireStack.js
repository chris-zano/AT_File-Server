const callAndExecuteRequireStack = (app) => {
     //require routes here
     const viewRoutes = require('./routes/view.routes');
     const fileRoutes = require('./routes/files.routes');
     const signinRoutes = require("./routes/signin.routes");


     //use routes here
     app.use(viewRoutes);
     app.use(fileRoutes);
     app.use(signinRoutes);
};

module.exports = {callAndExecuteRequireStack};