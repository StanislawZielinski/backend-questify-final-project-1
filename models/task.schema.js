const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");

const LEVELS = ["Easy", "Normal", "Hard"];
const GROUPS = ["HEALTH", "FAMILY", "STUFF", "LEARNING", "LEISURE", "WORK"];
const TYPES = ["TASK", "CHALLENGE"];

const task = new Schema(
	{
		level: {
			type: String,
			enum: {
				values: LEVELS,
				message: `Please enter a valid level [${LEVELS.toString()}]`,
			},
			required: [true, "Please enter a level"],
		},
		group: {
			type: String,
			enum: {
				values: GROUPS,
				message: `Please enter a valid group name [${GROUPS.toString()}]`,
			},
			required: [true, "Please enter a group"],
		},
		type: {
			type: String,
			enum: {
				values: TYPES,
				message: `Please enter a valid type name [${TYPES.toString()}]`,
			},
			default: TYPES[0],
		},
		name: {
			type: String,
			required: [true, "Please enter a task name"],
		},
		date: {
			type: Date,
			required: [true, "Please enter a task date"],
		},
		progress: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

const Task = mongoose.model("Task", task);

const createTaskSchema = joi.object({
	level: joi
		.string()
		.valid(...LEVELS)
		.required(),
	group: joi
		.string()
		.valid(...GROUPS)
		.required(),
	type: joi.string().valid(...TYPES),
	name: joi.string().min(6).required(),
	date: joi.date().required(),
	progress: joi.boolean(),
});

const editTaskSchema = joi.object({
	level: joi.string().valid(...LEVELS),
	group: joi.string().valid(...GROUPS),
	type: joi.string().valid(...TYPES),
	name: joi.string().min(6),
	date: joi.date(),
	progress: joi.boolean(),
});

const schemas = {
	createTaskSchema,
	editTaskSchema,
};

module.exports = {
	Task,
	schemas,
};
