require("dotenv").config({ path: "./.env.local"});
const express = require("express");
const mongoose = require("mongoose");
const url = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const mongodb_url = process.env.MONGODB_URL;

const nxtapp = next({ dev });
const handle = nxtapp.getRequestHandler();
const app = express();

(() => {
    if (!mongodb_url) {
        console.log("Could not attempt database connection due to invalid url");
    } else {
        mongoose.connection.once("open", () => {
            console.log("Database has been connected");
        });

        mongoose.set("strictQuery", true);
        mongoose.connect(mongodb_url);
    }
})();

app.use(express.json());

nxtapp.prepare().then(() => {
    app.use("/api", require("./api"));

    app.all("*", (req, res) => {
        return handle(req, res, url.parse(req.url, true));
    });

    app.listen(port, () => {
        console.log("Server is ready to serve");
    });
});