const express = require("express");

const { authorization } = require("./authFunctions");

const {
	getTasks,
	createTask,
	updateTask,
	deleteTask,
	finishTask,
} = require("./tasksFunctions");

const router = express.Router();

router.get("/", authorization, getTasks);
router.post("/", authorization, createTask);
router.patch("/:taskId", authorization, updateTask);
router.delete("/:taskId", authorization, deleteTask);
router.post("/:taskId/finish", authorization, finishTask);

module.exports = router;
