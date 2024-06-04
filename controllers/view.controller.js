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
    res.render('accounts/admin-signin.ejs',
        {
            pageUrl: "uploads",
            scripts_urls: [],
            stylesheets_urls: ["/files/css/admin/admin.css"]
        }
    );

}

module.exports.renderAdminViews = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('admin/admin.main.ejs',
        {
            id: req.verifiedUser.id,
            username: req.verifiedUser.username,
            profilePicURL: req.verifiedUser.profilePicURL,
            email: req.verifiedUser.email,
            pageUrl: req.params.pageUrl,
            scripts_urls: [],
            stylesheets_urls: ["/files/css/admin/admin.css", `/files/css/admin/${req.params.pageUrl}.css`]
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
            stylesheets_urls: ["/files/css/users/users.css", "/files/css/users/store.css"],
            files: [
                {
                    type: "image",
                    thumbnailUrl: "/files/favicon",
                    title: "This is a new brthday card image",
                    description: "This is the description of a birthday description"
                },
                {
                    type: "image",
                    thumbnailUrl: "/files/favicon",
                    title: "This is a new brthday card image",
                    description: "This is the description of a birthday description"
                },
                {
                    type: "image",
                    thumbnailUrl: "/files/favicon",
                    title: "This is a new brthday card image",
                    description: "This is the description of a birthday description"
                },
                {
                    type: "image",
                    thumbnailUrl: "/files/favicon",
                    title: "This is a new brthday card image",
                    description: "This is the description of a birthday description"
                },
                {
                    type: "image",
                    thumbnailUrl: "/files/favicon",
                    title: "This is a new brthday card image",
                    description: "This is the description of a birthday description"
                }
            ]
        }
    );
}