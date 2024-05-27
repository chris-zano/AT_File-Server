const callAndExecuteRequireStack = (app) => {
     //require routes here
     const adminViewRoutes = require('./routes/admin-view.routes');
     const customerViewRoutes = require('./routes/customer-view.routes');
     const fileRoutes = require('./routes/files.routes');
     const AdminSigninRoutes = require("./routes/admin-signin.routes");
     const CustomerSigninRoutes = require("./routes/customer-signin.routes");


     //use routes here
     app.use(adminViewRoutes);
     app.use(customerViewRoutes);
     app.use(fileRoutes);
     app.use(AdminSigninRoutes);
     app.use(CustomerSigninRoutes);
};

module.exports = {callAndExecuteRequireStack};