const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");

const user = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true }
);

const User = mongoose.model("User", user);

const registerSchema = joi.object({
	name: joi.string().required(),
	email: joi.string().required(),
	password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
	email: joi.string().required(),
	password: joi.string().min(6).required(),
});

const schemas = {
	registerSchema,
	loginSchema,
};

module.exports = {
	User,
	schemas,
};
