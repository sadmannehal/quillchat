const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

class Middleware {
    static checkAuth (req, res, next) {
        const auth = req.headers.authorization;
        const token = auth && auth.split("Bearer ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
            if (err) return res.status(403).json({ message: "Invalid token" });

            userModel.findOne({ _id: data.id }, (err, user) => {
                if (err) return res.status(500).json({ message: "Internal server error" });

                req.user = user;
                next();
            });
        });
    }
}

module.exports = Middleware;