const fs = require("fs");
const path = require("path");

const DEFAULT_PROFILE_IMAGE = path.resolve(__dirname, "..", "public", "assets", "images", "user_blank.png")

module.exports.serveScripts = (req, res) => {
    if (req.params.filename) {
        const scriptFilePath = path.join(__dirname, "..", "public", "js", req.params.directory, req.params.filename);

        if (!(fs.existsSync(scriptFilePath))) {
            res.status(404).end();
            return;
        }

        res.type("text/javascript");
        res.set("Cache-Control", "public, max-age=10");
        res.status(200);
        fs.createReadStream(scriptFilePath).pipe(res);
    }
    else {
        res.status(404).end();
        return;
    }
}

module.exports.serveStyleSheets = (req, res) => {
    if (req.params.filename) {
        const { directory, filename } = req.params;
        const styleSheetFilePath = path.join(__dirname, "..", "public", "css", directory, filename);

        if (!(fs.existsSync(styleSheetFilePath))) {
            console.log(styleSheetFilePath, " does not exist");
            res.status(404).end();
            return;
        }

        res.type("css");
        // res.set("Cache-Control", "public, max-age=10");
        res.status(200);
        fs.createReadStream(styleSheetFilePath).pipe(res);
    }
    else {
        res.status(404).end();
        return;
    }
}

module.exports.serveTypeface = (req, res) => {
    const { filename } = req.params;
    if (filename) {
        const typefaceFilePath = path.join(__dirname, "..", "public", "assets", "fonts", filename);

        if (!(fs.existsSync(typefaceFilePath))) {
            res.status(404).end();
            return;
        }

        res.type("font/ttf");
        res.set("Cache-Control", "public, max-age=86400");
        res.status(200);
        fs.createReadStream(typefaceFilePath).pipe(res);
    }
    else {
        res.status(404).end();
        return;
    }
}

module.exports.serveFavicon = (req, res) => {
    const faviconFilePath = path.join(__dirname, "..", "public", "assets", "icons", 'favicon.ico');

    if (!(fs.existsSync(faviconFilePath))) {
        res.status(404).end();
        return;
    }

    res.set('Cache-Control', 'public, max-age=86400');
    res.type('image/x-icon');
    fs.createReadStream(faviconFilePath).pipe(res);
}

module.exports.serveSystemImages = (req, res) => {
    const { filename } = req.params;
    if (filename) {
        const systemImagesFilePath = path.join(__dirname, "..", "public", "assets", "images", filename);

        if (!(fs.existsSync(systemImagesFilePath))) {
            res.status(404).end();
            return;
        }

        res.set('Cache-Control', 'public, max-age=60');
        res.type('png');
        fs.createReadStream(systemImagesFilePath).pipe(res);
    }
    else {
        res.status(404).end();
        return;
    }
}

module.exports.serveUserProfilePictures = (req, res) => {
    const { filename } = req.params;
    if (filename) {
        const userImagePath = path.join(__dirname, "..", "AT-FS", "images", "profile_pictures", filename);

        if (!(fs.existsSync(userImagePath))) {
            res.type("png");
            res.status(404)
            fs.createReadStream(DEFAULT_PROFILE_IMAGE).pipe(res);
            return;
        }

        res.set('Cache-Control', 'public, max-age=30');
        res.type('png');
        fs.createReadStream(userImagePath).pipe(res);
    }
    else {
        res.status(404).end();
        return;
    }
}

module.exports.serveStoreImages = (req, res) => {
    const { filename } = req.params;
    if (filename) {
        const filePath = path.join(__dirname, "..", "AT-FS", "images", "store_images", filename);

        if (!(fs.existsSync(filePath))) {
            res.type("png");
            res.status(404)
            fs.createReadStream(DEFAULT_PROFILE_IMAGE).pipe(res);
            return;
        }

        res.set('Cache-Control', 'public, max-age=30');
        res.type('png');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        res.status(404);
        return;
    }
}