const { Files } = require("../utils/db.exports.utils")

const file = Files();

module.exports.renderSearchPage = (req, res) => {
    const user = req.verifiedUser;
    res.render(`${req.params.session}/${req.params.session}.main.ejs`, {
        ...user,
        pageUrl: "search",
        scripts_urls: [],
        stylesheets_urls: [],
    })
}