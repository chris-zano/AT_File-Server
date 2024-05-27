const { Customers } = require("../utils/db.exports.utils");
const Customer = Customers();



module.exports.renderGettinStartedPage = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('getting-started');
}

module.exports.renderSigninPage = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('accounts/signin');

}

module.exports.renderAminSigninPage = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('admin/admin.main.ejs',
        {
            pageUrl: "uploads",
            scripts_urls: [],
            stylesheets_urls: ["/files/css/admin/admin.css", "/files/css/admin/uploads.css"]
        }
    );

}

module.exports.renderStoreForUsers = async (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('users/users.main.ejs',
        {
            pageUrl: "home",
            scripts_urls: [],
            stylesheets_urls: ["/files/css/users/users.css", "/files/css/users/store.css"]
        }
    );
}