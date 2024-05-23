module.exports.renderGettinStartedPage = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('docs/getting-started');
}

module.exports.renderSigninPage = (req, res) => {
    res.type("text/html");
    res.set("Cache-Control", "public, max-age=10");
    res.status(200);
    res.render('accounts/signin');

}