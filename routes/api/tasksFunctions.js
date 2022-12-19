const { Task, schemas } = require("../../models/task.schema");

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/tasks:
 *   get:
 *     summary: Return tasks list
 *     description: returns all of the tasks in the system
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: string
 *                         example: Easy
 *                       group:
 *                         type: string
 *                         example: WORK
 *                       type:
 *                         type: string
 *                         example: CHALLENGE
 *                       name:
 *                         type: string
 *                         example: My easy work task
 *                       date:
 *                         type: string
 *                         example: 2023-07-21T17:32:28Z
 *                       progress:
 *                         type: boolean
 *                         example: false
 *                       _id:
 *                         type: string
 *                         example: 639cdd88e9a409da145ced6e
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 *
 */
const getTasks = async (req, res) => {
	const result = await Task.find();
	res.json({ tasks: result });
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/tasks:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Creates new task
 *     description: Create new task
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema:
 *             level:
 *               type: string
 *               enum: [Easy, Normal, Hard]
 *             group:
 *               type: string
 *               enum: [HEALTH, FAMILY, STUFF, LEARNING, LEISURE, WORK]
 *             type:
 *               type: string
 *               enum: [TASK, CHALLENGE]
 *             name:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             progress:
 *               type: boolean
 *             example:
 *               level: Easy
 *               group: WORK
 *               name: My easy work task
 *               date: 2023-07-21T17:32:28Z
 *     responses:
 *       201:
 *         description: Returns a newly created task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: object
 *                   properties:
 *                     level:
 *                       type: string
 *                       example: Easy
 *                     group:
 *                       type: string
 *                       example: WORK
 *                     name:
 *                       type: string
 *                       example: My easy work task
 *                     type:
 *                       type: string
 *                       example: CHALLENGE
 *                     date:
 *                       type: string
 *                       example: 2023-07-21T17:32:28Z
 *                     progress:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: 639cdd88e9a409da145ced6e
 *       400:
 *         description: Error when the validation of request body fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: [{
 *                    "message":"Please enter a task name",
 *                    "path":["name"],
 *                    "type":"string.required",
 *                    "context":{
 *                      "value":"som",
 *                      "label":"name",
 *                      "key":"name"
 *                    }
 *                  }]
 *       401:
 *         description: Error when request lack authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *
 */
const createTask = async (req, res) => {
	const { error } = schemas.createTaskSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details });
		return;
	}
	const result = await Task.create(req.body);
	res.status(201).json({
		task: result.toJSON(),
	});
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/tasks/{taskId}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Removes a task
 *     description: Remove a task by it's id
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to remove
 *     responses:
 *       204:
 *         description: Task was removed (returns empty response body).
 *       404:
 *         description: Error when task with passed taskId does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task with passed taskId '639cdd88e9a409da145ced6e' does not exist"
 *       401:
 *         description: Error when request lack authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *
 */
const deleteTask = async (req, res) => {
	const { taskId } = req.params;
	const { deletedCount } = await Task.deleteOne({ _id: taskId });
	if (!deletedCount) {
		res.status(400).json({
			message: `Task with id: '${taskId}' does not exist`,
		});
		return;
	}
	res.sendStatus(204);
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/tasks/{taskId}:
 *   patch:
 *     security:
 *       - BearerAuth: []
 *     summary: Updates a task
 *     description: Patch details of a task with id = taskId
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema:
 *             level:
 *               type: string
 *               enum: [Easy, Normal, Hard]
 *             group:
 *               type: string
 *               enum: [HEALTH, FAMILY, STUFF, LEARNING, LEISURE, WORK]
 *             type:
 *               type: string
 *               enum: [TASK, CHALLENGE]
 *             name:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             progress:
 *               type: boolean
 *             example:
 *               level: Easy
 *               group: WORK
 *               name: My easy work task
 *               date: 2023-07-21T17:32:28Z
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to update
 *     responses:
 *       204:
 *         description: Updated task successfully (returns an empty response).
 *       400:
 *         description: Error when the validation of request body fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: [{
 *                    "message":"Please enter a task name",
 *                    "path":["name"],
 *                    "type":"string.required",
 *                    "context":{
 *                      "value":"som",
 *                      "label":"name",
 *                      "key":"name"
 *                    }
 *                  }]
 *       404:
 *         description: Error when task with passed taskId does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task with passed taskId '639cdd88e9a409da145ced6e' does not exist"
 *       401:
 *         description: Error when request lack authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *
 */
const updateTask = async (req, res) => {
	const { taskId } = req.params;
	const { error } = schemas.editTaskSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details });
		return;
	}

	const { matchedCount } = await Task.updateOne({ _id: taskId }, req.body);
	if (!matchedCount) {
		res.status(400).json({
			message: `Task with id: '${taskId}' does not exist`,
		});
		return;
	}
	res.sendStatus(204);
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/tasks/{taskId}/finish:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Finish a task
 *     description: Sets progress of a task with id = taskId to `true`
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to finish
 *     responses:
 *       204:
 *         description: Finished task successfully (returns an empty response).
 *       404:
 *         description: Error when task with passed taskId does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task with passed taskId '639cdd88e9a409da145ced6e' does not exist"
 *       401:
 *         description: Error when request lack authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *
 */
const finishTask = async (req, res) => {
	const { taskId } = req.params;

	const { matchedCount } = await Task.updateOne(
		{ _id: taskId },
		{ progress: true }
	);
	if (!matchedCount) {
		res.status(400).json({
			message: `Task with id: '${taskId}' does not exist`,
		});
		return;
	}
	res.sendStatus(204);
};

module.exports = {
	createTask,
	getTasks,
	deleteTask,
	updateTask,
	finishTask,
};
