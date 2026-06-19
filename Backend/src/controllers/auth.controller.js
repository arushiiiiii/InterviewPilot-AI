const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");


/**
 * @route registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({message: "All fields are required!"})
    }

    const userExists = await User.findOne({
        $or: [{username}, {email}]
    })
    if (userExists) {
        if (userExists.username === username) {
            return res.status(400).json({message: "Username already exists!"})
        }
        return res.status(400).json({message: "Email already exists!"})
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hash,
    })

    const token = jwt.sign(
        { id: user._id, username: username},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    }
    res.cookie("token", token, options)

    res.status(201).json({
        message: "User registered successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "All fields are required!"})
    }

    const user = await User.findOne({email})
    if (!user) {
        return res.status(400).json({
            message: "Invalid email"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign(
        { id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    }
    res.cookie("token", token, options)

    res.status(200).json({
        message: "User logged in successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description clears the token cookie and adds the token to the blacklist collection in the database
 * @access Public
 */

async function logoutUserController(req, res) {
    const token = req.cookies?.token;
    if (token) {
        await BlacklistToken.create({ token });
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });
    res.status(200).json({
        message: "User logged out successfully!"
    });
}


/**
 * @name getMeController
 * @description gets the details of the logged in user
 * @access Private
 */

async function getMeController(req, res) {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        message: "User details fetched successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    getMeController,
    logoutUserController
}