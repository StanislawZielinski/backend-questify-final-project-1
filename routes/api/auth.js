const express = require("express");

const {
	listCurrent,
	login,
	logout,
	registration,
	authorization,
} = require("./authFunctions");

const router = express.Router();

// /**
//  * @openapi
//  * /api/signup:
//  *   post:
//  *     description: Create new user
//  *     requestBody:
//  *       - content:
//  *         'application/json':
//  *           schema: # Request body contents
//  *             name:
//  *               type: string
//  *             email:
//  *               type: string
//  *             password:
//  *               type: string
//  *             example: # Sample object
//  *               email: test@test.pl
//  *               name: Jessica Smith
//  *               password: test111
//  *     responses:
//  *       201:
//  *         description: Returns a mysterious string.
//  */
router.post("/signup", registration);
router.post("/login", login);
router.get("/logout", authorization, logout);
router.get("/current", authorization, listCurrent);

module.exports = router;
