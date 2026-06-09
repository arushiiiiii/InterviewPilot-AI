const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");


async function authUser(req, res, next) {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized! No token provided."
        })
    }
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalidated. Please login again."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized! Invalid token."
        })
    }
    
    
}

module.exports = { authUser };