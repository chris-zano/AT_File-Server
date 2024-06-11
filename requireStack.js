const setupWebSocketServer = require('./utils/socket.utils');

const callAndExecuteRequireStack = (app, server) => {
     const io = setupWebSocketServer(server);
     //require routes here
     const adminViewRoutes = require('./routes/admin-view.routes');
     const adminRoutes = require('./routes/admin.routes');
     const customerViewRoutes = require('./routes/customer-view.routes');
     const fileRoutes = require('./routes/files.routes');
     const AdminSigninRoutes = require("./routes/admin-signin.routes");
     const CustomerSigninRoutes = require("./routes/customer-signin.routes");
     const authRoutes = require('./routes/auth.routes');
     const recoveryRoutes = require('./routes/recovery.routes');


     //use routes here
     app.use(authRoutes);
     app.use(adminViewRoutes);
     app.use(adminRoutes);
     app.use(customerViewRoutes);
     app.use(fileRoutes);
     app.use(AdminSigninRoutes);
     app.use(CustomerSigninRoutes);
     app.use(recoveryRoutes);
};

module.exports = {callAndExecuteRequireStack};