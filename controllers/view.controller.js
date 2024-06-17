const { Customers, Files } = require("../utils/db.exports.utils");
const Customer = Customers();
const File_ = Files()



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

module.exports.renderAdminViews = async (req, res) => {
    const adminDashboardFilesCollection = await File_.find() || [];

    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);

    res.render('admin/admin.main.ejs',
        {
            id: req.verifiedUser.id,
            username: req.verifiedUser.username,
            profilePicURL: req.verifiedUser.profilePicURL,
            email: req.verifiedUser.email,
            v: req.verifiedUser.v,
            pageUrl: req.params.pageUrl,
            scripts_urls: [`/files/scripts/admin/admin.${req.params.pageUrl}.js`],
            stylesheets_urls: ["/files/css/admin/admin.css", `/files/css/admin/${req.params.pageUrl}.css`],
            fileList: adminDashboardFilesCollection
        }
    );
}

module.exports.renderUserViews = async (req, res) => {
    const user = req.verifiedUser;
    const { pageUrl } = req.params;

    if (pageUrl === "store") {
        try {
            const adminDashboardFilesCollection = await File_.find({ visibility: "public" }) || [];

            res.type("text/html");
            res.set("Cache-Control", "public, max-age=10");
            res.status(200);

            res.render('users/users.main.ejs',
                {
                    ...user,
                    pageUrl: "home",
                    scripts_urls: ['/files/scripts/client/client.store.js'],
                    stylesheets_urls: ["/files/css/users/users.css", "/files/css/users/store.css"],
                    files: adminDashboardFilesCollection
                }
            );
        } catch (error) {
            console.log(error);
            logError(error, req.url, "renderUserViews");
            return res.redirect(`/error/${500}/${url}/Internal_server_error`)
        }
    }
    else {
        res.render('users/users.main.ejs',
            {
                ...user,
                pageUrl: pageUrl,
                scripts_urls: [`/files/scripts/client/client.${pageUrl}.js`],
                stylesheets_urls: ["/files/css/users/users.css", `/files/css/users/${pageUrl}.css`],

            }
        );
    }
}