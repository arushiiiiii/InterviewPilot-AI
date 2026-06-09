const { Router } = require('express');
const { registerUserController, loginUserController, logoutUserController, getMeController } = require('../controllers/auth.controller')
const { authUser } = require('../middlewares/auth.middleware');

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/login", loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get("/logout", logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the logged in user
 * @access Private
 */
authRouter.get("/get-me", authUser, getMeController )

module.exports = authRouter;