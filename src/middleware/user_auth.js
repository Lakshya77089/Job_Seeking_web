require("dotenv").config();
const jwt = require("jsonwebtoken");
let users = require("../models/user");

async function user_auth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (token) {
            const jwtPassword = process.env.SECRET_KEY;
            const decoded = jwt.verify(token, jwtPassword);
            let user = await users.findOne({ _id: decoded.id });
            if (!user) return res.redirect("/loginp");
            req.user = user;
            next();
        } else {
            res.redirect("/loginp");
        }
    } catch (err) {
        console.error("Authentication Error: ", err);
        res.clearCookie("token", { path: '/' });
        res.redirect("/loginp");
    }
}

module.exports = user_auth;
