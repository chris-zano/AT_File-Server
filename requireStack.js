const callAndExecuteRequireStack = (app) => {
     //require routes here
     const viewRoutes = require('./routes/view.routes');
     const fileRoutes = require('./routes/files.routes');


     //use routes here
     app.use(viewRoutes);
     app.use(fileRoutes);
};

module.exports = {callAndExecuteRequireStack};