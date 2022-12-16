const express = require("express");

const {
	listCurrent,
	login,
	logout,
	registration,
	authorization,
} = require("./authFunctions");

const router = express.Router();

router.post("/signup", registration);
router.post("/login", login);
router.get("/logout", authorization, logout);
router.get("/current", authorization, listCurrent);

module.exports = router;
